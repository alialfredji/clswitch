import { listProviders } from '../providers/index.js'
import { headline, muted } from '../lib/output.js'

export async function providers(): Promise<void> {
  headline('Available providers')
  for (const provider of listProviders()) {
    const auth = provider.needsAuth ? 'auth required' : 'no auth'
    const proxy = provider.needsProxy ? 'proxy' : 'direct'
    muted(`- ${provider.name}: ${provider.displayName} (${auth}, ${proxy})`)
  }
}
