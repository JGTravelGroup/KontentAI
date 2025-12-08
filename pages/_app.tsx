import '../styles/globals.scss';
import { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className='h-screen'>
      <Component {...pageProps} />
    </div>
  );
}