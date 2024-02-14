// Importing necessary dependencies and modules
import { ApolloServer } from "@apollo/server"; // Apollo Server for GraphQL
import { startServerAndCreateNextHandler } from "@as-integrations/next"; // Integration with Next.js
import { PrismaClient } from "@prisma/client"; // Prisma ORM Client
import { prisma } from "../../prisma/db"; // Prisma database instance
import { typeDefs } from "@/graphql/schema"; // GraphQL schema definitions
import { resolvers } from "@/graphql/resolvers"; // GraphQL resolvers

// Define the context type to be used in ApolloServer
export type Context = {
  prisma: PrismaClient; // Prisma client instance will be available in the context
};

// Create an instance of ApolloServer with type definitions and resolvers
const apolloServer = new ApolloServer<Context>({ typeDefs, resolvers });

// Start the server and create a Next.js request handler
export default startServerAndCreateNextHandler(apolloServer, {
  // Define context for each request
  context: async (req, res) => ({ req, res, prisma }), // Including request, response, and Prisma client in context
});
