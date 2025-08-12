import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcrypt';
import { query } from '../../../lib/db';

export default NextAuth({
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: { params: { prompt: 'consent', access_type: 'offline', response_type: 'code' } },
    }),
    Credentials({
      name: 'Email & Mot de passe',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password || '';
        if (!email || !password) return null;
        const { rows } = await query(
          'SELECT id, email, password_hash, display_name, country_code FROM users WHERE email=$1',
          [email]
        );
        if (!rows.length) return null;
        const user = rows[0];
        const ok = await bcrypt.compare(password, user.password_hash || '');
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.display_name, countryCode: user.country_code };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const email = user.email?.toLowerCase();
        if (!email) return false;
        await query(
          `INSERT INTO users (email, display_name)
           VALUES ($1, $2)
           ON CONFLICT (email) DO UPDATE SET display_name=EXCLUDED.display_name`,
          [email, user.name || null]
        );
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const { rows } = await query('SELECT id, country_code FROM users WHERE email=$1', [
          user.email.toLowerCase(),
        ]);
        if (rows.length) {
          token.id = rows[0].id;
          token.countryCode = rows[0].country_code || null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id || session.user.id;
      session.user.countryCode = token.countryCode || null;
      return session;
    },
  },
  pages: { signIn: '/login' },
});
