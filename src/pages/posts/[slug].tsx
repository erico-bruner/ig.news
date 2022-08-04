import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import Head from "next/head";
import { RichText } from "prismic-dom";
import { createClient } from "../../services/prismic";

import styles from './post.module.scss';

interface ParamsProps extends NextApiRequestCookies {
  slug: string;
}

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string,
    updatedAt: string;
  }
}

export default function Post({post}:PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>

          <div 
            className={styles.postContent}
            dangerouslySetInnerHTML= {{__html: post.content}} 
          />
        </article>
      </main>
    </>
  );
};

export const getServerSideProps:GetServerSideProps = async ({
  req, params
}) => {
  const session = await getSession({req});
  const { slug } = params as ParamsProps;
  
  if(!(session && session.activeSubscription)) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  };

  const prismic = createClient({req});

  const response = await prismic.getByUID('publication', String(slug), {});

  const post = {
    slug, 
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }), 
  };

  return {
    props: {
      post,
    }
  };
}