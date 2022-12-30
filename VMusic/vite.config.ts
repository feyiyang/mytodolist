import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'primary-1': '#E8FFEF',
          'primary-2': '#B2F3C9',
          'primary-3': '#81E6A8',
          'primary-4': '#17ce91',
          'primary-5': '#04A457',
          'primary-6': '#35cfb6',
          'neutral-3': '#fff',
          'tabs-line-color-header-border': '#fff'
        },
        javascriptEnabled: true
      },
      scss: {
        additionalData: '@import "@/assets/vars.scss";'
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://music-player-server.immortalboy.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
