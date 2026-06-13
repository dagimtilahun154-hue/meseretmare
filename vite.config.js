import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function dm154CmsRedirect() {
  const redirect = (req, res, next) => {
    if (req.url === '/DM154' || req.url === '/DM154/') {
      res.statusCode = 302
      res.setHeader('Location', '/DM154/index.html')
      res.end()
      return
    }

    next()
  }

  return {
    name: 'dm154-cms-redirect',
    configureServer(server) {
      server.middlewares.use(redirect)
    },
    configurePreviewServer(server) {
      server.middlewares.use(redirect)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [dm154CmsRedirect(), react()],
})
