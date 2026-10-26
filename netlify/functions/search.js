import { searchRemote } from '../../server/searchRemote.js'

export async function handler(event) {
  try {
    const data = await searchRemote(event.queryStringParameters?.q, process.env.FDC_API_KEY)
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }
  } catch {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usda: [], off: [], errors: ['search_failed'], apiKeyConfigured: Boolean(process.env.FDC_API_KEY) }),
    }
  }
}
