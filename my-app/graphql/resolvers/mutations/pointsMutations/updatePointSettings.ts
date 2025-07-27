import { Context } from "@/pages/api/graphql";

interface PointSettingsInput {
  conversionRate?: number;
  redemptionRate?: number;
  minimumPointsToUse?: number;
  loyaltyThreshold?: number;
  loyaltyRewardValue?: number;
  isActive?: boolean;
}

export const updatePointSettings = async (
  _: any,
  { input }: { input: PointSettingsInput },
  { prisma }: Context
) => {
  try {
    // Get the first point settings record or create one if it doesn't exist
    const existingSettings = await prisma.pointSetting.findFirst();

    if (existingSettings) {
      // Update existing settings
      const updatedSettings = await prisma.pointSetting.update({
        where: { id: existingSettings.id },
        data: input,
      });
      return updatedSettings;
    } else {
      // Create new settings if none exist
      const newSettings = await prisma.pointSetting.create({
        data: input,
      });

      return newSettings;
    }
  } catch (error) {
    console.error("Error updating point settings:", error);
    throw error;
  }
};