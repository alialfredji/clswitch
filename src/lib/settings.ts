import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { SETTINGS_PATH } from './paths.js'
import type { ClaudeSettings } from '../types.js'

async function ensureSettingsDir(): Promise<void> {
  await mkdir(path.dirname(SETTINGS_PATH), { recursive: true })
}

export async function readSettings(): Promise<ClaudeSettings> {
  try {
    const raw = await readFile(SETTINGS_PATH, 'utf8')
    return JSON.parse(raw) as ClaudeSettings
  } catch {
    return {}
  }
}

async function writeSettings(settings: ClaudeSettings): Promise<void> {
  await ensureSettingsDir()
  const tempFile = `${SETTINGS_PATH}.tmp`
  await writeFile(tempFile, JSON.stringify(settings, null, 2), 'utf8')
  await rename(tempFile, SETTINGS_PATH)
}

export async function writeCopilotSettings(model: string): Promise<void> {
  const current = await readSettings()
  const next: ClaudeSettings = {
    ...current,
    ANTHROPIC_BASE_URL: 'http://localhost:4141',
    ANTHROPIC_API_KEY: 'dummy',
    ANTHROPIC_MODEL: model,
    CLAUDE_CODE_ATTRIBUTION_HEADER: '0'
  }
  await writeSettings(next)
}

export async function writeDefaultSettings(): Promise<void> {
  const current = await readSettings()
  const {
    ANTHROPIC_BASE_URL: _base,
    ANTHROPIC_API_KEY: _key,
    ANTHROPIC_MODEL: _model,
    CLAUDE_CODE_ATTRIBUTION_HEADER: _attr,
    ...rest
  } = current

  await writeSettings(rest)
}

export async function writeProviderSettings(settings: ClaudeSettings): Promise<void> {
  const current = await readSettings()
  const next: ClaudeSettings = {
    ...current,
    ...settings
  }
  await writeSettings(next)
}
