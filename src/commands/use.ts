import { getProvider } from '../providers/index.js'
import { error, info, success, warn } from '../lib/output.js'
import { setActiveProvider } from '../lib/config.js'
import { writeProviderSettings } from '../lib/settings.js'

const COMING_SOON = new Set(['openai', 'ollama'])

export async function use(providerName?: string, modelArg?: string): Promise<void> {
  if (!providerName) {
    error('Provider is required. Usage: claude-switch use <provider> [model]')
    process.exitCode = 1
    return
  }

  const provider = getProvider(providerName)
  if (!provider) {
    error(`Unknown provider: ${providerName}`)
    process.exitCode = 1
    return
  }

  if (COMING_SOON.has(providerName)) {
    warn(`${provider.displayName} support is coming soon. Authentication is available, switching is not yet enabled.`)
    return
  }

  if (provider.needsAuth) {
    const authenticated = await provider.isAuthenticated()
    if (!authenticated) {
      error(`${provider.displayName} is not authenticated. Run: claude-switch auth ${provider.name}`)
      process.exitCode = 1
      return
    }
  }

  if (provider.needsProxy && provider.startProxy) {
    info(`Starting ${provider.displayName} proxy on port 4141...`)
    await provider.startProxy(4141)
  }

  const model = modelArg ?? provider.getDefaultModel()
  const settings = provider.getSettings(model)
  await writeProviderSettings(settings)
  await setActiveProvider(provider.name, model)

  success(`Switched to ${provider.displayName} with model ${model}.`)
}
