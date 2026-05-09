import { getKVCredentials } from '@/lib/redis'

export const revalidate = 60

export async function GET() {
  const creds = getKVCredentials()
  if (!creds) return Response.json({ teams: 0, battles: 0, trainers: 0 })

  try {
    const res = await fetch(
      `${creds.url}/mget/counter:teams/counter:battles/counter:trainers`,
      { headers: { Authorization: `Bearer ${creds.token}` }, next: { revalidate: 60 } }
    )
    const data = await res.json()
    const [teams, battles, trainers] = data.result as (string | null)[]
    return Response.json({
      teams:    parseInt(teams    ?? '0') || 0,
      battles:  parseInt(battles  ?? '0') || 0,
      trainers: parseInt(trainers ?? '0') || 0,
    })
  } catch {
    return Response.json({ teams: 0, battles: 0, trainers: 0 })
  }
}
