import { SessionProvider } from 'next-auth/react';
import { AppProvider } from '@/context/AppContext';
import { contents } from '@/data/contents';
import '../styles.css';

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <AppProvider initialContents={contents}>
        <Component {...pageProps} />
      </AppProvider>
    </SessionProvider>
  );
}
