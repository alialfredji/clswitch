import { open, readFile, rm, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import type { ProxyConfig } from '../types.js'

async function processExists(pid: number): Promise<boolean> {
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}

async function readPid(pidFile: string): Promise<number | undefined> {
  try {
    const raw = await readFile(pidFile, 'utf8')
    const pid = Number.parseInt(raw.trim(), 10)
    return Number.isFinite(pid) ? pid : undefined
  } catch {
    return undefined
  }
}

export async function isProxyRunning(config: ProxyConfig): Promise<boolean> {
  const pid = await readPid(config.pidFile)
  if (!pid) {
    return false
  }

  const running = await processExists(pid)
  if (!running) {
    await rm(config.pidFile, { force: true })
  }
  return running
}

export async function startProxy(config: ProxyConfig): Promise<void> {
  if (await isProxyRunning(config)) {
    return
  }

  const outFd = await open(config.logFile, 'a')
  const errFd = await open(config.logFile, 'a')

  const child = spawn(config.command, config.args, {
    detached: true,
    stdio: ['ignore', outFd.fd, errFd.fd]
  })

  child.unref()
  await writeFile(config.pidFile, `${child.pid ?? ''}\n`, 'utf8')
  await outFd.close()
  await errFd.close()
}

export async function stopProxy(config: ProxyConfig): Promise<void> {
  const pid = await readPid(config.pidFile)
  if (!pid) {
    return
  }

  try {
    process.kill(pid, 'SIGTERM')
  } catch {
  }

  await rm(config.pidFile, { force: true })
}
