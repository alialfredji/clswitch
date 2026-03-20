import { readConfig } from '../lib/config.js'
import { getProvider } from '../providers/index.js'
import { error, headline, info, muted } from '../lib/output.js'

export async function status(): Promise<void> {
  const config = await readConfig()
  const activeProvider = config.activeProvider
  const activeModel = config.activeModel

  headline('claude-switch status')

  if (!activeProvider) {
    info('Active provider: none')
    muted('Run: claude-switch use <provider>')
    return
  }

  info(`Active provider: ${activeProvider}`)
  if (activeModel) {
    info(`Active model: ${activeModel}`)
  }

  const provider = getProvider(activeProvider)
  if (!provider) {
    error(`Provider record not found: ${activeProvider}`)
    return
  }

  if (provider.needsAuth) {
    const authenticated = await provider.isAuthenticated()
    info(`Authenticated: ${authenticated ? 'yes' : 'no'}`)
  }

  if (provider.needsProxy && provider.isProxyRunning) {
    const running = await provider.isProxyRunning()
    info(`Proxy: ${running ? 'running' : 'stopped'}`)
  }
}
