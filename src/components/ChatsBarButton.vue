<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useFloating, offset, shift } from '@floating-ui/vue';
import { useChatStore } from '../stores/chatStore'
import DotsIcon from '../icons/Dots.vue'
import ChatsBarContextMenu from './overlays/ChatsBarContextMenu.vue';

const store = useChatStore()

const props = defineProps<{
    id: number,
    title: string,
}>()

const contextMenuOpened = ref(false)
const contextMenuChatId = ref<number | null>(null)
const reference = ref<HTMLDivElement>();
const floating = ref<HTMLDivElement>();

const { floatingStyles } = useFloating(reference, floating, {
  placement: 'right-start',
  middleware: [offset(5), shift()],
});

const isButtonActive = computed(() => {
    return (store.chatId == props.id || contextMenuOpened.value) && store.view === 'chat'
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
</script>

<template>
    <div
        @click="selectChat(props.id)"
        class="chats-bar-button"
        :class="{ 'chats-bar-button__active': isButtonActive }"
        ref="reference"
    >
        <span class="chats-bar-button__text">{{ props.title }}</span>
        <div 
            @click.stop="openContextMenu(props.id)"
            class="chats-bar-button__dots"
        >
            <DotsIcon />
        </div>
    </div>
    <ChatsBarContextMenu 
        v-if="contextMenuOpened" 
        ref="floating" 
        :style="floatingStyles"
        :id="contextMenuChatId"
        @close-context-menu="closeContextMenu"
    />
</template>

<style lang="scss" scoped>
.chats-bar-button {
    width: 100%;
    display: flex;
    gap: 4px;
    padding: 6px 8px;
    margin-bottom: 1px;
    border-radius: 12px;
    font-size: 15px;
    background-color: #0e0e0e;
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
        transition: .15s;
        z-index: 9;
        cursor: pointer;

        &:hover {
            background-color: #ffffff15;
        }

        svg {
            width: 12px;
            height: 12px;
        }
    }

    &:hover {
        background-color: #272727;

        .chats-bar-button__dots {
            width: 25px;
            opacity: 1;
        }
    }

    &__active {
        cursor: default;
        background-color: #272727;
    }
}
</style>