import { getKVCredentials } from '@/lib/redis'

const VALID = new Set(['teams', 'battles', 'trainers'])

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ counter: string }> }
) {
  const { counter } = await params
  if (!VALID.has(counter)) {
    return Response.json({ error: 'Invalid counter' }, { status: 400 })
  }

  const creds = getKVCredentials()
  if (!creds) return Response.json({ result: 0 })

  try {
    const res = await fetch(`${creds.url}/incr/counter:${counter}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${creds.token}` },
    })
    const data = await res.json()
    return Response.json({ result: data.result })
  } catch {
    return Response.json({ result: 0 })
  }
}
