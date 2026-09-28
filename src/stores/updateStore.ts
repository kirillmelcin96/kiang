import { defineStore } from 'pinia'
import { check, Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

// State types
export interface AppUpdate {
    update: Update | null,
    updateAvailable: boolean,
    updateVersion: string,
    updateDate: string,
    isInstalling: boolean,
    isUpdating: boolean,
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
      if (!this.update) {
        this.update = await check();
      }

      if (this.update) {
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
      }
    }
  }
})