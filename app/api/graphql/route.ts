import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { resolvers } from '@/app/graphql/resolvers';
import { typeDefs } from '@/app/graphql/schema';
import { NextRequest } from 'next/server';

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => {
    let body;
    try {
      body = await req.json();
    } catch (err) {
      // Optional: log or handle malformed JSON
      console.error("Failed to parse body JSON", err);
    }

    return {
      body,
    };
  },
});

export async function POST(request: NextRequest) {
  return handler(request);
}

export async function GET(request: NextRequest) {
  return handler(request);
}