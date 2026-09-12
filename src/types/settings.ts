import type { Component } from "vue"

interface Parameter {
    title: String,
    description?: String,
    props?: Object,
    component?: Component,
}

export interface SettingsGroup {
    id: String,
    title: String,
    type: 'group' | 'textarea'
    parameters: Parameter[],
    footer?: String,
}