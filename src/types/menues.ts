import type { Component } from "vue"

export interface ChatsBarMenuButton {
    title: string
    icon: Component
    handler: () => void
}

export interface ChatsBarContextMenuButton extends ChatsBarMenuButton {
    isDelete?: boolean,
}