import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  
  vite: {
    plugins: [
      vueJsx()
    ]
  },
  
  typescript: {
    strict: true
  }
})