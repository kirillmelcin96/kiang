<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { roles } from '../types/messages'
import { marked } from 'marked'
import markedKatex from 'marked-katex-extension'
import { useChatStore } from '../stores/chatStore'
import hljs from 'highlight.js'
import CopyIcon from '../icons/CopyInBuffer.vue'
import CheckIcon from '../icons/Check.vue'

const store = useChatStore()

const props = defineProps<{
  role: roles
  content: string
}>()

const messageCopied = ref(false)

marked.use(
  {
    gfm: true,
    breaks: true,
    pedantic: false,

    renderer: {
      code({ text, lang }) {
        const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext'

        const highlighted = hljs.highlight(text, {
          language,
        }).value

        return `
          <div class="code-block">
              <div class="code-header">
                  <span class=muted>${language}</span>
                  <button data-copy-code type="button">Copy</button>
              </div>

              <pre><code class="hljs language-${language}">${highlighted}</code></pre>
          </div>`
      },
    },
  },
  markedKatex({
    throwOnError: false,
  }),
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
    <div ref="messageContent" class="assistant-message" @click="copyCode" v-html="parsedOutput" />
    <div v-show="!store.isLoading" class="assistant-message__footer">
      <div class="assistant-message__footer-button" @click="copyMessage">
        <CopyIcon v-show="!messageCopied" />
        <CheckIcon v-show="messageCopied" />
      </div>
    </div>
  </template>
  <div v-else class="chat-bubble" :class="{ 'chat-bubble--incognito': store.incognitoMode }">
    {{ props.content }}
  </div>
</template>

<style lang="scss" scoped>
.chat-bubble {
  display: inline-flex;
  border-radius: 16px 16px 4px 16px;
  max-width: 450px;
  padding: 10px 16px;
  color: var(--chat-bubble-color);
  background-color: var(--chat-bubble-background);
  margin: 32px 0 0 auto;
  white-space: pre-wrap;

  &::selection {
    // Revert colors
    color: var(--chat-bubble-background);
    background-color: var(--chat-bubble-color);
  }

  &--incognito {
    background-color: var(--chat-bubble-incognito-background);
    border: var(--chat-bubble-incognito-border);

    &::selection {
      // Revert colors
      color: var(--chat-bubble-incognito-background);
      background-color: var(--chat-bubble-color);
    }
  }
}

.assistant-message {
  margin: 32px 0 0 0;

  &__footer {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;

    &-button {
      width: 20px;
      height: 20px;
      cursor: pointer;
      opacity: 0.8;

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
