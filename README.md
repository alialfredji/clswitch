# claude-switch

Switch Claude Code between different AI providers.

## Features

- Manual CLI parsing (no CLI framework)
- ESM TypeScript build with tsup
- Provider config at `~/.claude-switch/config.json`
- Claude settings write at `~/.claude/settings.json`
- Fully functional providers:
  - Copilot via `copilot-api` subprocess + local proxy
  - OpenRouter direct API
- Auth + stub providers (coming soon):
  - OpenAI
  - Ollama

## Install

```bash
npm install
npm run build
npm link
```

## Usage

```bash
claude-switch --help
claude-switch providers
claude-switch status

claude-switch auth copilot
claude-switch use copilot
claude-switch copilot

claude-switch auth openrouter
claude-switch use openrouter anthropic/claude-sonnet-4

claude-switch default
```

## Commands

- `claude-switch use <provider> [model]`
- `claude-switch auth <provider>`
- `claude-switch default`
- `claude-switch status`
- `claude-switch models [provider]`
- `claude-switch providers`
- `claude-switch proxy <start|stop|status>`

## Notes

- Backward compatible alias: `claude-switch copilot [model]`
- `output.ts` respects `NO_COLOR` and TTY detection.
- `copilot-api` is used only as a spawned subprocess.
