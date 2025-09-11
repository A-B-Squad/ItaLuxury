import { Context } from "@apollo/client";

export const getPointSettings = async (
  _: any,
  __: any,
  { prisma }: Context
) => {
  try {
    console.log("Fetching point settings...");

    let settings = await prisma.pointSetting.findFirst();

    // Si aucun paramètre n'existe, en créer un avec les valeurs par défaut
    if (!settings) {
      settings = await prisma.pointSetting.create({
        data: {} // Les valeurs par défaut sont supposées définies dans le schéma Prisma
      });
    }

    return settings;
  } catch (error) {
    console.error("Error fetching point settings:", error);
    throw new Error("Erreur lors de la récupération des paramètres de points.");
  }
};
