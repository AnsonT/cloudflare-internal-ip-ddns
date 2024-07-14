import { internalIpV4 } from 'internal-ip'
import Cloudflare from 'cloudflare'
import { env } from './env.js'

let lastIP = ''

export async function updateDNS() {
  const ip = await internalIpV4()
  if (!ip || lastIP === ip) return
  lastIP = ip

  const apiToken = env.CLOUDFLARE_API_TOKEN
  const cf = new Cloudflare({ apiToken })
  const zones = await cf.zones.list()
  const zone_id = zones?.result.find((z: any) => z.name === env.CLOUDFLARE_ZONE)
    ?.id
  if (!zone_id) {
    console.error('Zone not found')
    return
  }
  const records = (await cf.dns.records.list({ zone_id })).result
  const AName = `${env.CLOUDFLARE_A_NAME}.${env.CLOUDFLARE_ZONE}`
  const record: any = records?.find((r: any) => r.name === AName)
  if (record) {
    await cf.dns.records.edit(record.id, {
      type: 'A',
      name: env.CLOUDFLARE_A_NAME,
      path_zone_id: zone_id,
      content: ip,
      ttl: 1,
      proxied: false,
    })
  } else {
    await cf.dns.records.create({
      type: 'A',
      name: env.CLOUDFLARE_A_NAME,
      path_zone_id: zone_id,
      content: ip,
      ttl: 1,
      proxied: false,
    })
  }
  console.log('updated', ip)
}
