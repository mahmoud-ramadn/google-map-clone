export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n'],
  runtimeConfig: {
    public: {
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',
    },
  },
    i18n: {
    /* module options */
    lazy: true,
    langDir: "locales",
    strategy: "prefix_except_default",
    locales: [
      {
        code: "en-US",
        iso: "en-US",
        name: "English(US)",
        file: "en-US.json",
      },
      {
        code: "es-ES",
        iso: "es-ES",
        name: "Español",
        file: "es-ES.json",
      },
      {
        code: "in-HI",
        iso: "en-HI",
        name: "हिंदी",
        file: "in-HI.json",
      },
    ],
    defaultLocale: "en-US",
    vueI18n: {
      fallbackLocale: "en-US",
    },
  },

})