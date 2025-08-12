import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: { params: { prompt: 'consent', access_type: 'offline', response_type: 'code' } },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.provider = 'google';
        token.picture = profile?.picture ?? token.picture;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.image = token.picture ?? session.user.image;
      session.provider = token.provider ?? null;
      return session;
    },
  },
  pages: { signIn: '/login' },
});
