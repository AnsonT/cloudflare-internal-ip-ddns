import { updateDNS } from './ddns.js'
import { loadEnv, env } from './env.js'
import cron from 'node-cron'

async function main() {
  loadEnv()
  await updateDNS()

  const updateInterval = env.UPDATE_INTERVAL
  if (updateInterval) {
    cron.schedule(updateInterval, () => {
      void updateDNS()
    })
  }
}

void main()
