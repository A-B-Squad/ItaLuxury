import { updatePackage } from "./updatePackage";
import { cancelPackage } from "./CancelPackage";
import { cancalPackageProduct } from "./manageCancledProduct";
import { payedOrToDeliveryPackage } from "./payedOrToDeliveryPackage";
import { refundPackage } from "./RefundPackage";
import { createPackageComments } from "./createPackageComments";
import { updateStatusPayOnlinePackage } from "./updateStatusPayOnlinePackage";
export const packageMutations = {
  updatePackage,
  cancelPackage,
  cancalPackageProduct,
  payedOrToDeliveryPackage,
  refundPackage,
  createPackageComments,
  updateStatusPayOnlinePackage,
};
