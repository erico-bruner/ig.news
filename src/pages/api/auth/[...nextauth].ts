import { query as q } from "faunadb";

import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Error from "next/error";

import { fauna } from '../../../services/fauna';

export default NextAuth({

  providers: [

    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: { params: { scope: 'read:user' } },
    }),

  ],

  callbacks: { 
    async session({session}) {
      if(!(session && session.user && session.user.email)) {
        console.log('ENTROU PRIMEIRO IF') 
        return session 
      }

      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  'ref',
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                'active'
              )
            ])
          )
        );
        console.log('ENTROU NO TRY') 
        return {
          ...session,
          activeSubscription: userActiveSubscription
        }
      } catch {
        console.log('ENTROU NO CATCH') 
        return {
          ...session,
          activeSubscription: null
        }
      }
    },

    async signIn({ user, account, profile, credentials }) {
      const { email } = user;

      try {
        if(!email) {
           throw Error;
        }
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { email } }
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(email)
              )
            ),
          )
        );
        return true;
      } catch {
        return false;
      }
    },

  },

});