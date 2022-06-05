import type { AppProps } from 'next/app';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
  
import { Header } from '../components/Header';

import '../styles/globals.scss';

export default function MyApp({ 
  Component, 
  pageProps: { session, ...pageProps }
}: AppProps) {
  return (
    <NextAuthSessionProvider session={session}>
      <Header />
      <Component {...pageProps} />
    </NextAuthSessionProvider>
  )
};
