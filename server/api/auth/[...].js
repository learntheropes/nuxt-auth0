import { NuxtAuthHandler } from '#auth';
import EmailProvider from 'next-auth/providers/email';
import faunadb from 'faunadb';
import { customFaunaAdapter } from '~/assets/js/customFaunaAdapter';

const {
  nextAuthSecret,
  faunaSecret,
  marangaduUser,
  marangaduPassword,
  marangaduHost,
  marangaduPort,
  marangaduFrom,
} = useRuntimeConfig();

const client = new faunadb.Client({
  secret: faunaSecret,
  scheme: 'https',
  domain: 'db.fauna.com',
  port: 443,
});

export default NuxtAuthHandler({
  debug: true,
  secret: nextAuthSecret,
  pages: {
    signIn: `/auth/login`,
    verifyRequest: `/auth/verify`,
  },
  providers: [
    EmailProvider.default({
      id: 'magic-link',
      name: 'send magic link by email',
      type: 'email',
      server: {
        host: marangaduHost,
        port: marangaduPort,
        auth: {
          user: marangaduUser,
          pass: marangaduPassword,
        },
      },
      from: marangaduFrom,
      maxAge: 60 * 60,
    }),
  ],
  adapter: customFaunaAdapter(client),
});
