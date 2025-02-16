import { updatePackage } from "./updatePackage";
import { cancelPackage } from "./CancelPackage";
import { cancalPackageProduct } from "./manageCancledProduct";
import { payedOrConfirmedOrInTransitPackage } from "./payedOrConfirmedOrInTransitPackage";
import { refundPackage } from "./RefundPackage";
import { createPackageComments } from "./createPackageComments";
import { updateStatusPayOnlinePackage } from "./updateStatusPayOnlinePackage";
export const packageMutations = {
  updatePackage,
  cancelPackage,
  cancalPackageProduct,
  payedOrConfirmedOrInTransitPackage,
  refundPackage,
  createPackageComments,
  updateStatusPayOnlinePackage,
};
  