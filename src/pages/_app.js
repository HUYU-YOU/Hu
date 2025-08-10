import { AppProvider } from '@/context/AppContext';
import { contents } from '@/data/contents';
import '@/styles.css';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <AppProvider initialContents={contents}>
      <Component {...pageProps} />
    </AppProvider>
  );
}
