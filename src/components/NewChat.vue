<script setup lang="ts">
import ModelsSelector from './ModelsSelector.vue'
import { useChatStore } from '../stores/chatStore.ts'
import IncognitoFillIcon from '../icons/IncognitoFill.vue'

const store = useChatStore()
</script>

<template>
  <div class="new-chat-block">
    <h1 v-if="!store.incognitoMode">New Chat</h1>
    <h1 v-else>New Temporary Chat</h1>
    <ModelsSelector />
    <div v-if="store.incognitoMode" class="incognito-instruction">
      <div class="incognito-instruction__title">
        <IncognitoFillIcon />
        <b>Incognito Mode Enabled</b>
      </div>
      <span class="muted">This chat is temporary and won't be saved in the chat history</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.new-chat-block {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1 {
    user-select: none;
    text-align: center;
    margin-bottom: 0;
  }
}

.incognito-instruction {
  // background-color: #ffffff10;
  margin-top: 20px;
  border-radius: var(--radius-md);
  padding: 12px;
  border: var(--chat-bubble-incognito-border);
  user-select: none;

  &__title {
    color: var(--incognito-color);
  }

  svg {
    width: 17px;
    height: 17px;
    margin-bottom: -3px;
    margin-right: 2px;
  }
}
</style>
