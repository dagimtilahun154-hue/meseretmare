import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function dm154CmsRedirect() {
  const redirect = (req, res, next) => {
    if (/\/DM154\/?$/i.test(req.url || '')) {
      res.statusCode = 302
      const cleanUrl = (req.url || '/DM154').replace(/\/?$/, '/')
      res.setHeader('Location', `${cleanUrl}index.html`)
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
  base: './',
  plugins: [dm154CmsRedirect(), react()],
})
