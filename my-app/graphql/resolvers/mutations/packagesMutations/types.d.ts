interface UpdatePackageInput {
  packageId: string
  status: enum
}
interface CancalPackageInput {
  packageId: string
  status: enum
}
interface managePackageInput {
  packageId:string
  productId: string
  cause: enum
  description: string
}
interface cancalPackageInput {
  packageId:string!
  cause: enum!
  description: string!
}
