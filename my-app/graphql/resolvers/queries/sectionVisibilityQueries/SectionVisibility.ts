import { Context } from "@/pages/api/graphql";

export const getSectionVisibility = async (
  _: any,
  { section }: any,
  { prisma }: Context
): Promise<any> => {
  try {
    const sectionVisibility = await prisma.content_visibility.findFirst({
      where: {section},
    });

    if (!sectionVisibility) {
      throw new Error(`Sections${section}  not found`);
    }

    return sectionVisibility;
  } catch (error) {
    console.error("Failed to fetch section visibility", error);
    throw new Error("Failed to fetch section visibility");
  }
};
