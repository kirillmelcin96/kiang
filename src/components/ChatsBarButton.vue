<script lang="ts" setup>
import { useChatStore } from '../stores/chatStore'
import CloseIcon from '../icons/Close.vue'

const store = useChatStore()

const props = defineProps<{
    id: number,
    title: string,
}>()

function selectChat(id: number) {
    if (id === store.chatId && store.view === 'chat') return
    store.selectChat(id)
}

function deleteChat(id: number) {
    store.deleteChat(id)
}
</script>

<template>
    <div
        @click="selectChat(props.id)"
        class="chats-bar-button"
        :class="{ 'chats-bar-button__active': store.chatId == props.id && store.view === 'chat' }"
    >
        <span class="chats-bar-button__text">{{ props.title }}</span>
        <div 
            @click="deleteChat(props.id)"
            class="chats-bar-button__close"
        >
            <CloseIcon />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.chats-bar-button {
    width: 100%;
    display: flex;
    gap: 4px;
    padding: 6px 8px;
    margin-bottom: 4px;
    border-radius: 12px;
    font-size: 15px;
    // font-weight: 500;
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

    &__close {
        opacity: 0;
        display: flex;
        flex-grow: 1;
        align-items: center;
        justify-content: center;
        width: 0px;
        height: 22px;
        border-radius: 6px;
        transition: .15s;
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

        .chats-bar-button__close {
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