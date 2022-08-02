import * as prismic from '@prismicio/client';
import { enableAutoPreviews } from '@prismicio/next';
import { IncomingMessage } from 'http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';
import sm from '../../sm.json';

export const endpoint = sm.apiEndpoint;

export const repositoryName = prismic.getRepositoryName(endpoint);

interface DocumentProps { 
  type?: string;
  uid?: string;
};

interface ConfigProps { 
  previewData?: string;
  req?: IncomingMessage & { cookies: NextApiRequestCookies };
}

export function linkResolver(doc:DocumentProps) {
  switch (doc.type) {
    case 'homepage':
      return '/'
    case 'page':
      return `/${doc.uid}`
    default:
      return null
  }
}

export const createClient = (config = {} as ConfigProps) => {
  const client = prismic.createClient(endpoint, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN
  });

  enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req,
  });

  return client;
}

