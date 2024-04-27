import { Context } from "@/pages/api/graphql";


export const Authorization = async (
    _: any,
    { userId }: { userId: string },
    prisma: any
) => {
    try {
        // Fetch the user's role based on userId
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true } // Select only the role field
        });

        // Check if the user exists
        if (!user) {
            return new Error("User not found");
        }

        // Check if the user is an admin
        const isAdmin = user.role === "ADMIN";

        return isAdmin;
    } catch (error) {
        // Handle errors
        console.error("Error in Authorization function:", error);
        return new Error("An error occurred while checking authorization");
    }
};