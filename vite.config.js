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

  // SPA fallback: serve index.html for any non-file, non-DM154 path
  const spaFallback = (req, res, next) => {
    const url = req.url || '/'
    // Skip DM154 paths, file requests (have extension), and Vite internal paths
    if (
      url.startsWith('/DM154') ||
      url.startsWith('/@') ||
      url.startsWith('/node_modules') ||
      /\.[a-z0-9]{1,10}(\?.*)?$/i.test(url)
    ) {
      return next()
    }
    // For all SPA routes, serve index.html
    req.url = '/index.html'
    next()
  }

  return {
    name: 'dm154-cms-redirect',
    configureServer(server) {
      server.middlewares.use(redirect)
      server.middlewares.use(spaFallback)
    },
    configurePreviewServer(server) {
      server.middlewares.use(redirect)
      server.middlewares.use(spaFallback)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [dm154CmsRedirect(), react()],
  server: {
    proxy: {
      '/DM154/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/DM154/uploads': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      }
    }
  }
})

