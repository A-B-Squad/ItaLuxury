import { Context } from "@/pages/api/graphql";

export const addApiCredentials = async (
  _: any,
  { input }: { input: AddToApiCredentialsInput },
  { prisma }: Context
) => {
  try {
    // Check if credentials already exist based on `api_id` and other fields
    const existingCredentials = await prisma.apiCredentials.findFirst({
      where: {
        api_id: input.api_id,
        access_token: input.access_token,
        integrationFor: input.integrationFor,
        domainVerification: input.domainVerification,
      },
    });

    if (existingCredentials) {
      // If an exact match exists, return a message that nothing was updated
      return "No changes detected, credentials are already up-to-date";
    }

    // Check if a record with the same `api_id` exists but different values
    const existingByApiId = await prisma.apiCredentials.findFirst({
      where: {
        api_id: input.api_id,
      },
    });

    if (existingByApiId) {
      // Update only the changed values
      await prisma.apiCredentials.updateMany({
        where: {
          api_id: input.api_id,
        },
        data: {
          access_token: input.access_token,
          integrationFor: input.integrationFor,
          domainVerification: input.domainVerification,
        },
      });

      return "Credentials updated with new values";
    }

    // Create new credentials if none exist
    await prisma.apiCredentials.create({
      data: {
        api_id: input.api_id,
        access_token: input.access_token,
        integrationFor: input.integrationFor,
        domainVerification: input.domainVerification,
      },
    });

    return "New credentials added";
  } catch (error) {
    console.error("Error creating or updating API credentials:", error);
    throw new Error("Failed to create or update API credentials");
  }
};
