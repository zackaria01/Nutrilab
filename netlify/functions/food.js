import { fetchRemoteFood } from '../../server/searchRemote.js'

export async function handler(event) {
  try {
    const food = await fetchRemoteFood(event.queryStringParameters?.source, event.queryStringParameters?.id, process.env.FDC_API_KEY)
    if (!food) {
      return { statusCode: 404, body: JSON.stringify({ error: 'not_found' }) }
    }
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ food }) }
  } catch (error) {
    return {
      statusCode: error.code === 'missing_key' ? 400 : 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.code || 'food_failed' }),
    }
  }
}
