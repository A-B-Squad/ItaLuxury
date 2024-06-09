import { updatePackage } from "./updatePackage";
import { exchangePackage } from "./manageExchangedPackage";
import { cancalPackage } from "./manageCancaledPackage";
import { cancalPackageProduct } from "./manageCancledProduct";
import { exchangePackageProduct } from "./manageExchangePackageProduct";
import { payedPackage } from "./payedPackage";
export const packageMutations = {
  updatePackage,
  exchangePackage,
  exchangePackageProduct,
  cancalPackage,
  cancalPackageProduct,payedPackage
};
