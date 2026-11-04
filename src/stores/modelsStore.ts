import { defineStore } from 'pinia'
import { httpFetch } from '../utils/http.ts'
import { useSettingsStore } from './settingsStore.ts'
import type { SearchModel, ModelsProvider, ModelDetails, ModelQuantization } from '../types/api.ts'

const HUGGING_FACE_API_ENDPOINT = 'https://huggingface.co/api'

// State types
export interface Models {
  searchField: string
  showDetailsModal: boolean
  modal: {
    id: string
    provider: ModelsProvider
  }
}

export const useModelsStore = defineStore('models', {
  state: (): Models => ({
    searchField: '',
    showDetailsModal: false,
    modal: {
      id: '',
      provider: 'hf',
    },
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
        const res = await httpFetch(
          HUGGING_FACE_API_ENDPOINT + `/models?search=&filter=gguf&limit=10`,
          {
            method: 'GET',
          },
        )

        const data = await res.json()

        interface HFSearchModelResponse {
          id: string
          downloads: number
          likes: number
        }

        const formatted: SearchModel[] = data.map((i: HFSearchModelResponse) => {
          const id = i.id.split('/')
          return {
            id: i.id,
            author: id[0],
            name: id[1],
            downloads: i.downloads,
            likes: i.likes,
            provider: 'hf',
          }
        })

        return formatted
      } catch (e) {
        console.error(e)
      }
    },
    async searchHF(q: string) {
      try {
        const res = await httpFetch(
          HUGGING_FACE_API_ENDPOINT + `/models?search=${q}&filter=gguf&sort=downloads&limit=50`,
          {
            method: 'GET',
          },
        )

        const data = await res.json()

        interface HFSearchModelResponse {
          id: string
          downloads: number
          likes: number
        }

        const formatted: SearchModel[] = data.map((i: HFSearchModelResponse) => {
          const id = i.id.split('/')
          return {
            id: i.id,
            author: id[0],
            name: id[1],
            downloads: i.downloads,
            likes: i.likes,
            provider: 'hf',
          }
        })

        return formatted
      } catch (e) {
        console.error(e)
      }
    },
    async fetchDetailsHF(id: string): Promise<ModelDetails | undefined> {
      try {
        const res = await httpFetch(HUGGING_FACE_API_ENDPOINT + `/models/${id}`, {
          method: 'GET',
        })

        const data = await res.json()

        return {
          author: data.author,
          id: data.id,
          name: data.id.split('/')[1],
          pipelineTag: data.pipeline_tag || 'Unknown',
          provider: 'hf',
          createdAt: data.createdAt,
          likes: data.likes,
          downloads: data.downloads,
          language: data?.cardData?.language || [],
          lastModified: data.lastModified,
          license: data?.cardData?.license || 'Unknown',
        }
      } catch (e) {
        console.error(e)
      }
    },
    async fetchGgufFilesHF(id: string): Promise<ModelQuantization[] | undefined> {
      try {
        const res = await httpFetch(
          HUGGING_FACE_API_ENDPOINT + `/models/${id}/tree/main?recursive=true`,
          {
            method: 'GET',
          },
        )

        const files = await res.json()

        const quantizations: ModelQuantization[] = files
          .filter(
            (file) =>
              file.path.endsWith('.gguf') &&
              !file.path.toLowerCase().includes('mtp') &&
              !file.path.toLowerCase().includes('mmproj'),
          )
          .map((file) => {
            const filename: string = file.path.split('/').pop()!

            return {
              name: filename.replace('.gguf', ''),
              size: file.lfs?.size ?? file.size ?? 0,
            }
          })

        return quantizations
      } catch (e) {
        console.error(e)
      }
    },
  },
})
