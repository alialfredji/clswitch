import type { Provider } from '../provider.js'
import type { ClaudeSettings } from '../../types.js'
import { OLLAMA_CURATED_MODELS } from './models.js'

interface OllamaTag {
  name?: string
}

interface OllamaTagsResponse {
  models?: OllamaTag[]
}

export const ollamaProvider: Provider = {
  name: 'ollama',
  displayName: 'Ollama (coming soon)',
  needsAuth: false,
  needsProxy: true,
  async isAuthenticated(): Promise<boolean> {
    return true
  },
  async authenticate(): Promise<void> {
    return
  },
  getSettings(model: string): ClaudeSettings {
    return {
      ANTHROPIC_BASE_URL: 'http://localhost:11434/v1',
      ANTHROPIC_API_KEY: 'ollama',
      ANTHROPIC_MODEL: model
    }
  },
  getDefaultModel(): string {
    return 'llama3'
  },
  async listModels(): Promise<string[]> {
    const response = await fetch('http://localhost:11434/api/tags', {
      signal: AbortSignal.timeout(3000)
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch Ollama models: HTTP ${response.status}`)
    }

    const body = (await response.json()) as OllamaTagsResponse
    return (body.models ?? []).map((m) => m.name).filter((id): id is string => Boolean(id))
  },
  getCuratedModels() {
    return OLLAMA_CURATED_MODELS
  }
}
