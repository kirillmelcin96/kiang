/**
 * Default info about Ollama model
 *
 * See: https://docs.ollama.com/api/tags
 */
export interface OllamaModel {
  name: string
  model: string
  size: number
  details: {
    parameter_size: string
    quantization_level: string
    context_length?: number
  }
  capabilities?: string[]
}

/**
 * Special case - model, that is loaded into memory (running)
 *
 * Additional fields:
 * - expires_at
 * - size_vram
 * - context_length
 *
 * See: https://docs.ollama.com/api/ps
 */
export interface OllamaModelRunning extends OllamaModel {
  expires_at: string
  size_vram: number
  context_length: number
}

export type ModelsProvider = 'hf' | 'ollama'

export interface SearchModel {
  id: string
  name: string
  author: string
  downloads?: number
  likes?: number
  provider: ModelsProvider
}

export interface ModelDetails extends SearchModel {
  pipelineTag: string
  lastModified?: string
  createdAt?: string
  language?: Array<string>
  license?: string
}

export interface ModelQuantization {
  name: string
  size: number
}
