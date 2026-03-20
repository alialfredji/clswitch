import { getProvider } from '../providers/index.js'
import { getActiveProvider } from '../lib/config.js'
import { error, headline, info, muted, warn } from '../lib/output.js'

export async function models(providerName?: string): Promise<void> {
  const target = providerName ?? (await getActiveProvider())
  if (!target || target === 'default') {
    error('No provider selected. Usage: claude-switch models <provider>')
    process.exitCode = 1
    return
  }

  const provider = getProvider(target)
  if (!provider) {
    error(`Unknown provider: ${target}`)
    process.exitCode = 1
    return
  }

  headline(`${provider.displayName} models`)
  const curated = provider.getCuratedModels()
  if (curated.length > 0) {
    info('Curated:')
    for (const model of curated) {
      muted(`  - ${model.id}${model.description ? `: ${model.description}` : ''}`)
    }
  }

  try {
    const fetched = await provider.listModels()
    if (fetched.length === 0) {
      warn('No live models returned.')
      return
    }
    info('Live:')
    for (const model of fetched) {
      muted(`  - ${model}`)
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown model listing error'
    warn(`Could not fetch live models: ${message}`)
  }
}
