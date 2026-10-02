<script lang="ts" setup>
import { computed, ref, nextTick } from 'vue'
import { useFloating, offset, shift } from '@floating-ui/vue'
import { useChatStore } from '../stores/chatStore'
import DotsIcon from '../icons/Dots.vue'
import ChatsBarContextMenu from './overlays/ChatsBarContextMenu.vue'

const store = useChatStore()

const props = defineProps<{
  id: number
  title: string
}>()

const contextMenuOpened = ref(false)
const contextMenuChatId = ref<number | null>(null)
const isEditTitle = ref(false)
const editTitleRef = ref<HTMLInputElement>()
const newTitle = ref('')
const reference = ref<HTMLDivElement>()
const floating = ref<HTMLDivElement>()

const { floatingStyles } = useFloating(reference, floating, {
  placement: 'right-start',
  middleware: [offset(5), shift()],
})

const isButtonActive = computed(() => {
  return (store.chatId == props.id || contextMenuChatId.value === props.id) && store.view === 'chat'
})

function selectChat(id: number) {
  if (id === store.chatId && store.view === 'chat') return
  store.selectChat(id)
}

function openContextMenu(id: number) {
  contextMenuOpened.value = true
  contextMenuChatId.value = id
}

function closeContextMenu() {
  contextMenuOpened.value = false
  contextMenuChatId.value = null
}

async function editTitle() {
  newTitle.value = props.title
  contextMenuOpened.value = false
  isEditTitle.value = true
  await nextTick()
  editTitleRef.value?.focus()
}

function cancelEditTitle() {
  contextMenuChatId.value = null
  newTitle.value = ''
  isEditTitle.value = false
}

function saveEditTitle() {
  // Do not save empty or too long titles
  if (newTitle.value === '' || newTitle.value.length > 255) return

  store.updateChatTitle(props.id, newTitle.value)

  contextMenuChatId.value = null
  newTitle.value = ''
  isEditTitle.value = false
}
</script>

<template>
  <div
    ref="reference"
    class="chats-bar-button"
    :class="{ 'chats-bar-button__active': isButtonActive }"
    @click="selectChat(props.id)"
  >
    <template v-if="!isEditTitle">
      <span class="chats-bar-button__text">{{ props.title }}</span>
      <div class="chats-bar-button__dots" @click.stop="openContextMenu(props.id)">
        <DotsIcon />
      </div>
    </template>
    <template v-else>
      <input
        ref="editTitleRef"
        v-model="newTitle"
        class="edit-title"
        type="text"
        maxlength="30"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        @keydown.esc="cancelEditTitle"
        @focusout="cancelEditTitle"
        @keydown.enter="saveEditTitle"
      />
    </template>
  </div>
  <ChatsBarContextMenu
    v-if="contextMenuOpened"
    :id="props.id"
    ref="floating"
    :style="floatingStyles"
    :title="props.title"
    @close-context-menu="closeContextMenu"
    @edit-title="editTitle"
  />
</template>

<style lang="scss" scoped>
.chats-bar-button {
  width: 100%;
  display: flex;
  gap: 4px;
  padding: 6px 8px;
  margin-bottom: 1px;
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

  &__dots {
    opacity: 0;
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    width: 0px;
    height: 22px;
    border-radius: 6px;
    transition: 0.15s;
    z-index: 9;
    cursor: pointer;

    &:hover {
      background-color: var(--button-chatsbar-background-dots);
    }

    svg {
      width: 12px;
      height: 12px;
    }
  }

  &:hover {
    background-color: var(--button-chatsbar-background-hover);

    .chats-bar-button__dots {
      width: 25px;
      opacity: 1;
    }
  }

  &__active {
    cursor: default;
    background-color: var(--button-chatsbar-background-hover);
  }
}

.edit-title {
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  font-family: var(--font-ui);
  width: 100%;
  outline: none;
  font-size: 15px;
  line-height: 1.5;
}
</style>
