import { defineStore } from 'pinia'
import { check } from '@tauri-apps/plugin-updater';
// import { relaunch } from '@tauri-apps/plugin-process';

// State types
export interface AppUpdate {
    updateAvailable: boolean,
    updateVersion: string,
    updateDate: string,
    showUpdateModal: boolean,
}

export const useAppUpdateStore = defineStore('appUpdate', {
  state: (): AppUpdate => ({
    updateAvailable: false,
    updateVersion: '',
    updateDate: '',
    showUpdateModal: false,
  }),
  getters: {
    // Empty
  },
  actions: {
    async checkForUpdates() {
      const update = await check();

      if (update) {
        this.updateAvailable = true
        this.updateVersion = update.version
        this.updateDate = update.date ? update.date : ''
      }
    }
  }
})