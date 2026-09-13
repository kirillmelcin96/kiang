<script lang="ts" setup>
import ChatsBar from './components/ChatsBar.vue';
import ChatView from './views/ChatView.vue';
import SettingsView from './views/SettingsView.vue';
import { useChatStore } from './stores/chatStore.ts'

const store = useChatStore()
</script>

<template>
  <div class="main-layout">
    <ChatsBar />
    <div class="chat-layout">
      <ChatView v-if="store.view === 'chat'" />
      <SettingsView v-else-if="store.view === 'settings'" />
    </div>
  </div>
</template>

<style lang="scss">
.chat-layout {
  width: 100%;
  height: 100dvh;
  display: flex;
  justify-content: center;
  max-height: 100dvh;
  overflow-y: auto;
  background-color: #131313;
  border-left: 1px solid #242424;
}

@media screen and (max-width: 768px) {
  .chat-layout {
    width: 100%;
    height: 100dvh;
    margin: 0;
    border-radius: 0;
  }
}
</style>