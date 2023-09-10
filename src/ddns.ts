import { internalIpV4 } from 'internal-ip'
import Cloudflare from 'cloudflare'
import { env } from './env.js'

let lastIP = ''

export async function updateDNS() {
  const ip = await internalIpV4()

  if (!ip || lastIP === ip) return
  lastIP = ip

  const token = env.CLOUDFLARE_API_TOKEN
  const cf = new Cloudflare({ token })
  const zones = (await cf.zones.browse()) as any
  const zoneId = zones?.result.find((z: any) => z.name === env.CLOUDFLARE_ZONE)
    ?.id
  const records = (await cf.dnsRecords.browse(zoneId)).result
  const AName = `${env.CLOUDFLARE_A_NAME}.${env.CLOUDFLARE_ZONE}`
  const record: any = records?.find((r: any) => r.name === AName)
  if (record) {
    cf.dnsRecords.edit(zoneId, record.id, {
      type: 'A',
      name: env.CLOUDFLARE_A_NAME,
      content: ip,
      ttl: 1,
      proxied: false,
    })
  } else {
    cf.dnsRecords.add(zoneId, {
      type: 'A',
      name: env.CLOUDFLARE_A_NAME,
      content: ip,
      ttl: 1,
      proxied: false,
    })
  }
  console.log('updated', ip)
}
