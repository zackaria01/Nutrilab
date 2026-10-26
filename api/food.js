import { fetchRemoteFood } from '../server/searchRemote.js'

export default async function handler(req, res) {
  try {
    const food = await fetchRemoteFood(req.query?.source, req.query?.id, process.env.FDC_API_KEY)
    if (!food) {
      res.status(404).json({ error: 'not_found' })
      return
    }
    res.status(200).json({ food })
  } catch (error) {
    res.status(error.code === 'missing_key' ? 400 : 502).json({ error: error.code || 'food_failed' })
  }
}
