// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig( {
  compatibilityDate: '2026-02-07',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode'
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001/api',
      appName: 'Diaso Inventory System'
    }
  },

  app: {
    head: {
      title: 'Diaso Inventory System',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Inventory & Accounting Management System' }
      ]
    }
  },

  css: [ '~/assets/css/main.css' ],

  typescript: {
    strict: true
  }
} )
