// Import necessary modules and dependencies
import { ApolloServer } from "@apollo/server"; // Apollo Server for GraphQL
import { startServerAndCreateNextHandler } from "@as-integrations/next"; // Next.js server integration
import { PrismaClient } from "@prisma/client"; // Prisma client for database access
import { prisma } from "../../prisma/db"; // Importing Prisma instance
import { typeDefs } from "@/graphql/schema"; // GraphQL type definitions
import { resolvers } from "@/graphql/resolvers"; // GraphQL resolvers

// Define the context type which includes the Prisma client
export type Context = {
  prisma: PrismaClient;
};

// Create a new instance of ApolloServer with provided type definitions and resolvers
const apolloServer = new ApolloServer<Context>({ typeDefs, resolvers });

// Export the Next.js server handler by starting ApolloServer and integrating it with Next.js
export default startServerAndCreateNextHandler(apolloServer, {
  // Define context function to provide context to ApolloServer
  context: async (req, res) => ({ req, res, prisma }), // Include request, response, and Prisma client in context
});
