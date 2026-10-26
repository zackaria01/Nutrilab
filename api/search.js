import { searchRemote } from '../server/searchRemote.js'

export default async function handler(req, res) {
  try {
    const data = await searchRemote(req.query?.q, process.env.FDC_API_KEY)
    res.status(200).json(data)
  } catch {
    res.status(500).json({ usda: [], off: [], errors: ['search_failed'], apiKeyConfigured: Boolean(process.env.FDC_API_KEY) })
  }
}
