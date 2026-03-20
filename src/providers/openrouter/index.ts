import { createInterface } from 'node:readline/promises'
import { readFileSync } from 'node:fs'
import { stdin as input, stdout as output } from 'node:process'
import type { Provider } from '../provider.js'
import type { ClaudeSettings } from '../../types.js'
import { getProviderConfig, setProviderConfig } from '../../lib/config.js'
import { CONFIG_FILE } from '../../lib/paths.js'
import { OPENROUTER_CURATED_MODELS } from './models.js'

interface OpenRouterModel {
  id?: string
}

interface OpenRouterResponse {
  data?: OpenRouterModel[]
}

interface ConfigShape {
  providers?: {
    openrouter?: {
      apiKey?: string
    }
  }
}

async function promptApiKey(): Promise<string> {
  const rl = createInterface({ input, output })
  const key = (await rl.question('Enter OpenRouter API key: ')).trim()
  rl.close()
  if (!key) {
    throw new Error('API key is required')
  }
  return key
}

export const openrouterProvider: Provider = {
  name: 'openrouter',
  displayName: 'OpenRouter',
  needsAuth: true,
  needsProxy: false,
  async isAuthenticated(): Promise<boolean> {
    const config = await getProviderConfig('openrouter')
    return Boolean(config.authenticated && config.apiKey)
  },
  async authenticate(): Promise<void> {
    const apiKey = await promptApiKey()
    await setProviderConfig('openrouter', { authenticated: true, apiKey })
  },
  getSettings(model: string): ClaudeSettings {
    let apiKey = ''
    try {
      const raw = readFileSync(CONFIG_FILE, 'utf8')
      const parsed = JSON.parse(raw) as ConfigShape
      apiKey = parsed.providers?.openrouter?.apiKey ?? ''
    } catch {
      apiKey = ''
    }

    return {
      ANTHROPIC_BASE_URL: 'https://openrouter.ai/api/v1',
      ANTHROPIC_API_KEY: apiKey,
      ANTHROPIC_MODEL: model
    }
  },
  getDefaultModel(): string {
    return 'anthropic/claude-sonnet-4'
  },
  async listModels(): Promise<string[]> {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      signal: AbortSignal.timeout(5000)
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch OpenRouter models: HTTP ${response.status}`)
    }

    const body = (await response.json()) as OpenRouterResponse
    return (body.data ?? []).map((item) => item.id).filter((id): id is string => Boolean(id))
  },
  getCuratedModels() {
    return OPENROUTER_CURATED_MODELS
  }
}
