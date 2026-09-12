import { defineStore } from 'pinia'

// State types
export interface Settings {
    ollamaApiUrl: string,
    systemPrompt: string,
}

export type SettingsKey = keyof Settings

export const useSettingsStore = defineStore('settings', {
  state: (): Settings => ({
    ollamaApiUrl: localStorage.getItem('settings/ollamaApiUrl') || 'http://localhost:11434',
    systemPrompt: localStorage.getItem('settings/systemPrompt') || '',
  }),
  getters: {
    // Empty
  },
  actions: {
    changeChatUrl(newUrl: string) {
        localStorage.setItem('settings/ollamaApiUrl', newUrl)
        this.ollamaApiUrl = newUrl
    },
    async getOllamaStatus() {
        try {
            const res = await fetch(this.ollamaApiUrl + '/', {
                method: 'GET',
            })

            return res.ok
        } catch (e) {
            return false
        }
    },
    async requestOllamaApi(endpoint: string, method: 'GET' | 'POST') {
        try {
            const res = await fetch(this.ollamaApiUrl + endpoint, {
                method,
            })

            if (!res.ok) {
                throw new Error(`Ошибка HTTP: ${res.status}`);
            }

            const data = await res.json()
            // console.log(data)
            return data
        } catch (e) {
            // console.error(e)
        }
    },
    // AI-ASSISTED (ChatGPT): Helped with types for this function
    updateSetting<K extends SettingsKey>(key: K, value: Settings[K]) {
        // Update state
        this[key] = value
        // Save setting's value in the localStorage
        localStorage.setItem(`settings/${key}`, value)
    },
  }
})