import type { AppProps } from 'next/app';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import Link from 'next/link'
import { PrismicProvider } from '@prismicio/react';
import { PrismicPreview } from '@prismicio/next';
import { linkResolver, repositoryName } from '../services/prismic';

import { Header } from '../components/Header';

import '../styles/globals.scss';

export default function MyApp({ 
  Component, 
  pageProps: { session, ...pageProps }
}: AppProps) {
  return (
   <PrismicProvider
      linkResolver={linkResolver}
      internalLinkComponent={({ href, children, ...props }) => (
        <Link href={href}>
          <a {...props}>{children}</a>
        </Link>
      )}
    >
      <PrismicPreview repositoryName={repositoryName}>
        <NextAuthSessionProvider session={session}>
          <Header />
          <Component {...pageProps} />
        </NextAuthSessionProvider>
      </PrismicPreview>
    </PrismicProvider>
  )
};
