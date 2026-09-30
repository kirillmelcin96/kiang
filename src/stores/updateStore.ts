import { defineStore } from 'pinia'
import { check, Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { error } from '@tauri-apps/plugin-log'

// State types
export interface AppUpdate {
    update: Update | null,
    updateAvailable: boolean,
    updateVersion: string,
    updateDate: string,
    isInstalling: boolean,
    isUpdating: boolean,
    isError: boolean,
    errorText: Error | null,
    showUpdateModal: boolean,
}

export const useAppUpdateStore = defineStore('appUpdate', {
  state: (): AppUpdate => ({
    update: null,
    updateAvailable: false,
    updateVersion: '',
    updateDate: '',
    isInstalling: false,
    isUpdating: false,
    isError: false,
    errorText: null,
    showUpdateModal: false,
  }),
  getters: {
    updateStarted: (state) => state.isInstalling || state.isUpdating
  },
  actions: {
    async checkForUpdates() {
      this.update = await check();

      if (this.update) {
        this.updateAvailable = true
        this.updateVersion = this.update.version
        this.updateDate = this.update.date ? this.update.date : ''
      }
    },

    async installUpdate() {
      this.isError = false
      this.errorText = null

      if (!this.update) {
        this.update = await check();
      }

      if (this.update) {
        try {
          // See: https://v2.tauri.app/plugin/updater/#checking-for-updates
          await this.update.downloadAndInstall((event) => {
            switch (event.event) {
              case 'Started':
                this.isUpdating = true
                break;
              case 'Progress':
                this.isUpdating = true
                break;
              case 'Finished':
                this.isUpdating = false
                this.isInstalling = true
                break;
            }
          });

          await relaunch();
        } catch (err) {
          console.error(err)
          this.isError = true

          if (err instanceof Error) {
            this.errorText = err
            error(err.message)
          } else if (typeof err === 'string') {
            this.errorText = new Error(err)
            error(err)
          } else {
            this.errorText = new Error(JSON.stringify(err) || 'Unknown error')
            error(JSON.stringify(err))
          }
        }
      }
    }
  }
})