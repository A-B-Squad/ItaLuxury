// Import necessary modules and dependencies
import { ApolloServer } from "@apollo/server"; // Apollo Server for GraphQL
import { startServerAndCreateNextHandler } from "@as-integrations/next"; // Integration with Next.js
import { PrismaClient } from "@prisma/client"; // Prisma ORM Client
import { prisma } from "../../prisma/db"; // Prisma database instance
import { typeDefs } from "../../graphql/schema"; // GraphQL schema definitions
import { resolvers } from "../../graphql/resolvers"; // GraphQL resolvers
import cors from "cors"; // Import the CORS middleware
import { NextApiRequest, NextApiResponse } from 'next';

// Define the JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "JWT secret";

// Define the context type which includes the Prisma client
export type Context = {
  prisma: PrismaClient;
  jwtSecret: string;
  req: any;
  res: any;
};

// Create a new instance of ApolloServer with provided type definitions and resolvers
const apolloServer = new ApolloServer<Context>({ typeDefs, resolvers, });


// Middleware to handle CORS
const corsMiddleware = cors({
  origin: process.env.NEXT_ALLOW_REQUEST_API_URL  , // Allow requests from this origin
  credentials: true, // Allow cookies and other credentials
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS middleware
  await new Promise<void>((resolve, reject) => {
    corsMiddleware(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

  // Handle GraphQL requests
  return startServerAndCreateNextHandler(apolloServer, {
    context: async () => ({ req, res, prisma, jwtSecret: JWT_SECRET }),
  })(req, res);
}

export default handler;
