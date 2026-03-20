import { setActiveProvider } from '../lib/config.js'
import { writeDefaultSettings } from '../lib/settings.js'
import { success } from '../lib/output.js'

export async function defaultMode(): Promise<void> {
  await writeDefaultSettings()
  await setActiveProvider('default')
  success('Restored default Claude settings.')
}
