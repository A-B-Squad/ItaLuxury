import { Context } from "@/pages/api/graphql";

export const fetchUsersById = async (_: any, { userId }: { userId: string }, { prisma }: Context) => {
    try {

        const users = await prisma.user.findUnique(
            {
                where: {
                    id: userId
                }
                ,
                include: {
                    checkout: {
                        include: {
                            package: true,
                            Governorate: true,
                            Coupons: true,
                            productInCheckout:true
                        }
                    }
                },
            });
        return users;
    } catch (error) {
        console.log('Failed to fetch users', error);
        return (error);
    }
};
