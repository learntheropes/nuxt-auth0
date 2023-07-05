import faunadb from 'faunadb';

const {
  Collection,
  Create,
  Delete,
  Exists,
  Get,
  If,
  Index,
  Let,
  Match,
  Ref,
  Select,
  Time,
  Update,
  Var,
  Paginate,
  Lambda,
  Do,
  Foreach,
} = faunadb;

const collections = {
  Users: Collection('users'),
  Accounts: Collection('accounts'),
  Sessions: Collection('sessions'),
  VerificationTokens: Collection('verification_tokens'),
};

const indexes = {
  AccountByProviderAndProviderAccountId: Index(
    'account_by_provider_and_provider_account_id'
  ),
  UserByEmail: Index('user_by_email'),
  SessionByToken: Index('session_by_session_token'),
  VerificationTokenByIdentifierAndToken: Index(
    'verification_token_by_identifier_and_token'
  ),
  SessionsByUser: Index('sessions_by_user_id'),
  AccountsByUser: Index('accounts_by_user_id'),
};

const format = {
  /** Takes a plain old JavaScript object and turns it into a Fauna object */
  to(object) {
    const newObject = {};
    for (const key in object) {
      const value = object[key];
      if (value instanceof Date) {
        newObject[key] = Time(value.toISOString());
      } else {
        newObject[key] = value;
      }
    }
    return newObject;
  },
  /** Takes a Fauna object and returns a plain old JavaScript object */
  from(object) {
    const newObject = {};
    for (const key in object) {
      const value = object[key];
      if (value && value.value && typeof value.value === 'string') {
        newObject[key] = new Date(value.value);
      } else {
        newObject[key] = value;
      }
    }
    return newObject;
  },
};

/**
 * Fauna throws an error when something is not found in the db,
 * `next-auth` expects `null` to be returned
 */
const query = (f, format) => {
  return async function (expr) {
    try {
      const result = await f.query(expr);
      if (!result) return null;
      return format({ ...result.data, id: result.ref.id });
    } catch (error) {
      if (error.name === 'NotFound') return null;
      if (
        error.description &&
        error.description.includes('Number or numeric String expected')
      )
        return null;
      if (process.env.NODE_ENV === 'test') console.error(error);
      throw error;
    }
  };
};

export const customFaunaAdapter = (f) => {
  const { Users, Accounts, Sessions, VerificationTokens } = collections;
  const {
    AccountByProviderAndProviderAccountId,
    AccountsByUser,
    SessionByToken,
    SessionsByUser,
    UserByEmail,
    VerificationTokenByIdentifierAndToken,
  } = indexes;
  const { to, from } = format;
  const q = query(f, from);
  return {
    createUser: async (data) => await q(Create(Users, { data: to(data) })),
    getUser: async (id) => await q(Get(Ref(Users, id))),
    getUserByEmail: async (email) => await q(Get(Match(UserByEmail, email))),
    getUserByAccount: async ({ provider, providerAccountId }) => {
      const key = [provider, providerAccountId];
      const ref = Match(AccountByProviderAndProviderAccountId, key);
      const user = await q(
        Let(
          { ref },
          If(
            Exists(Var('ref')),
            Get(Ref(Users, Select(['data', 'userId'], Get(Var('ref'))))),
            null
          )
        )
      );
      return user;
    },
    updateUser: async (data) =>
      await q(Update(Ref(Users, data.id), { data: to(data) })),
    deleteUser: async (userId) => {
      await f.query(
        Do(
          Foreach(
            Paginate(Match(SessionsByUser, userId)),
            Lambda('ref', Delete(Var('ref')))
          ),
          Foreach(
            Paginate(Match(AccountsByUser, userId)),
            Lambda('ref', Delete(Var('ref')))
          ),
          Delete(Ref(Users, userId))
        )
      );
    },
    linkAccount: async (data) => await q(Create(Accounts, { data: to(data) })),
    unlinkAccount: async ({ provider, providerAccountId }) => {
      const id = [provider, providerAccountId];
      await q(
        Delete(
          Select('ref', Get(Match(AccountByProviderAndProviderAccountId, id)))
        )
      );
    },
    createSession: async (data) =>
      await q(Create(Sessions, { data: to(data) })),
    getSessionAndUser: async (sessionToken) => {
      const session = await q(Get(Match(SessionByToken, sessionToken)));
      if (!session) return null;
      const user = await q(Get(Ref(Users, session.userId)));
      return { session, user };
    },
    updateSession: async (data) => {
      const ref = Select('ref', Get(Match(SessionByToken, data.sessionToken)));
      return await q(Update(ref, { data: to(data) }));
    },
    deleteSession: async (sessionToken) => {
      await q(Delete(Select('ref', Get(Match(SessionByToken, sessionToken)))));
    },
    createVerificationToken: async (data) => {
      const { id: _id, ...verificationToken } = await q(
        Create(VerificationTokens, { data: to(data) })
      );
      return verificationToken;
    },
    useVerificationToken: async ({ identifier, token }) => {
      const key = [identifier, token];
      const object = Get(Match(VerificationTokenByIdentifierAndToken, key));
      const verificationToken = await q(object);
      if (!verificationToken) return null;
      await q(Delete(Select('ref', object)));
      delete verificationToken.id;
      return verificationToken;
    },
  };
};
