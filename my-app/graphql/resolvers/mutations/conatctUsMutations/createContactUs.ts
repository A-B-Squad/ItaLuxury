import { Context } from "@/pages/api/graphql";


export const createContactUs = async (
    _: any,
    { input }: { input: ContactUsInput },
    { prisma }: Context
) => {
    try {
        const { subject, email, message, document } = input;

        // Create the company info with the provided data
        const createdContactMessage = await prisma.contactUs.create({
            data: {
                subject,
                email,
                message, document: document || undefined
            },
        });

        return "Message create";
    } catch (error) {
        // Handle errors
        console.error("Error creating Contact Message:", error);
        return new Error("Error creating Contact Message:");
    }
};