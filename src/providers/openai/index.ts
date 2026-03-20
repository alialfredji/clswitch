import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { readFileSync } from 'node:fs'
import type { Provider } from '../provider.js'
import type { ClaudeSettings } from '../../types.js'
import { getProviderConfig, setProviderConfig } from '../../lib/config.js'
import { CONFIG_FILE } from '../../lib/paths.js'
import { OPENAI_CURATED_MODELS } from './models.js'

interface ConfigShape {
  providers?: {
    openai?: {
      apiKey?: string
    }
  }
}

async function promptApiKey(): Promise<string> {
  const rl = createInterface({ input, output })
  const key = (await rl.question('Enter OpenAI API key: ')).trim()
  rl.close()
  if (!key) {
    throw new Error('API key is required')
  }
  return key
}

export const openaiProvider: Provider = {
  name: 'openai',
  displayName: 'OpenAI (coming soon)',
  needsAuth: true,
  needsProxy: true,
  async isAuthenticated(): Promise<boolean> {
    const config = await getProviderConfig('openai')
    return Boolean(config.authenticated && config.apiKey)
  },
  async authenticate(): Promise<void> {
    const apiKey = await promptApiKey()
    await setProviderConfig('openai', { authenticated: true, apiKey })
  },
  getSettings(model: string): ClaudeSettings {
    let apiKey = ''
    try {
      const raw = readFileSync(CONFIG_FILE, 'utf8')
      const parsed = JSON.parse(raw) as ConfigShape
      apiKey = parsed.providers?.openai?.apiKey ?? ''
    } catch {
      apiKey = ''
    }

    return {
      ANTHROPIC_BASE_URL: 'https://api.openai.com/v1',
      ANTHROPIC_API_KEY: apiKey,
      ANTHROPIC_MODEL: model
    }
  },
  getDefaultModel(): string {
    return 'gpt-4.1'
  },
  async listModels(): Promise<string[]> {
    return OPENAI_CURATED_MODELS.map((m) => m.id)
  },
  getCuratedModels() {
    return OPENAI_CURATED_MODELS
  }
}
