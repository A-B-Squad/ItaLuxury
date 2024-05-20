// Import the PrismaClient class from the Prisma client library
import { PrismaClient } from "@prisma/client";

// Declare a variable named globalForPrisma and cast it as an object with a prisma property of type PrismaClient
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Create an instance of the PrismaClient class and assign it to the prisma variable.
// If globalForPrisma.prisma already exists (i.e., if it was previously assigned), use that existing instance.
// Otherwise, create a new instance of PrismaClient with logging enabled for queries.
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

// If the current environment is not production, assign the prisma instance to globalForPrisma.prisma.
// This ensures that the same prisma instance is used across different modules in the application,
// preventing multiple connections to the database in non-production environments.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
