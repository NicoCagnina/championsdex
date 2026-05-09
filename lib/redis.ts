// Supports three env var naming conventions:
//   Vercel KV:   KV_REST_API_URL + KV_REST_API_TOKEN
//   Upstash:     UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
//   Redis URL:   REDIS_URL  (redis://default:TOKEN@HOST.upstash.io:6379)

export function getKVCredentials(): { url: string; token: string } | null {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return { url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN }
  }
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return { url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN }
  }
  const redisUrl = process.env.REDIS_URL
  if (redisUrl) {
    try {
      const parsed = new URL(redisUrl)
      const token = parsed.password
      const restUrl = `https://${parsed.hostname}`
      if (token && parsed.hostname) return { url: restUrl, token }
    } catch {}
  }
  return null
}
