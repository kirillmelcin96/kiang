import { defineStore } from 'pinia'

// State types
interface State {
    isOpen: boolean,
    title: string,
    message: string,
    confirmText: string,
    promiseResolve: ((result: boolean) => void) | null,
}

interface Options {
    title?: string,
    message: string,
    confirmText: string,
}

export const useConfirmStore = defineStore('confirm', {
  state: (): State => ({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    promiseResolve: null,
  }),

  actions: {
    confirm(options: Options): Promise<boolean> {
      this.title = options.title ?? ''
      this.message = options.message
      this.confirmText = options.confirmText ?? 'Confirm'
      this.isOpen = true

      return new Promise((resolve) => {
        this.promiseResolve = resolve
      })
    },

    resolve(result: boolean) {
      this.isOpen = false
      this.promiseResolve?.(result)
      this.promiseResolve = null
    },
  },
})