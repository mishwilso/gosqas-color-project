import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', 'nuxt-lucide-icons', '@nuxt/test-utils/module'],
  css: [
    '@/assets/css/main.css'
  ],
  runtimeConfig: {
    azureStorageConnectionString: "UseDevelopmentStorage=true",
  },

  typescript: {
    strict: true
  }
}) 