const VALID = new Set(['teams', 'battles', 'trainers'])

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ counter: string }> }
) {
  const { counter } = await params
  if (!VALID.has(counter)) {
    return Response.json({ error: 'Invalid counter' }, { status: 400 })
  }

  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN

  if (!url || !token) {
    return Response.json({ result: 0 })
  }

  try {
    const res = await fetch(`${url}/incr/counter:${counter}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    return Response.json({ result: data.result })
  } catch {
    return Response.json({ result: 0 })
  }
}
