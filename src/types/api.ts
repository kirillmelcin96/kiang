export interface OllamaModel {
  name: string
  model: string
  size: number
  details: {
    parameter_size: string
    quantization_level: string
    context_length?: number
  }
  capabilities: string[]
}
