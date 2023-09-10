import { type EnvType, load } from 'ts-dotenv'

export type Env = EnvType<typeof schema>

export const schema = {
  NODE_ENV: {
    type: String,
    optional: true,
    default: 'development',
  },
  CLOUDFLARE_API_TOKEN: String,
  CLOUDFLARE_ZONE: String,
  CLOUDFLARE_A_NAME: String,
  UPDATE_INTERVAL: {
    type: String,
    optional: true,
  },
}

export let env: Env

export function loadEnv(): void {
  env = load(schema)
}
