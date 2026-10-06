<script lang="ts" setup>
import ChatsBar from './components/ChatsBar.vue'
import ChatView from './views/ChatView.vue'
import SettingsView from './views/SettingsView.vue'
import ConfirmModal from './components/overlays/ConfirmModal.vue'
import { useChatStore } from './stores/chatStore.ts'
import { useConfirmStore } from './stores/ui/confirm.ts'
import { useAppUpdateStore } from './stores/updateStore.ts'
import { onMounted } from 'vue'
import { IS_TAURI } from './utils/runtime.ts'
import UpdateModal from './components/overlays/UpdateModal.vue'
import OnboardingView from './views/OnboardingView.vue'

const store = useChatStore()
const uiConfirm = useConfirmStore()
const updateStore = useAppUpdateStore()

onMounted(() => {
  if (IS_TAURI) {
    setTimeout(() => {
      checkForUpdates()
    }, 5000)
  }
})

async function checkForUpdates() {
  await updateStore.checkForUpdates()
}
</script>

<template>
  <div class="main-layout">
    <ChatsBar />
    <div class="chat-layout">
      <OnboardingView v-if="!store.onboardingViewed" />
      <ChatView v-else-if="store.view === 'chat'" />
      <SettingsView v-else-if="store.view === 'settings'" />
    </div>
  </div>

  <ConfirmModal
    v-if="uiConfirm.isOpen"
    :title="uiConfirm.title"
    :message="uiConfirm.message"
    :confirm-text="uiConfirm.confirmText"
    @confirm="uiConfirm.resolve(true)"
    @cancel="uiConfirm.resolve(false)"
  />

  <UpdateModal v-if="updateStore.showUpdateModal" />
</template>

<style lang="scss">
.chat-layout {
  width: 100%;
  height: 100dvh;
  display: flex;
  justify-content: center;
  max-height: 100dvh;
  overflow-y: auto;
  background-color: var(--chat-background);
  border-left: var(--border);
}
</style>
