import { getProvider } from '../providers/index.js'
import { getActiveProvider } from '../lib/config.js'
import { error, info, success } from '../lib/output.js'

export async function proxy(action?: string): Promise<void> {
  const active = await getActiveProvider()
  if (!active || active === 'default') {
    error('No active provider selected.')
    process.exitCode = 1
    return
  }

  const provider = getProvider(active)
  if (!provider) {
    error(`Unknown active provider: ${active}`)
    process.exitCode = 1
    return
  }

  if (!provider.needsProxy) {
    info(`${provider.displayName} does not use a proxy.`)
    return
  }

  if (!action || action === 'status') {
    const running = provider.isProxyRunning ? await provider.isProxyRunning() : false
    info(`Proxy is ${running ? 'running' : 'stopped'}.`)
    return
  }

  if (action === 'start') {
    if (!provider.startProxy) {
      error(`${provider.displayName} proxy start is not available.`)
      process.exitCode = 1
      return
    }
    await provider.startProxy(4141)
    success('Proxy started.')
    return
  }

  if (action === 'stop') {
    if (!provider.stopProxy) {
      error(`${provider.displayName} proxy stop is not available.`)
      process.exitCode = 1
      return
    }
    await provider.stopProxy()
    success('Proxy stopped.')
    return
  }

  error('Usage: claude-switch proxy <start|stop|status>')
  process.exitCode = 1
}
