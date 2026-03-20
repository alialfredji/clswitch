import { homedir } from 'node:os'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HOME = homedir()

export const SETTINGS_PATH = path.join(HOME, '.claude', 'settings.json')
export const DATA_DIR = path.join(HOME, '.claude-switch')
export const PID_FILE = path.join(DATA_DIR, 'proxy.pid')
export const LOG_FILE = path.join(DATA_DIR, 'proxy.log')
export const CONFIG_FILE = path.join(DATA_DIR, 'config.json')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const COPILOT_BIN_NAME = process.platform === 'win32' ? 'copilot-api.cmd' : 'copilot-api'
const bundledCandidate = path.resolve(__dirname, '..', 'node_modules', '.bin', COPILOT_BIN_NAME)
const sourceCandidate = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', COPILOT_BIN_NAME)

export const COPILOT_API_BIN = existsSync(bundledCandidate) ? bundledCandidate : sourceCandidate
