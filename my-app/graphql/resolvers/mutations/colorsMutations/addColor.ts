import { Context } from "@/pages/api/graphql";

export const addColor = async (
  _: any,
  { color, Hex }:any,
  { prisma }: Context
) => {
  console.log(Hex);
  
  try {
    await prisma.colors.create({
      data: {
        color,
        Hex,
      },
    });
    return "Color added successfully";
  } catch (error) {
    return `An unexpected error occurred ${error}`;
  }
};
