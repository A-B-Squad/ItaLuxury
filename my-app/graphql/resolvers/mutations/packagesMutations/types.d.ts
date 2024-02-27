interface UpdatePackageInput {
  packageId: string;
  status: enum;
}
interface CancalPackageProductInput {
  packageId: string!;
  cause: enum!;
  description: string!;
  productId: string!;
  productQuantity:number!;
}
interface manageExchangePackageInput {
  packageId: string;
  cause: enum;
  description: string;
}
interface manageExchangePackageProductInput {
  packageId: string;
  productId: string;
  cause: enum;
  description: string;
  productQuantity: number;
}
interface cancalPackageInput {
  packageId: string!;
  cause: enum!;
  description: string!;
}
