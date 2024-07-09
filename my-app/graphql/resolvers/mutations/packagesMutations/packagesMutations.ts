import { updatePackage } from "./updatePackage";
import { exchangePackage } from "./manageExchangedPackage";
import { cancelPackage } from "./CancelPackage";
import { cancalPackageProduct } from "./manageCancledProduct";
import { exchangePackageProduct } from "./manageExchangePackageProduct";
import { payedOrToDeliveryPackage } from "./payedOrToDeliveryPackage";
import { refundPackage } from "./RefundPackage";
export const packageMutations = {
  updatePackage,
  exchangePackage,
  exchangePackageProduct,
  cancelPackage,
  cancalPackageProduct,payedOrToDeliveryPackage,refundPackage
};
