import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
    server: {
      proxy: {
        '/api/parts': {
          target: env.FAVORIT_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/parts/, '/hs/hsprice/'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyRequest) => {
              const url = new URL(
                proxyRequest.path,
                env.FAVORIT_API_BASE_URL,
              )
              url.searchParams.set(
                'key',
                env.FAVORIT_API_KEY,
              )
              proxyRequest.path = `${url.pathname}${url.search}`
            })
          },
        },
      },
    },
  }
})
