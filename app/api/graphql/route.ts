// app/api/graphql/route.ts
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "../../graphql/schema";
import { resolvers } from "../../graphql/resolvers";
import { authOptions } from "../../../lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req: NextRequest) => {
    console.log("GraphQL API hit");
    const session = await getServerSession(authOptions);
    console.log("Session in GraphQL API", session);
    return { session };
  },
});

export { handler as GET, handler as POST };
