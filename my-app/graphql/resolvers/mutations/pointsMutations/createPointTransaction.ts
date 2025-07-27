import { Context } from "@/pages/api/graphql";
import { PointType } from "@prisma/client";

interface PointTransactionInput {
    userId: string;
    amount: number;
    type: PointType;
    description?: string;
    checkoutId?: string;
}

export const createPointTransaction = async (
    _: any,
    { input }: { input: PointTransactionInput },
    { prisma }: Context
) => {
    try {
        const { userId, amount, type, description, checkoutId } = input;

        // Validate the user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }

        // Create the point transaction
        const pointTransaction = await prisma.pointTransaction.create({
            data: {
                userId,
                amount,
                type,
                description,
                checkoutId,
            },
        });

        // Update the user's points based on the transaction type
        let pointsUpdate = 0;
        if (type === PointType.EARNED || type === PointType.ADMIN_ADDED) {
            pointsUpdate = user.points + amount;
        } else if (type === PointType.EXPIRED || type === PointType.ADJUSTMENT) {
            pointsUpdate = Math.max(0, user.points - amount);
        }

        // Update the user's points
        await prisma.user.update({
            where: { id: userId },
            data: { points: pointsUpdate },
        });

        return pointTransaction;
    } catch (error) {
        console.error("Error creating point transaction:", error);
        throw error;
    }
};