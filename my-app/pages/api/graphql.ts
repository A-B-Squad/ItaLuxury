import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { PrismaClient } from "@prisma/client";
import { prisma } from "../../prisma/db";
import { typeDefs } from "../../graphql/schema";
import { resolvers } from "../../graphql/resolvers";
import cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";

const JWT_SECRET = process.env.JWT_SECRET || "JWT secret";

export type Context = {
  prisma: PrismaClient;
  jwtSecret: string;
  req: any;
  res: any;
};

// Create a function to initialize the Apollo Server
function initApolloServer() {
  return new ApolloServer<Context>({ typeDefs, resolvers });
}

// Create the Apollo Server instance
const apolloServer = initApolloServer();

const corsMiddleware = cors({
  origin: process.env.NEXT_ALLOW_REQUEST_API_URL,
  credentials: true,
});

// Create the handler function
const createHandler = () => {
  return startServerAndCreateNextHandler(apolloServer, {
    context: async (req, res) => ({ req, res, prisma, jwtSecret: JWT_SECRET }),
  });
};

// Initialize the handler
let handler: ReturnType<typeof createHandler>;

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS middleware
  await new Promise<void>((resolve, reject) => {
    corsMiddleware(req, res, (err) => {
      if (err) reject(err);
      resolve();
    });
  });

  // Initialize the handler if it hasn't been initialized yet
  if (!handler) {
    handler = createHandler();
  }

  // Call the handler
  return handler(req, res);
}
