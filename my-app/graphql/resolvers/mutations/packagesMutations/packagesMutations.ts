import { updatePackage } from "./updatePackage";
import { cancelPackage } from "./CancelPackage";
import { payedOrConfirmedOrInTransitPackage } from "./payedOrConfirmedOrInTransitPackage";
import { refundPackage } from "./RefundPackage";
import { createPackageComments } from "./createPackageComments";
import { updateStatusPayOnlinePackage } from "./updateStatusPayOnlinePackage";
export const packageMutations = {
  updatePackage,
  cancelPackage,
  payedOrConfirmedOrInTransitPackage,
  refundPackage,
  createPackageComments,
  updateStatusPayOnlinePackage,
};
  