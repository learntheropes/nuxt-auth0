const isDeployed = (
  process.env.AUTH_ORIGIN === 'http://localhost:3000'
  || !process.env.AUTH_ORIGIN
) ? false : true;
const deploymentDomain = process.env.AUTH_ORIGIN || 'http://localhost:3000';


export default defineNuxtConfig({
  runtimeConfig: {
    nextAuthSecret: process.env.NEXTAUTH_SECRET,
    auth0ClientId: process.env.AUTH0_CLIENT_ID,
    auth0ClientSecret: process.env.AUTH0_CLIENT_SECRET,
    auth0Issuer: process.env.AUTH0_ISSUER,
    public: {
      isDeployed
    }
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
    origin: deploymentDomain,
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
