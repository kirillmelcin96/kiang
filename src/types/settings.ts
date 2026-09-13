import type { Component } from "vue"

interface Parameter {
    title: string,
    description?: string,
    props?: object,
    component?: Component,
}

export interface SettingsGroup {
    id: string,
    title: string,
    type: 'group' | 'textarea'
    parameters: Parameter[],
    footer?: string,
}