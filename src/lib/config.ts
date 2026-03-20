import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { CONFIG_FILE, DATA_DIR } from './paths.js'
import type { ProviderConfig, SwitchConfig } from '../types.js'

const DEFAULT_CONFIG: SwitchConfig = {
  providers: {}
}

async function ensureDataDir(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true })
}

export async function readConfig(): Promise<SwitchConfig> {
  try {
    const raw = await readFile(CONFIG_FILE, 'utf8')
    const parsed = JSON.parse(raw) as Partial<SwitchConfig>
    return {
      activeProvider: parsed.activeProvider,
      activeModel: parsed.activeModel,
      providers: parsed.providers ?? {}
    }
  } catch {
    return { ...DEFAULT_CONFIG }
  }
}

export async function writeConfig(config: SwitchConfig): Promise<void> {
  await ensureDataDir()
  const tempFile = path.join(DATA_DIR, 'config.json.tmp')
  await writeFile(tempFile, JSON.stringify(config, null, 2), 'utf8')
  await rename(tempFile, CONFIG_FILE)
}

export async function getActiveProvider(): Promise<string | undefined> {
  const config = await readConfig()
  return config.activeProvider
}

export async function setActiveProvider(provider: string, model?: string): Promise<void> {
  const config = await readConfig()
  config.activeProvider = provider
  if (model) {
    config.activeModel = model
  }
  await writeConfig(config)
}

export async function getProviderConfig(provider: string): Promise<ProviderConfig> {
  const config = await readConfig()
  return config.providers[provider] ?? {}
}

export async function setProviderConfig(provider: string, providerConfig: ProviderConfig): Promise<void> {
  const config = await readConfig()
  config.providers[provider] = {
    ...config.providers[provider],
    ...providerConfig
  }
  await writeConfig(config)
}
