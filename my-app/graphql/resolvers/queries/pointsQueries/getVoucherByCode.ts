import { Context } from "@/pages/api/graphql";

export const getVoucherByCode = async (
  _: any,
  { code }: { code: string },
  { prisma }: Context
) => {
  try {
    const voucher = await prisma.voucher.findUnique({
      where: { code },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        checkout: {
          select: {
            id: true,
            createdAt: true
          }
        }
      }
    });

    if (!voucher) {
      throw new Error(`Voucher with code ${code} not found`);
    }

    return voucher;
  } catch (error) {
    console.error("Error fetching voucher by code:", error);
    throw error;
  }
};