import { defineStore } from 'pinia'
import { httpFetch } from '../utils/http.ts'
import { useSettingsStore } from './settingsStore.ts'
import type { SearchModel } from '../types/api.ts'

const HUGGING_FACE_API_ENDPOINT = 'https://huggingface.co/api'

// State types
export interface Models {
  searchField: string
}

export const useModelsStore = defineStore('models', {
  state: (): Models => ({
    searchField: '',
  }),
  getters: {
    // Empty
  },
  actions: {
    async requestOllamaApi(endpoint: string, method: 'GET' | 'POST') {
      const settingsStore = useSettingsStore()

      try {
        const res = await httpFetch(settingsStore.ollamaApiUrl + endpoint, {
          method,
        })

        if (!res.ok) {
          throw new Error(`Ошибка HTTP: ${res.status}`)
        }

        const data = await res.json()
        // console.log(data)
        return data
      } catch (e) {
        console.error(e)
      }
    },
    async getTrendingHF() {
      try {
        const res = await httpFetch(HUGGING_FACE_API_ENDPOINT + '/trending?type=model&limit=10', {
          method: 'GET',
        })

        const data = await res.json()

        const recentlyTrending = data.recentlyTrending

        interface HFTrendingModelResponse {
          repoData: {
            author: string
            id: string
            downloads: number
            likes: number
          }
        }

        const formatted: SearchModel[] = recentlyTrending.map((i: HFTrendingModelResponse) => {
          const rd = i.repoData
          return {
            author: rd.author,
            name: rd.id.split('/')[1],
            downloads: rd.downloads,
            likes: rd.likes,
          }
        })

        return formatted
      } catch (e) {
        console.error(e)
      }
    },
  },
})
