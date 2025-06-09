import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { resolvers } from '@/app/graphql/resolvers';
import { typeDefs } from '@/app/graphql/schema';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = "force-dynamic";

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server,{
  context: async (req) => {
    return {
      headers: Object.fromEntries(req.headers),
    };
  },
});

export async function POST(request: NextRequest) {
  return handler(request);
}

export async function GET(request: NextRequest) { 
  return handler(request);
}  