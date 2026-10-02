<script lang="ts" setup>
import EditPencilIcon from '../../icons/EditPencil.vue'
import ExportFileIcon from '../../icons/ExportFile.vue'
import DeleteIcon from '../../icons/Delete.vue'
import type { ChatsBarContextMenuButton } from '../../types/menues.ts'
import { useChatStore } from '../../stores/chatStore.ts'
import { useConfirmStore } from '../../stores/ui/confirm.ts'
import { computed } from 'vue'
import { IS_WEB } from '../../utils/runtime.ts'

const props = defineProps<{
  id: number
  title: string
}>()
const emit = defineEmits(['close-context-menu', 'edit-title'])

const chatStore = useChatStore()
const uiConfirm = useConfirmStore()

const contextMenuButtons: ChatsBarContextMenuButton[] = [
  {
    title: 'Edit Name',
    icon: EditPencilIcon,
    handler: editTitle,
    hideInTauri: false,
  },
  {
    title: 'Export as JSON',
    icon: ExportFileIcon,
    handler: exportJSON,
    hideInTauri: true,
  },
  {
    title: 'Delete',
    icon: DeleteIcon,
    handler: deleteChat,
    isDelete: true,
    hideInTauri: false,
  },
]

const filteredContextMenuButtons = computed(() => {
  if (IS_WEB) return contextMenuButtons
  return contextMenuButtons.filter((item) => !item.hideInTauri)
})

function editTitle() {
  emit('edit-title')
}

async function exportJSON() {
  await chatStore.exportChatAsJSON(props.id)
  emit('close-context-menu')
}

async function deleteChat() {
  const confirmed = await uiConfirm.confirm({
    title: 'Delete Chat?',
    message: `Chat <b>"${props.title}"</b> will be deleted forever`,
    confirmText: 'Delete',
  })

  emit('close-context-menu')

  if (!confirmed) return

  chatStore.deleteChat(props.id)
}
</script>

<template>
  <div class="context-menu">
    <div
      v-for="button in filteredContextMenuButtons"
      :key="button.title"
      class="context-menu-button"
      :class="{ 'context-menu-button--delete': button.isDelete }"
      @click="button.handler"
    >
      <component :is="button.icon" class="context-menu-button__icon"></component>
      {{ button.title }}
    </div>

    <Teleport to="body">
      <div class="context-menu-overlay" @click="emit('close-context-menu')"></div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.context-menu-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 98;
}

.context-menu {
  padding: 8px;
  border-radius: 16px;
  border: var(--card-border);
  background-color: var(--card-background);
  box-shadow: var(--card-shadow);
  min-width: 220px;
  z-index: 99;
}

.context-menu-button {
  width: 100%;
  display: flex;
  gap: 4px;
  padding: 6px 8px;
  margin-bottom: 1px;
  border-radius: var(--radius-md);
  font-size: 15px;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  user-select: none;
  cursor: pointer;

  &__icon {
    width: 18px;
    height: 18px;
    margin-top: 2px;
  }

  &:hover {
    background-color: var(--button-context-background-hover);
  }

  &--delete {
    color: var(--button-error-color);

    &:hover {
      background-color: var(--button-error-background);
    }
  }
}
</style>
