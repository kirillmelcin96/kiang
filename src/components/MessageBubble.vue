<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { roles } from '../types/messages';
import { marked } from 'marked';
import markedKatex from 'marked-katex-extension';
import { useChatStore } from '../stores/chatStore';
import hljs from 'highlight.js'
import CopyIcon from '../icons/CopyInBuffer.vue'
import CheckIcon from '../icons/Check.vue'

const store = useChatStore()

const props = defineProps<{
    role: roles,
    content: string,
}>()

const messageCopied = ref(false)

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

async function copyMessage() {
    if (messageCopied.value) return

    messageCopied.value = true

    await navigator.clipboard.writeText(props.content ?? '')

    setTimeout(() => {
        messageCopied.value = false
    }, 1500)
}
</script>

<template>
    <!-- TODO: Create separate components for assistant and user messages -->
    <template v-if="role === 'assistant'">
        <div 
            v-html="parsedOutput"
            class="assistant-message"
            ref="messageContent"
            @click="copyCode"
        />
        <div class="assistant-message__footer">
            <div class="assistant-message__footer-button" @click="copyMessage">
                <CopyIcon v-show="!messageCopied" />
                <CheckIcon v-show="messageCopied"/>
            </div>
        </div>
    </template>
    <div 
        v-else
        class="chat-bubble"
        :class="{'chat-bubble--incognito': store.incognitoMode}"
    >
        {{ props.content }}
    </div>
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
    &__footer {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 8px;
        margin: 0 0 32px 0;

        &-button {
            cursor: pointer;
            opacity: .8;

            &:hover {
                opacity: 1;
            }

            svg {
                width: 20px;
                height: 20px;
            }
        }
    }
}
</style>