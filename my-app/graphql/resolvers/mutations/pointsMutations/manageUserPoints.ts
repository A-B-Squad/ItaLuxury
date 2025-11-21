import { Context } from "@apollo/client";
import { $Enums, PointType } from "@prisma/client";

interface PointTransactionInput {
    userId: string;
    amount: number;
    type: PointType;
    description?: string;
    checkoutId?: string;
}

export const manageUserPoints = async (
    _: any,
    { input }: { input: PointTransactionInput },
    { prisma }: Context
): Promise<String> => {
    try {
        const { userId, amount, type, description, checkoutId } = input;

        console.log("Managing user points with input:", input);
        // Validate amount is positive
        if (amount < 0) {
            throw new Error("Amount must be a positive number");
        }

        // Validate the user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }

        // Execute transaction atomically (both operations succeed or both fail)
        await prisma.$transaction(async (tx: { pointTransaction: { create: (arg0: { data: { userId: string; amount: number; type: $Enums.PointType; description: string; checkoutId: string | undefined; }; }) => any; }; user: { update: (arg0: { where: { id: string; }; data: { points: number; }; }) => any; }; }) => {
            // Create the point transaction record
            await tx.pointTransaction.create({
                data: {
                    userId,
                    amount,
                    type,
                    description: description || getDefaultDescription(type),
                    checkoutId,
                },
            });

            // Calculate new points based on transaction type
            let newPoints: number;

            switch (type) {
                case PointType.EARNED:
                case PointType.ADMIN_ADDED:
                    // Add points
                    newPoints = user.points + amount;
                    break;

                case PointType.EXPIRED:
                case PointType.ADJUSTMENT:
                    // Subtract points (ensure never goes below 0)
                    newPoints = Math.max(0, user.points - amount);
                    break;

                default:
                    throw new Error(`Unknown point transaction type: ${type}`);
            }

            // Update the user's points
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: { points: newPoints },
            });
        });

        return "Points managed successfully";
    } catch (error) {
        console.error("❌ Error managing user points:", error);
        throw error;
    }
};

/**
 * Helper: Get default description for each transaction type
 */
function getDefaultDescription(type: PointType): string {
    switch (type) {
        case PointType.EARNED:
            return "Points earned from purchase";
        case PointType.ADMIN_ADDED:
            return "Points added by administrator";
        case PointType.EXPIRED:
            return "Points expired";
        case PointType.ADJUSTMENT:
            return "Points adjustment";
        default:
            return "Point transaction";
    }
}