import { Context } from "@/pages/api/graphql";

export const updateSectionVisibility = async (
  _: any,
  { section, visibilityStatus }: { section: string; visibilityStatus: boolean },
  { prisma }: Context
): Promise<any> => {
  try {
    await prisma.content_visibility.updateMany({
      where: { section },
      data: { visibility_status: visibilityStatus },
    });

    return " Section updated ";
  } catch (error) {
    console.error("Failed to update section visibility", error);
    throw new Error("Failed to update section visibility");
  }
};
