// Import global styles via relative path to avoid unresolved '@' alias issues
import '../styles/globals.css';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
