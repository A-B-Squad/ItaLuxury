import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "@/graphql/schema";
import { resolvers } from "@/graphql/resolvers";
import { prisma } from "@/prisma/db";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "JWT secret";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
  formatError: (err) => {
    console.error('GraphQL Error:', err);
    return {
      message: err.message,
      locations: err.locations,
      path: err.path,
      
      extensions: {
        code: err.extensions?.code,
        stacktrace: process.env.NODE_ENV === 'development' ? (err as Error).stack : undefined,
      },
    };
  },
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req,res) => {
    const token = req.cookies.get("Token")?.value;

    return {
      req,
      prisma,
      jwtSecret: JWT_SECRET,
      token,
    };
  },
});



export const GET = handler;
export const POST = handler;