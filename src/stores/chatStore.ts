import { toRaw } from 'vue'
import { defineStore } from 'pinia'
import { useSettingsStore } from './settingsStore.ts'
import type { chatMessage, roles, Chat } from '../types/messages'
import { 
    deleteChatIDB, 
    loadAllChatsIDB, 
    loadOneChatIDB, 
    saveChatIDB, 
    updateChatIDB,
    updateChatTitleIDB,
} from '../database'
import { saveAs } from 'file-saver'

let controller: AbortController;

// State types
interface State {
    view: 'chat' | 'settings',
    chatsList: Chat[],
    chatId: null | number,
    model: string,
    availableModels: string[],
    messages: chatMessage[],
    streamingMessage: string,
    isLoading: boolean,
    isError: boolean,
    thinkMode: boolean,
    incognitoMode: boolean,
}

export const useChatStore = defineStore('chat', {
  state: (): State => ({
    view: 'chat',
    chatsList: [],
    chatId: null,
    model: '',
    availableModels: [],
    messages: [] as chatMessage[],
    streamingMessage: '',
    isLoading: false,
    isError: false,
    thinkMode: false,
    incognitoMode: false,
  }),
  getters: {
    // Empty
  },
  actions: {
    async updateChatsList() {
        this.chatsList = await loadAllChatsIDB()
    },
    async sendMessage(content: string) {
        if (!this.model) return

        this.addUserMessage(content)
        this.isLoading = true

        const isNewChat = this.messages.length == 1

        // Handling generation interrupts
        if (controller) {
            controller.abort(); 
        }

        controller = new AbortController();
        const signal = controller.signal;

        // Adding info from settings
        const settingsStore = useSettingsStore()

        if (isNewChat && !this.incognitoMode) {
            let title = 'Untitled'

            try {
                const res = await fetch(settingsStore.ollamaApiUrl + '/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: this.model,
                        prompt: `Write a one-sentence title for the next user message: "${content}". Response without quotation marks. Max sentence length is 30 symbols. Try to be as concise as possible. Use the same language as in the message`,
                        stream: false,
                        think: false
                    }),
                    signal: signal // Token of cancel (AbortController)
                })

                const generatedTitle = await res.json();

                title = generatedTitle.response
            } catch (e) {
                console.error(e)
            }

            this.chatId = await saveChatIDB(title, toRaw(this.messages), this.model)
            await this.updateChatsList()
        }

        // Adding system prompt if provided
        const history = [...this.messages]

        if (settingsStore.systemPrompt.length) {
            const systemPromptMessage: chatMessage = {
                "role": "system",
                "content": settingsStore.systemPrompt
            }

            history.unshift(systemPromptMessage)
        }

        try {
            // Try to get response from apy
            this.isError = false

            const res = await fetch(settingsStore.ollamaApiUrl + '/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.model,
                    messages: history,
                    stream: true,
                    think: this.thinkMode
                }),
                signal: signal // Token of cancel (AbortController)
            })

            const reader = res.body!.getReader()
            const decoder = new TextDecoder()

            // Parsing stream data
            while (true) {
                const { value, done } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value)
                for (const line of chunk.split('\n')) {
                    if (!line) continue
                    const json = JSON.parse(line)

                    if (json.message?.content) {
                        this.streamingMessage += json.message.content
                    }

                    if (json.done) {
                        this.addAssistantMessage('assistant', this.streamingMessage)
                        this.streamingMessage = ''
                        this.isLoading = false

                        if (this.chatId && !this.incognitoMode) {
                            await updateChatIDB(toRaw(this.chatId), toRaw(this.messages))
                            await this.updateChatsList()
                        }
                    }
                }
            }
        } catch (e) {
            console.error(e)
            // Showing error
            this.isLoading = false
            this.isError = true

            // TODO: Different error info if user cancelled the request
            // if (error.name === 'AbortError') {}
        }
    },
    breakMessage() {
        controller.abort();
    },
    addUserMessage(content: string) {
      this.messages.push({ role: "user", content })
    },
    addAssistantMessage(role: roles, content: string) {
      this.messages.push({ role, content })
    },
    async getLocalModels() {
        // Adding info from settings
        const settingsStore = useSettingsStore()

        try {
            const res = await fetch(settingsStore.ollamaApiUrl + '/api/tags', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })

            const modelsList = await res.json();
            this.availableModels = modelsList.models.map((m: any) => m.name).sort()
            // Set default model
            if (this.model && this.availableModels.includes(this.model)) {
                // Don't change the last model if the model is available
            } else if (this.availableModels.length) {
                this.model = this.availableModels[0]!
            } else {
                this.model = ''
            }
        } catch (e) {
            // No models were found
            this.model = ''
            this.availableModels = []
        }
    },
    newChat() {
        this.view = 'chat'
        this.chatId = null
        this.messages = []
        this.streamingMessage = ''
        this.incognitoMode = false
        this.isLoading = false
        this.isError = false
    },
    openSettings() {
        this.view = 'settings'
    },
    async selectChat(id: number) {
        const chat = await loadOneChatIDB(id)

        if (!chat) return

        this.view = 'chat'
        this.incognitoMode = false
        this.chatId = chat.id
        this.messages = chat.messages
        this.model = chat.model
    },
    async deleteChat(id: number) {
        await deleteChatIDB(id)
        if (id == this.chatId) {
            this.newChat()
        }
        await this.updateChatsList()
    },
    async updateChatTitle(id: number, newTitle: string) {
        await updateChatTitleIDB(id, newTitle)
        await this.updateChatsList()
    },
    async exportChatAsJSON(id: number) {
        const chat = await loadOneChatIDB(id)

        if (!chat) return

        const date = new Date(chat.createdAt < 1e12 ? chat.createdAt * 1000 : chat.createdAt)
        const dateFormatted = new Intl.DateTimeFormat('sv-SE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(date)
        const timeFormatted = new Intl.DateTimeFormat('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(date).replace(':', '-')

        const fileName = `${chat.model}_${dateFormatted}_${timeFormatted}`
        const jsonString = JSON.stringify(chat, null, 2);

        const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });

        saveAs(blob, fileName + ".json");
    },
    async getChatMetadata(id: number) {
        // if (id === null) return {}

        const chat = await loadOneChatIDB(id) as Chat

        return chat
    },
    switchThinkMode() {
        this.thinkMode = !this.thinkMode
    },
    switchIncognitoMode() {
        this.incognitoMode = !this.incognitoMode
    },
  },
})