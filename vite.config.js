import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'nutrilab-food-api',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (!req.url?.startsWith('/api/')) return next()
            const url = new URL(req.url, 'http://localhost')
            const { searchRemote, fetchRemoteFood } = await import('./server/searchRemote.js')
            try {
              if (url.pathname === '/api/search') {
                const data = await searchRemote(url.searchParams.get('q'), env.FDC_API_KEY)
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
                return
              }
              if (url.pathname === '/api/food') {
                const food = await fetchRemoteFood(url.searchParams.get('source'), url.searchParams.get('id'), env.FDC_API_KEY)
                res.statusCode = food ? 200 : 404
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(food ? { food } : { error: 'not_found' }))
                return
              }
            } catch (error) {
              res.statusCode = 502
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: error.code || 'api_failed' }))
              return
            }
            next()
          })
        },
      },
    ],
    test: {
      environment: 'jsdom',
      setupFiles: './tests/setup.js',
    },
  }
})
