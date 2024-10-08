import { Context } from "@/pages/api/graphql";

interface AdvertisementInput {
  id: string;
  images: string[];
  position: string;
  link: string | null;
}

interface AdvertisementData {
  link: string | null;
  position: string;
}

export const createLeftNextToCarouselAds = async (
  _: any,
  { input }: { input: AdvertisementInput[] },
  { prisma }: Context
) => {
  try {
    // 1. Fetch all existing data from the database
    const filteredInput = input.filter((item) =>
      item.position !== '' &&
      item.images.length > 0
    );

    const existingData = await prisma.advertisement.findMany({
      where: {
        position: "NextToCarouselAds"
      }
    });

    // 2. Compare input data with existing data
    const newDataIds: AdvertisementData[] = filteredInput.map((item) => ({ link: item.link, position: item.position }));
    const existingDataIds: AdvertisementData[] = existingData.map((item) => ({ link: item.link, position: item.position }));

    // 3. Update existing data with input data
    for (const item of filteredInput) {
      if (existingDataIds.some((existingItem) => existingItem.link === item.link && existingItem.position === item.position)) {
        await prisma.advertisement.updateMany({
          where: { link: item.link, position: item.position },
          data: item
        });
      } else {
        // 4. Create new data if it doesn't exist in the database
        await prisma.advertisement.create({
          data: item
        });
      }
    }

    // 5. Delete data from the database that is not included in the input
    for (const item of existingData) {
      if (!newDataIds.some((newItem) => newItem.link === item.link && newItem.position === item.position)) {
        await prisma.advertisement.deleteMany({
          where: { link: item.link, position: item.position },
        });
      }
    }

    // Return success message
    return "Advertisement data updated successfully"
  } catch (error) {
    // Handle errors
    console.error("Error creating/updating advertisement data:", error);
    throw new Error("Failed to create/update advertisement data");
  }
};