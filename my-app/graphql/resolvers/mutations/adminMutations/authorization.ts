import { Context } from "@/pages/api/graphql";

export const Authorization = async (
    _: any,
    { adminId }: { adminId: string },
    { prisma }: any
) => {
    try {
        // Fetch the user's role based on adminId
        const user = await prisma.admin.findUnique({
            where: { id: adminId },
        });

        // Check if the user exists
        if (!user) {
            return new Error("User not found");
        }

        // Check if the user is an admin
        const isAdmin = user.role === "ADMIN";

        if (!isAdmin) {
            // If not an admin, return a custom message or error
            return new Error("You do not have permission to access this resource.");
        }

        return true; // Return true if the user is an admin
    } catch (error) {
        // Handle errors
        console.error("Error in Authorization function:", error);
        return new Error("An error occurred while checking authorization");
    }
};
