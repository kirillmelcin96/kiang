<script lang="ts" setup>
import { computed } from 'vue';
import type { roles } from '../types/messages';
import { marked } from 'marked';
import markedKatex from 'marked-katex-extension';
import { useChatStore } from '../stores/chatStore';

const store = useChatStore()

const props = defineProps<{
    role: roles,
    content: string,
}>()

marked.use({
  gfm: true,
  breaks: true,
  pedantic: false,
}, markedKatex({
    throwOnError: false
}));

const parsedOutput = computed(() => {
    return marked.parse(props.content)
})
</script>

<template>
    <div v-if="role === 'assistant'" v-html="parsedOutput" class="assistant-message" />
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