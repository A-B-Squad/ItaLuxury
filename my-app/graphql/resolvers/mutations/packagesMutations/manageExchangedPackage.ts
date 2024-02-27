import { Context } from "@/pages/api/graphql";
export const exchangePackage = async (
    _: any,
    { input }: { input: managePackageInput },
    { prisma }: Context

) => {

    const { packageId, cause,productId,description } = input;



}