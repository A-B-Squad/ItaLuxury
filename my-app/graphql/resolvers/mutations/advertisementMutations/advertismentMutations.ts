import { createBannerAdvertisement } from "./createBannerAds";
import { createBigAds } from "./createBigAds";
import { createCarouselAdvertisement } from "./createCarouselAds";
import { createLeftNextToCarouselAds } from "./createLeftNextToCarouselAds";
import { createSideAdvertisement } from "./createSideAds";

export const advertismentMutations = {
    createCarouselAdvertisement,
    createBannerAdvertisement,
    createSideAdvertisement, createBigAds, createLeftNextToCarouselAds
}