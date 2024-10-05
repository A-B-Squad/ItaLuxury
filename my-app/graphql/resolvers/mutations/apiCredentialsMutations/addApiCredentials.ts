import { Context } from "@/pages/api/graphql";

export const addApiCredentials = async (
  _: any,
  { input }: { input: AddToApiCredentialsInput },
  { prisma }: Context
) => {
  try {
    // Check if a record with the same `api_id` exists
    const existingByApiId = await prisma.apiCredentials.findFirst({
      where: {
        api_id: input.api_id,
      },
    });

    if (existingByApiId) {
      // Prepare update data, only including fields that are provided in the input
      const updateData: Partial<AddToApiCredentialsInput> = {};
      if (input.access_token !== undefined) updateData.access_token = input.access_token;
      if (input.integrationFor !== undefined) updateData.integrationFor = input.integrationFor;
      if (input.domainVerification !== undefined) updateData.domainVerification = input.domainVerification;

      // If there are fields to update
      if (Object.keys(updateData).length > 0) {
        await prisma.apiCredentials.update({
          where: {
            id: existingByApiId.id, // Assuming there's an 'id' field
          },
          data: updateData,
        });
        return "Credentials updated with new values";
      } else {
        return "No changes detected, credentials are already up-to-date";
      }
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