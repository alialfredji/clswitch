export interface ClaudeSettings {
  ANTHROPIC_BASE_URL?: string
  ANTHROPIC_API_KEY?: string
  ANTHROPIC_MODEL?: string
  CLAUDE_CODE_ATTRIBUTION_HEADER?: string
  [key: string]: string | undefined
}

export interface ModelInfo {
  id: string
  displayName: string
  description?: string
}

export interface ProxyConfig {
  command: string
  args: string[]
  port: number
  logFile: string
  pidFile: string
}

export interface ProviderConfig {
  authenticated?: boolean
  apiKey?: string
  endpoint?: string
}

export interface SwitchConfig {
  activeProvider?: string
  activeModel?: string
  providers: Record<string, ProviderConfig>
}
