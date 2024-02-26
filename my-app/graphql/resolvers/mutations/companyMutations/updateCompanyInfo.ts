import { Context } from "@/pages/api/graphql";

export const updateCompanyInfo = async (
    _: any,
    { input, id }: { id: string, input: CompanyInfoInput },
    { prisma }: Context
) => {
    try {
        const { phone, deliveringPrice, logo } = input;
        // Update the company info with the provided data
        const updatedCompanyInfo = await prisma.companyInfo.update({
            where: { id },
            data: {
                phone,
                deliveringPrice,
                logo
            },
        });

        return updatedCompanyInfo;
    } catch (error) {
        // Handle errors
        console.error("Error updating company info:", error);
        return new Error("Failed to update company info");
    }
};
