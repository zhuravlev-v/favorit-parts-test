const API_ERROR = 'Не удалось подключиться к API.'

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({ error: 'Method not allowed' })
  }

  const apiBaseUrl = process.env.FAVORIT_API_BASE_URL
  const apiKey = process.env.FAVORIT_API_KEY

  if (!apiBaseUrl || !apiKey) {
    return response.status(500).json({ error: 'Не заданы переменные API.' })
  }

  const requestUrl = new URL(request.url, 'http://localhost')
  const apiUrl = new URL('/hs/hsprice/', apiBaseUrl)

  for (const name of ['number', 'brand', 'analogues']) {
    const value = requestUrl.searchParams.get(name)

    if (value !== null) {
      apiUrl.searchParams.set(name, value)
    }
  }

  apiUrl.searchParams.set('key', apiKey)

  try {
    const apiResponse = await fetch(apiUrl)
    const body = await apiResponse.arrayBuffer()

    response.status(apiResponse.status)
    response.setHeader(
      'Content-Type',
      apiResponse.headers.get('content-type') || 'application/json; charset=utf-8',
    )
    response.setHeader('Cache-Control', 'no-store')

    return response.send(Buffer.from(body))
  } catch {
    return response.status(502).json({ error: API_ERROR })
  }
}
