import { Context } from "@/pages/api/graphql";

export const fetchAllUsers = async (_: any, __: any, { prisma }: Context) => {
    try {

        const users = await prisma.user.findMany({
            include: {

                checkout: {
                    include: {
                        package: true,
                        Governorate: true,
                        Coupons: true,
                        products: true
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
