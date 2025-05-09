import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
//import { viteStaticCopy } from 'vite-plugin-static-copy'
//import basicSsl from '@vitejs/plugin-basic-ssl'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    //basicSsl(),
    vue(),
    legacy(),
  ],
   // 啟用 CSP nonce 功能
   html: {
    //cspNonce: 'OZRHt3ob7FPvfReQvpym2A=='
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom'
  },
  server: {
    headers: {
      'Content-Security-Policy':"default-src 'self';script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';font-src 'self' data:; img-src 'self' https://img.youtube.com/; frame-src 'self' https://www.youtube.com/; form-action 'none';connect-src 'self' http://localhost:8081 http://114.34.190.146:8081 http://localhost:8080 http://114.34.190.146:8080; frame-ancestors 'none'; manifest-src 'self'; object-src 'none'; upgrade-insecure-requests; report-uri /csp-violation-report-endpoint",
      'X-Content-Type-Options': 'nosniff'
    }
}
})
