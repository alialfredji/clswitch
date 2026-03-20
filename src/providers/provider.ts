import type { ClaudeSettings, ModelInfo } from '../types.js'

export interface Provider {
  name: string
  displayName: string
  needsAuth: boolean
  needsProxy: boolean
  isAuthenticated(): Promise<boolean>
  authenticate(): Promise<void>
  startProxy?(port: number): Promise<void>
  stopProxy?(): Promise<void>
  isProxyRunning?(): Promise<boolean>
  getSettings(model: string): ClaudeSettings
  getDefaultModel(): string
  listModels(): Promise<string[]>
  getCuratedModels(): ModelInfo[]
}
