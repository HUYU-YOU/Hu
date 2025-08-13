import { AppProvider } from '@/context/AppContext';
import { contents } from '@/data/contents';
import '../styles.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <AppProvider initialContents={contents}>
      <Component {...pageProps} />
    </AppProvider>
  );
}
