import { access } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import path from 'node:path'
import { homedir } from 'node:os'
import { mkdir } from 'node:fs/promises'
import type { Provider } from '../provider.js'
import type { ClaudeSettings } from '../../types.js'
import { COPILOT_CURATED_MODELS } from './models.js'
import { COPILOT_API_BIN, DATA_DIR, LOG_FILE, PID_FILE } from '../../lib/paths.js'
import { fetchModels } from '../../lib/health.js'
import { isProxyRunning, startProxy, stopProxy } from '../../lib/process.js'

const DEFAULT_PORT = 4141

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

async function runInteractive(command: string, args: string[]): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' })
    child.once('error', reject)
    child.once('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Process exited with code ${code ?? -1}`))
      }
    })
  })
}

export const copilotProvider: Provider = {
  name: 'copilot',
  displayName: 'GitHub Copilot',
  needsAuth: true,
  needsProxy: true,
  async isAuthenticated(): Promise<boolean> {
    const home = homedir()
    const candidates = [
      path.join(home, '.config', 'github-copilot', 'hosts.json'),
      path.join(home, '.config', 'copilot-api', 'hosts.json'),
      path.join(home, '.config', 'copilot-api', 'token.json')
    ]

    for (const candidate of candidates) {
      if (await fileExists(candidate)) {
        return true
      }
    }
    return false
  },
  async authenticate(): Promise<void> {
    await runInteractive(COPILOT_API_BIN, ['auth'])
  },
  async startProxy(port: number): Promise<void> {
    await mkdir(DATA_DIR, { recursive: true })
    await startProxy({
      command: COPILOT_API_BIN,
      args: ['start', '--port', `${port}`],
      port,
      logFile: LOG_FILE,
      pidFile: PID_FILE
    })
  },
  async stopProxy(): Promise<void> {
    await stopProxy({
      command: COPILOT_API_BIN,
      args: ['start', '--port', `${DEFAULT_PORT}`],
      port: DEFAULT_PORT,
      logFile: LOG_FILE,
      pidFile: PID_FILE
    })
  },
  async isProxyRunning(): Promise<boolean> {
    return isProxyRunning({
      command: COPILOT_API_BIN,
      args: ['start', '--port', `${DEFAULT_PORT}`],
      port: DEFAULT_PORT,
      logFile: LOG_FILE,
      pidFile: PID_FILE
    })
  },
  getSettings(model: string): ClaudeSettings {
    return {
      ANTHROPIC_BASE_URL: 'http://localhost:4141',
      ANTHROPIC_API_KEY: 'dummy',
      ANTHROPIC_MODEL: model,
      CLAUDE_CODE_ATTRIBUTION_HEADER: '0'
    }
  },
  getDefaultModel(): string {
    return 'claude-sonnet-4-6'
  },
  async listModels(): Promise<string[]> {
    return fetchModels(DEFAULT_PORT)
  },
  getCuratedModels() {
    return COPILOT_CURATED_MODELS
  }
}
