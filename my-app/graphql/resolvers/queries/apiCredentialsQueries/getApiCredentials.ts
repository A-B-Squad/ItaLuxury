import { Context } from "@/pages/api/graphql";

export const getApiCredentials = async (
  _: any,
  { integrationFor }: { integrationFor: string },
  { prisma }: Context
) => {
  try {
    const apiCredentials = await prisma.apiCredentials.findFirst({
      where: { integrationFor: integrationFor },
    });

    return apiCredentials;
  } catch (error) {
    console.log(`Failed to fetch apiCredentials  `, error);
    return new Error(`Failed to fetch apiCredentials  `);
  }
};
