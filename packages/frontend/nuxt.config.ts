import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', 'nuxt-lucide-icons', '@nuxt/test-utils/module'],
  css: [
    '@/assets/css/main.css'
  ],

  // Proxy API requests to Azure Functions in development
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:7071',
          changeOrigin: true
        }
      }
    }
  },

  typescript: {
    strict: true
  }
})
