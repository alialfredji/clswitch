import { auth } from './commands/auth.js'
import { use } from './commands/use.js'
import { defaultMode } from './commands/default.js'
import { status } from './commands/status.js'
import { models } from './commands/models.js'
import { providers } from './commands/providers.js'
import { proxy } from './commands/proxy.js'
import { error } from './lib/output.js'
import pkg from '../package.json' with { type: 'json' }

function help(): void {
  console.log(`claude-switch v${pkg.version}

Usage:
  claude-switch use <provider> [model]
  claude-switch auth <provider>
  claude-switch default
  claude-switch status
  claude-switch models [provider]
  claude-switch providers
  claude-switch proxy <start|stop|status>

Aliases:
  claude-switch copilot [model]   Alias for: claude-switch use copilot [model]

Flags:
  -h, --help      Show help
  -v, --version   Show version
`)
}

async function main(): Promise<void> {
  const [, , command, ...args] = process.argv

  if (command === '--version' || command === '-v') {
    console.log(pkg.version)
    return
  }

  switch (command) {
    case 'use':
      await use(args[0], args[1])
      return
    case 'auth':
      await auth(args[0])
      return
    case 'default':
      await defaultMode()
      return
    case 'status':
      await status()
      return
    case 'models':
      await models(args[0])
      return
    case 'providers':
      await providers()
      return
    case 'proxy':
      await proxy(args[0])
      return
    case 'copilot':
      await use('copilot', args[0])
      return
    case 'help':
    case '--help':
    case '-h':
    case undefined:
      help()
      return
    default:
      error(`Unknown command: ${command}`)
      help()
      process.exitCode = 1
  }
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err)
  error(message)
  process.exitCode = 1
})
