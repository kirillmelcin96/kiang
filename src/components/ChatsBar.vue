<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useChatStore } from '../stores/chatStore'
import type { ChatsBarMenuButton } from '../types/menues.ts'
import EditLine from '../icons/EditLine.vue'
import SettingsIcon from '../icons/Settings.vue'
import ChatsBarButton from './ChatsBarButton.vue'
import { useAppUpdateStore } from '../stores/updateStore.ts'
import AppUpdateNotification from './AppUpdateNotification.vue'

const store = useChatStore()
const updateStore = useAppUpdateStore()

const menuButtons = ref<ChatsBarMenuButton[]>([
  {
    title: 'New chat',
    icon: EditLine,
    handler: newChat,
  },
  {
    title: 'Settings',
    icon: SettingsIcon,
    handler: openSettings,
  },
])

onMounted(() => {
  store.updateChatsList()
})

function newChat() {
  store.newChat()
}

function openSettings() {
  store.openSettings()
}
</script>

<template>
  <div class="chats-bar">
    <h2 class="title">Kiang</h2>

    <!-- Menu Buttons -->
    <div class="chat-bar-menu">
      <div
        v-for="button in menuButtons"
        :key="button.title"
        class="chats-bar-button"
        @click="button.handler"
      >
        <component :is="button.icon" class="chats-bar-button__icon"></component>
        {{ button.title }}
      </div>
    </div>

    <!-- Update Notification -->
    <AppUpdateNotification v-if="updateStore.updateAvailable" />

    <!-- Chats List -->
    <p class="subtitle">Your chats</p>
    <ChatsBarButton
      v-for="chat in store.chatsList"
      :id="chat.id"
      :key="chat.id"
      :title="chat.title"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/breakpoints' as *; // Instead of media queries

.chats-bar {
  padding: 16px 12px;
  height: 100dvh;
  overflow-y: auto;
}

@include media('max', 'md') {
  .chats-bar {
    display: none;
  }
}

.title {
  // text-align: center;
  font-family: var(--font-ui);
  margin-top: 0;
  margin-left: 8px;
}

.subtitle {
  color: var(--dimmer-muted-color);
  font-size: var(--font-xs);
  font-weight: var(--font-bold);
  padding: 0;
  margin: 12px 0 4px 8px;
  user-select: none;
}

.chats-bar-button {
  width: 100%;
  display: flex;
  gap: 4px;
  padding: 6px 8px;
  margin-bottom: 4px;
  border-radius: var(--radius-md);
  font-size: 15px;
  background-color: var(--button-chatsbar-background);
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  user-select: none;
  cursor: pointer;

  &__text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    min-width: 0;
    width: 100%;
  }

  &__icon {
    width: 18px;
    height: 18px;
    margin-top: 2px;
  }

  &:hover {
    background-color: var(--button-chatsbar-background-hover);
  }

  &__active {
    cursor: default;
    background-color: var(--button-chatsbar-background-hover);
  }
}
</style>
