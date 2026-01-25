import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', 'nuxt-lucide-icons'],
  css: [
    '@/assets/css/main.css'
  ],
  
  typescript: {
    strict: true
  }
})