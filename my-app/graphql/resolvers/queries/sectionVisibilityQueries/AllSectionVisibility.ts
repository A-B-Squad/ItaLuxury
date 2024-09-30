import { Context } from "@/pages/api/graphql";

export const getAllSectionVisibility = async (
  _: any,
  __: any,
  { prisma }: Context
): Promise<any> => {
  try {
    const sectionVisibility = await prisma.content_visibility.findMany();

    if (!sectionVisibility) {
      throw new Error(`Sections  not found`);
    }

    return sectionVisibility;
  } catch (error) {
    console.error("Failed to fetch section visibility", error);
    throw new Error("Failed to fetch section visibility");
  }
};
