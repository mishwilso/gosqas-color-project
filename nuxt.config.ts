import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  css: [
    '@/assets/css/main.css'
  ],
  
  typescript: {
    strict: true
  }
})