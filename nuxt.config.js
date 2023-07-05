const deploymentDomain =
  'githubduwzdfjuay4o-q2fl--3000--e809191e.local-credentialless.webcontainer.io'; // process.env.NEXTAUTH_URL;

export default defineNuxtConfig({
  runtimeConfig: {
    nextAuthSecret: process.env.NEXTAUTH_SECRET,
    faunaSecret: process.env.FAUNA_SECRET,
    marangaduUser: process.env.MARANGADU_USER,
    marangaduPassword: process.env.MARANGADU_PASSWORD,
    marangaduHost: process.env.MARANGADU_HOST,
    marangaduPort: process.env.MARANGADU_PORT,
    marangaduFrom: process.env.MARANGADU_FROM,
    public: {
      deploymentDomain,
    },
  },

  modules: [
    '@sidebase/nuxt-auth'
  ],

  auth: {
    provider: {
      type: 'authjs',
      addDefaultCallbackUrl: true
    },
    // https://sidebase.io/nuxt-auth/v0.6/configuration/nuxt-auth-handler#nuxtauthhandler
    origin: `${deploymentDomain}`,
    // https://sidebase.io/nuxt-auth/v0.6/configuration/nuxt-config#module-nuxtconfigts
    baseUrl: `/api/auth`,
    addDefaultCallbackUrl: true,
    globalAppMiddleware: {
      isEnabled: true,
      allow404WithoutAuth: true,
      addDefaultCallbackUrl: true
    },
  }
});
