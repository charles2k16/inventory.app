// https://nuxt.com/docs/api/configuration/nuxt-config
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );

export default defineNuxtConfig( {
  compatibilityDate: '2026-02-07',
  devtools: { enabled: true },

  // Static output to backend/public for single-app deploy (used by `nuxt generate`)
  nitro: {
    preset: 'static',
    output: {
      publicDir: path.join( __dirname, '..', 'backend', 'public' ),
    },
  },

  // Don't extract/request _payload.json – app fetches all data client-side from API
  experimental: {
    payloadExtraction: false,
  },

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
