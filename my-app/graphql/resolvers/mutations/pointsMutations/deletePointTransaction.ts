import { Context } from "@apollo/client";


export const deletePointTransaction = async (
    _: any,
    { transactionId }: { transactionId: string },
    { prisma }: Context
) => {
    try {

        // Find the transaction to be deleted
        const transaction = await prisma.pointTransaction.findUnique({
            where: { id: transactionId },
            include: { user: true },
        });

        if (!transaction) {
            throw new Error(`Transaction with ID ${transactionId} not found`);
        }

        // Reverse the points effect on the user
        const pointsToReverse = transaction.amount;
        const user = transaction.user;

        await prisma.$transaction(async (tx: typeof prisma) => {            // Reverse the points based on the transaction type
            let pointsUpdate = user.points;
            if (transaction.type === "EARNED" || transaction.type === "ADMIN_ADDED") {
                pointsUpdate = Math.max(0, user.points - pointsToReverse);
            } else if (transaction.type === "EXPIRED" || transaction.type === "ADJUSTMENT") {
                pointsUpdate = user.points + pointsToReverse;
            }

            // Update user points
            await tx.user.update({
                where: { id: user.id },
                data: { points: pointsUpdate },
            });

            // Delete the transaction
            await tx.pointTransaction.delete({
                where: { id: transactionId },
            });
        });

        return {
            message: "Point transaction deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting point transaction:", error);
        throw error;
    }
};