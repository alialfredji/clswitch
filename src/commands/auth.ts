import { getProvider } from '../providers/index.js'
import { error, success } from '../lib/output.js'

export async function auth(providerName?: string): Promise<void> {
  if (!providerName) {
    error('Provider is required. Usage: claude-switch auth <provider>')
    process.exitCode = 1
    return
  }

  const provider = getProvider(providerName)
  if (!provider) {
    error(`Unknown provider: ${providerName}`)
    process.exitCode = 1
    return
  }

  if (!provider.needsAuth) {
    success(`${provider.displayName} does not require authentication.`)
    return
  }

  await provider.authenticate()
  success(`Authenticated ${provider.displayName}.`)
}
