import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

import Components from 'unplugin-vue-components/vite'
// Nếu cần tự động import các thành phần của Element Plus thì bỏ comment dòng dưới
// import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    Components({
        resolvers: [ElementPlusResolver({ importStyle: false })],
    }),
    // Nếu cần tự động import các thành phần của Element Plus thì bỏ comment dòng dưới
    // AutoImport({
    //     resolvers: [ElementPlusResolver()],
    // }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Cấu hình proxy nếu cần
  server: {
    proxy: {
      '/api': {
        target: 'https://api.example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
