import type { Provider } from './provider.js'
import { copilotProvider } from './copilot/index.js'
import { openrouterProvider } from './openrouter/index.js'
import { openaiProvider } from './openai/index.js'
import { ollamaProvider } from './ollama/index.js'

export const providers: Record<string, Provider> = {
  copilot: copilotProvider,
  openrouter: openrouterProvider,
  openai: openaiProvider,
  ollama: ollamaProvider
}

export function getProvider(name: string): Provider | undefined {
  return providers[name]
}

export function listProviders(): Provider[] {
  return Object.values(providers)
}
