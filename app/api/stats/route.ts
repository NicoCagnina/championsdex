// Requires Vercel KV: dashboard.vercel.com → Storage → KV → create database → link to project
// Then pull env vars: vercel env pull
// Env vars needed: KV_REST_API_URL, KV_REST_API_TOKEN

export const revalidate = 60

export async function GET() {
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN

  if (!url || !token) {
    return Response.json({ teams: 0, battles: 0, trainers: 0 })
  }

  try {
    const res = await fetch(
      `${url}/mget/counter:teams/counter:battles/counter:trainers`,
      { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 60 } }
    )
    const data = await res.json()
    const [teams, battles, trainers] = (data.result as (string | null)[])
    return Response.json({
      teams:    parseInt(teams    ?? '0') || 0,
      battles:  parseInt(battles  ?? '0') || 0,
      trainers: parseInt(trainers ?? '0') || 0,
    })
  } catch {
    return Response.json({ teams: 0, battles: 0, trainers: 0 })
  }
}
