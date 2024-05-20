import { Context } from "@/pages/api/graphql";

import { PrismaClient } from "@prisma/client";

interface AddBestSellesInput {
  position: string;
  productId: string;
}
export const addBestSells = async (
  _: any,
  { input }: { input: AddBestSellesInput },
  { prisma }: Context
) => {


};
