<script lang="ts" setup>
import { computed } from 'vue';
import type { roles } from '../types/messages';
import { marked } from 'marked';
import markedKatex from 'marked-katex-extension';
import { useChatStore } from '../stores/chatStore';
import hljs from 'highlight.js'

const store = useChatStore()

const props = defineProps<{
    role: roles,
    content: string,
}>()

marked.use(
    {
        gfm: true,
        breaks: true,
        pedantic: false,

        renderer: {
            code({ text, lang }) {
                const language = lang && hljs.getLanguage(lang)
                    ? lang
                    : 'plaintext'

                const highlighted = hljs.highlight(text, {
                    language
                }).value

                return `
                    <div class="code-block">
                        <div class="code-header">
                            <span class=muted>${language}</span>
                            <button data-copy-code type="button">Copy</button>
                        </div>

                        <pre><code class="hljs language-${language}">${highlighted}</code></pre>
                    </div>`
            }
        }
    }, 
    markedKatex({
        throwOnError: false
    })
)

const parsedOutput = computed(() => {
    return marked.parse(props.content)
})

// AI-ASSISTED (ChatGPT): helped with handling copy button click event
const copyCode = async (event: Event) => {
    const button = event.target
    if (!(button instanceof HTMLButtonElement)) return

    const codeBlock = button.closest('.code-block')
    if (!codeBlock) return

    const rawCode = codeBlock.querySelector('pre code')
    if (!rawCode) return

    await navigator.clipboard.writeText(rawCode.textContent ?? '')

    button.textContent = 'Copied!'

    setTimeout(() => {
        button.textContent = 'Copy'
    }, 1500)
}
</script>

<template>
    <div 
        v-if="role === 'assistant'"
        v-html="parsedOutput"
        class="assistant-message"
        ref="messageContent"
        @click="copyCode"
    />
    <div v-else class="chat-bubble" :class="{'chat-bubble--incognito': store.incognitoMode}">{{ props.content }}</div>
</template>

<style lang="scss" scoped>
.chat-bubble {
    display: inline-flex;
    border-radius: 16px 16px 4px 16px;
    max-width: 450px;
    padding: 10px 16px;
    background-color: #224998;
    margin: 0 0 32px auto;

    &--incognito {
        background-color: transparent;
        border: 2px dashed #ffffff30;
    }
}

.assistant-message {
    margin: 0 0 32px 0;
}
</style>