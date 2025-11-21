import { getActiveCampaigns } from "./getActiveCampaigns";
import { getAllCampaigns } from "./getAllCampaigns";
import { getCampaignStats } from "./getCampaignStats";
import { getDiscountHistory } from "./getDiscountHistory";


export const discountQueries = {
    getActiveCampaigns, getCampaignStats,
    getDiscountHistory,getAllCampaigns
};
