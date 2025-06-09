// app/api/graphql/apollo-handler.ts
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { typeDefs } from '@/app/graphql/schema';
import { resolvers } from '@/app/graphql/resolvers';
import { NextRequest } from 'next/server';

const server = new ApolloServer({ typeDefs, resolvers });

export const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => ({
    headers: Object.fromEntries(req.headers),
  }),
});
