import { Context } from "@apollo/client";

export const toggleBundleStatus = async (
  _: any,
  { id, status }: { id: string; status: 'ACTIVE' | 'INACTIVE' },
  { prisma }: Context
) => {
  try {
    const bundle = await prisma.bundle.update({
      where: { id },
      data: { status },
    });

    return bundle;
  } catch (error) {
    throw new Error("Failed to update bundle status");
  }
};