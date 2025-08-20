export const typeDefs = `#graphql 
# Enumerations
enum Role {
  USER
  ADMIN
  MODERATOR
}

enum PaymentMethod {
  CREDIT_CARD
  CASH_ON_DELIVERY
}

enum Status {
  REFUNDED
  BACK
  CANCELLED
  CONFIRMED
  TRANSFER_TO_DELIVERY_COMPANY
  PROCESSING
  PAYMENT_REFUSED
  PAYED_AND_DELIVERED
  PAYED_NOT_DELIVERED
}

enum Cause {
  BROKEN
  CANCEL
  REFUND
}

enum PointType {
  EARNED
  EXPIRED
  ADJUSTMENT
  ADMIN_ADDED
}

# User-related types
type User {
  id: ID!
  fullName: String!
  email: String!
  role: Role!
  number: String!
  points: Int!
  baskets: [Basket!]!
  reviews: [Review!]!
  checkout: [Checkout!]!
  favoriteProducts: [FavoriteProducts!]!
  ContactUs: [ContactUs!]!
  pointTransactions: [PointTransaction!]
  Voucher: [Voucher!]
}

type Admin {
  id: ID!
  fullName: String!
  email: String
  role: Role!
  number: String
}

type AuthPayload {
  token: String!
  userId: ID!
}

# Category-related types
type Category {
  id: ID!
  name: String!
  parentId: String
  parent: Category
  products: [Product!]!
  subcategories: [Category!]!
  bigImage: String
  smallImage: String
  description: String
  BestSales: [BestSales!]!
}

type MainCategory {
  id: ID!
  name: String!
  parentId: String
  description: String
  bigImage: String
  smallImage: String
  subcategories: [Category!]!
}

# Product-related types
type Product {
  id: ID!
  name: String
  price: Float
  purchasePrice: Float
  isVisible: Boolean
  reference: String
  description: String
  technicalDetails: String
  inventory: Int
  solde: Int
  broken: Int
  images: [String]
  categories: [Category]
  productDiscounts: [ProductDiscount]
  baskets: [Basket]
  reviews: [Review]
  favoriteProducts: [FavoriteProducts]
  ProductInCheckout: [ProductInCheckout]
  Colors: Colors
  colorsId: String
  TopDeals: TopDeals
  BestSales: [BestSales]
  Brand: Brand
  brandId: String
  BreakedProduct: [BreakedProduct]
  createdAt: String
  updatedAt: String
  groupProductVariantId:ID
  GroupProductVariant:GroupProductVariant
}
type GroupProductVariant{
  id:ID!
  groupProductName:String!
  Products: [Product]  
}

type BestSales {
  id: ID!
  Category: Category
  categoryId: String
  Product: Product
  productId: String
}

type Colors {
  id: ID!
  color: String!
  Hex: String!
  Product: [Product!]!
}

type TopDeals {
  id: ID!
  product: Product
  productId: String
}

type Brand {
  id: ID!
  name: String!
  logo: String!
  product: [Product!]!
}

type ProductDiscount {
  id: ID!
  product: Product
  productId: String
  price: Float!
  newPrice: Float!
  dateOfStart: String!
  dateOfEnd: String!
}

type BreakedProduct {
  id: ID!
  cause: String!
  createdAt: String!
  quantity: Int!
  Product: Product
  productId: String!
}

# Shopping-related types
type Basket {
  id: ID!
  User: User
  userId: String
  quantity: Int!
  Product: Product
  productId: String!
}

type Checkout {
  id: ID!
  userName: String!
  User: User
  userId: String
  Governorate: Governorate
  governorateId: String
  productInCheckout: [ProductInCheckout!]!
  manualDiscount: Float!
  phone: [String!]!
  address: String!
  package: [Package!]!
  total: Float!
  pointsEarned: Int!
  pointsUsed: Int!
  createdAt: String!
  Coupons: Coupon
  couponsId: String
  freeDelivery: Boolean!
  isGuest: Boolean!
  guestEmail: String
  deliveryComment: String
  paymentMethod: PaymentMethod!
  pointTransactions: [PointTransaction!]!
  Voucher: [Voucher!]!
}

type CreateCheckoutOutput {
  customId: String!
  orderId: String!
}

type ProductInCheckout {
  id: ID!
  checkout: Checkout!
  checkoutId: String!
  product: Product!
  productId: String!
  productQuantity: Int!
  price: Float!
  discountedPrice: Float!
}

type ApiCredentials {
  id: ID!
  api_id: String!
  access_token: String!
  createdAt: String!
  integrationFor: String!
  domainVerification: String
}

type Package {
  id: ID!
  customId: String!
  Checkout: Checkout!
  checkoutId: String!
  status: Status!
  createdAt: String!
  delivredAt: String
  inTransitAt: String
  isConfirmedAt: String
  returnedAt: String
  comments: [String!]!
  deliveryReference: String
}

type Review {
  id: ID!
  rating: Float!
  comment: String
  userName: String
  userId: String
  user: User
  product: Product
  productId: String
  createdAt: String!
}

type FavoriteProducts {
  id: ID!
  userId: String
  User: User
  productId: String
  Product: Product
}

type Advertisement {
  id: ID!
  images: [String!]!
  position: String!
  link: String
}

type Governorate {
  id: ID!
  name: String!
  checkout: [Checkout!]!
}

type CompanyInfo {
  id: ID!
  phone: [String!]!
  deliveringPrice: Int!
  logo: String!
  instagram: String!
  facebook: String!
  location: String!
  email: String!
}

type content_visibility {
  id: ID!
  section: String!
  visibility_status: Boolean!
}

type ContactUs {
  id: ID!
  subject: String!
  email: String!
  document: String
  message: String!
  createdAt: String!
  User: User
  userId: String
}

type Coupon {
  id: ID!
  code: String!
  discount: Float!
  available: Boolean!
  checkout: [Checkout!]!
}

type PointTransaction {
  id: ID!
  amount: Int!
  type: PointType!
  description: String
  createdAt: String!
  user: User!
  userId: String!
  checkout: Checkout
  checkoutId: String
}

type Voucher {
  id: ID!
  code: String!
  amount: Float!
  isUsed: Boolean!
  createdAt: String!
  expiresAt: String!
  usedAt: String
  user: User!
  userId: String!
  checkout: Checkout
  checkoutId: String
}

type VoucherResponse {
  success: Boolean!
  message: String!
  voucher: Voucher!
  checkout: Checkout
}

type PointSetting {
  id: ID!
  conversionRate: Float!
  redemptionRate: Float!
  minimumPointsToUse: Int!
  loyaltyThreshold: Int!
  loyaltyRewardValue: Float!
  isActive: Boolean!
  updatedAt: String!
}

type DeletePointTransactionResponse {
  message: String!
}
type Moderator {
  id: ID!
  fullName: String!
  email: String
  phone: String
  password: String
}

type SearchProductsResult {
  results: SearchResults!
  totalCount: Int!
  pagination: PaginationInfo! 
}

type PaginationInfo {
  currentPage: Int!
  totalPages: Int!
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}

type PackagePaginationResult {
  packages: [Package!]!
  pagination: PaginationInfo!
}

type SearchResults {
  products: [Product!]!
  categories: [Category!]!
}

type PaginatedCoupons {
  coupons: [Coupon!]!
  totalCount: Int!
}

# Query type
type Query {
  # User-related queries
  fetchAllUsers: [User!]!
  fetchUsersById(userId: ID!): User!

  # Content visibility query
  getSectionVisibility(section: String!): content_visibility!
  getAllSectionVisibility: [content_visibility!]!

  # Best sales query
  getBestSells(limit: Int): [BestSales!]!

  # Coupon-related queries
  findUniqueCoupons(codeInput: String!): Coupon
  fetchAllCoupons(page: Int, pageSize: Int): PaginatedCoupons!

  # Product-related queries
  allNewProducts(limit: Int, visibleProduct: Boolean): [Product!]!
  fetchBrands: [Brand!]!
  searchProducts(input: ProductSearchInput!): SearchProductsResult!
  colors(limit: Int): [Colors!]!
  productsLessThen20(limit: Int): [Product!]!
  productsByCategory(categoryName: String!, limit: Int): [Product!]!
  productById(id: ID!): Product!
  getProductImages(productId: String!, colorId: String!): [String!]!
  getAllProductGroups: [GroupProductVariant!]

  # Category-related queries
  categories: [MainCategory!]!
  fetchMainCategories: [MainCategory!]!
  subcategoriesByParentId(parentId: ID!): [Category!]!
  categoryById(categoryId: String!): Category!

  # Basket and discount queries
  basketByUserId(userId: ID!): [Basket!]!
  fetchAllBasket: [Basket!]!
  productDiscount(productId: ID!): ProductDiscount!
  productsDiscounts(limit: Int): [Product!]!

  # Review and favorite queries
  productReview(productId: ID!, userId: ID): [Review!]!
  favoriteProducts(userId: ID!): [FavoriteProducts!]!

  # API Credentials Query
  getApiCredentials(integrationFor: String): ApiCredentials!

  # Point-related queries
  getUserPoints(userId: ID!): Int!  
  getPointSettings: PointSetting!
  getUserPointTransactions(userId: ID!, limit: Int, offset: Int): [PointTransaction!]!
  getVoucherByCode(code: String!): Voucher!

  # Voucher queries
  getUserVouchers(userId: ID!): [Voucher!]!
  validateVoucher(code: String!): Voucher

  # Other queries
  productColors(productId: ID!): Colors!
  allDeals: [TopDeals!]!
  allGovernorate: [Governorate!]!
  advertismentByPosition(position: String!): [Advertisement!]!
  packageById(packageId: ID!): Package!
  packageByUserId(userId: ID!): [Package!]!
  getAllPackages(page: Int, pageSize: Int, searchTerm: String, dateFrom: String, dateTo: String, statusFilter: [String]): PackagePaginationResult!
  companyInfo: CompanyInfo!
  allContactUs: [ContactUs!]!

  # Automatic discount deletion
  deleteAutoProductDiscount: String!
}

# Mutation type
type Mutation {
  # Advertisement mutations
  createCarouselAdvertisement(input: [advertisementInput!]!): String!
  createBannerAdvertisement(input: [advertisementInput!]!): String!
  createClientService(input: [advertisementInput!]!): String!
  createSideAdvertisement(input: [advertisementInput!]!): String!
  createLeftNextToCarouselAds(input: [advertisementInput!]!): String!
  createBigAds(input: advertisementInput!): String!

  # Password-related mutations
  forgotPassword(email: String!): String!
  resetPassword(password: String!, id: String!): String!

  # Section visibility mutation
  updateSectionVisibility(section: String!, visibilityStatus: Boolean!): String!
  
  # Best Sells mutation
  addBestSells(categoryId: String, productId: String!): String!
  deleteProductBestSells(productId: String!): String!
  
  # User-related mutations
  signUp(input: SignUpInput!): AuthPayload!
  signIn(input: SignInInput!): AuthPayload!
  refreshToken(Token: String!): String!

  # Product-related mutations
  createProduct(input: ProductInput!): String!
  updateProduct(productId: ID!, input: ProductInput!): String!
  deleteProduct(productId: ID!): String!
  createGroupProductVariant(input: CreateGroupProductVariantInput!): GroupProductVariant!
  updateGroupProductVariant(input: UpdateGroupProductVariantInput!): String!
  deleteGroupProductVariant(id: ID!): String!
  AddReview(input: AddReviewInput!): String!
  deleteReview(reviewId: ID!): Boolean!
  addProductInventory(productId: ID!, inventory: Int!): String!
  undoSellProduct(productId: ID!, quantityReturned: Int!): Product!
  sellProduct(productId: ID!, quantitySold: Int!): Product!

  # Product discount mutation
  deleteProductDiscount(productId: ID!): String!

  # Basket-related mutations
  addToBasket(input: CreateToBasketInput!): Basket!
  removeProductFromBasket(productId: ID!, basketId: String!): String!
  deleteBasketById(basketId: ID!): String!
  increaseQuantity(basketId: ID!): Basket!
  decreaseQuantity(basketId: ID!): Basket!
  addMultipleToBasket(input: AddMultipleToBasketInput!): String!

  # Checkout-related mutations
  createCheckout(input: CreateCheckoutInput!): CreateCheckoutOutput!
  createCheckoutFromAdmin(input: CreateCheckoutFromAdminInput!): String!
  updateCheckout(input: UpdateCheckoutInput!): String!
  updateCustomerCheckout(input: UpdateCustomerCheckoutInput!): String!

  # Package-related mutations
  updatePackage(input: UpdatePackageInput!): String!
  cancelPackage(input: CancelPackageInput!): String!
  refundPackage(input: RefundPackageInput!): String!
  cancalPackageProduct(input: CancelProductPackageInput!): String!
  payedOrConfirmedOrInTransitPackage(packageId: ID!, paymentMethod: PaymentMethod!, status: String!, deliveryReference: String): String!
  createPackageComments(packageId: ID!, comment: [String!]!): String!
  updateStatusPayOnlinePackage(packageId: ID!, paymentStatus: Status!): String!

  # Category-related mutations
  createCategory(input: CreateCategoryInput!): String!
  updateCategory(id: ID!, input: UpdateCategoryInput!): String!
  deleteCategory(id: ID!): String!

  # Favorite product mutation
  addDeleteProductToFavorite(input: AddDeleteProductToFavoriteInput!): FavoriteProducts!

  # Company info mutation
  createOrUpdateCompanyInfo(input: CompanyInfoInput!): CompanyInfo!

  # Top deals mutations
  addProductToTopDeals(productId: String!): String!
  deleteTopDeals(productId: String!): String!

  # Admin/Moderator mutations
  adminSignIn(input: AdminSignInInput!): String!
  createModerator(adminId: ID!, input: CreateModeratorInput!): String!
  
  # API Credentials mutation
  addApiCredentials(input: CreateApiCredentialsInput!): String!
  deleteApiCredentials(id: ID!): String!

  # Contact us mutation
  createContactUs(input: ContactUsInput!): String!

  # Coupon-related mutations
  deleteCoupons(couponsIds: [ID!]!): String!
  createCoupons(input: CreateCouponInput!): String!

  # Color mutations
  addColor(color: String!, Hex: String!): String!
  deleteColor(Hex: String!): String!

  # Brand Mutations
  addBrand(name: String!, logo: String!): String!
  deleteBrand(brandId: ID!): String!

  # Point-related mutations
  createPointTransaction(input: PointTransactionInput!): PointTransaction!
  addPointsToUser(userId: ID!, points: Int!, PointType: PointType!, description: String): String
  updatePointSettings(input: PointSettingsInput!): PointSetting!
  generateVoucher(input: GenerateVoucherInput!): Voucher!
  useVoucher(input: UseVoucherInput!): VoucherResponse!
  resetUserPoints(input: ResetPointsInput!): User!
  deletePointTransaction(transactionId: String!): DeletePointTransactionResponse!
}

# Input types
input SignUpInput {
  fullName: String!
  email: String!
  password: String!
  number: String!
}

input SignInInput {
  emailOrPhone: String!
  password: String!
}

input ProductInput {
  name: String!
  price: Float!
  purchasePrice: Float!
  isVisible: Boolean!
  reference: String!
  description: String!
  technicalDetails: String
  inventory: Int!
  images: [String!]!
  categories: [ID!]!
  discount: [CreateProductDiscountInput!]
  colorsId: ID
  brandId: ID
  groupProductVariantId:ID
}
input CreateGroupProductVariantInput {
  groupProductName: String!
}

input UpdateGroupProductVariantInput {
  id: ID!
  groupProductName: String
}
input AddReviewInput {
  productId: ID!
  userId: ID
  rating: Int!
  comment: String
  userName: String
}

input UpdateCheckoutInput {
  orderStatus: String
  checkoutId: ID!
  total: Float!
  manualDiscount: Float
  couponsId: ID
  productInCheckout: [ProductInCheckoutUpdateInput!]!
  freeDelivery: Boolean
}

input UpdateCustomerCheckoutInput {
  checkoutId: ID!
  userName: String!
  userId: String
  governorateId: String!
  phone: [String!]!
  address: String!
}

input ProductInCheckoutUpdateInput {
  productId: String!
  productQuantity: Int!
  price: Float!
  discountedPrice: Float!
}

input ProductInCheckoutInput {
  productId: ID!
  productQuantity: Int!
  price: Float!
  discountedPrice: Float
}

input CreateCategoryInput {
  name: String!
  parentId: ID
  bigImage: String
  smallImage: String
  description: String
}

input UpdateCategoryInput {
  name: String
  parentId: ID
  description: String
  smallImage: String
  bigImage: String
}

input CancelPackageInput {
  packageId: String!
  cause: Cause
  brokenProducts: [BrokenProduct!]
}

input RefundPackageInput {
  packageId: String!
  cause: Cause
  brokenProducts: [BrokenProduct!]
}

input BrokenProduct {
  productId: String!
  quantity: Int!
}

input CancelProductPackageInput {
  packageId: ID!
  cause: Cause!
  description: String
  productId: ID!
  productQuantity: Int!
}

input AddDeleteProductToFavoriteInput {
  userId: ID!
  productId: ID!
}

input CreateApiCredentialsInput {
  api_id: String!
  access_token: String!
  integrationFor: String!
  domainVerification: String
}

input CreateProductDiscountInput {
  dateOfStart: String!
  dateOfEnd: String!
  newPrice: Float!
}

input CreateToBasketInput {
  userId: ID!
  productId: ID!
  quantity: Int!
}

input CreateCheckoutInput {
  userId: ID
  governorateId: ID!
  userName: String!
  products: [ProductInCheckoutInput!]!
  phone: [String!]!
  address: String!
  total: Float!
  couponsId: String
  freeDelivery: Boolean!
  isGuest: Boolean!
  guestEmail: String
  deliveryComment: String
  paymentMethod: PaymentMethod!
}

input CreateCheckoutFromAdminInput {
  userId: ID
  governorateId: ID!
  userName: String!
  products: [ProductInCheckoutFromAdminInput!]!
  phone: [String!]!
  address: String!
  total: Float!
  manualDiscount: Float
  freeDelivery: Boolean
}

input ProductInCheckoutFromAdminInput {
  productId: ID!
  productQuantity: Int!
  price: Float!
  discountedPrice: Float
}

input UpdatePackageInput {
  packageId: ID!
  status: Status!
}

input CreateTopDealsInput {
  productId: ID!
}

input CompanyInfoInput {
  phone: [String!]!
  deliveringPrice: Int!
  logo: String!
  instagram: String!
  facebook: String!
  location: String!
  email: String!
}

input CreateModeratorInput {
  fullName: String!
  password: String!
}

input AdminSignInInput {
  fullName: String!
  password: String!
  role: Role!
}

input ExchangePackageProductInput {
  packageId: String!
  productId: String!
  cause: Cause!
  description: String
  productQuantity: Int!
}

input ExchangePackageInput {
  packageId: String!
  cause: Cause!
  description: String
}

input AddMultipleToBasketInput {
  userId: ID!
  products: [ProductInputQuantity!]!
}

input ProductInputQuantity {
  productId: ID!
  quantity: Int!
}

input ProductSearchInput {
  query: String
  minPrice: Float
  maxPrice: Float
  categoryName: String
  colorName: String
  page: Int!
  pageSize: Int
  choice: String
  brandName: String
  visibleProduct: Boolean
  sortBy: String 
  sortOrder: String 
}

input ContactUsInput {
  userId: String
  subject: String!
  email: String!
  message: String!
  document: String
}

input advertisementInput {
  images: [String!]!
  position: String!
  link: String
}

input CreateCouponInput {
  code: String!
  discount: Float!
}

input PointSettingsInput {
  conversionRate: Float
  redemptionRate: Float
  minimumPointsToUse: Int
  loyaltyThreshold: Int
  loyaltyRewardValue: Float
  isActive: Boolean
}
input PointTransactionInput {
  userId: ID!
  amount: Int! 
  type: PointType! 
  description: String
}
input addPointsToUserInput {
  userId: String!
  amount: Int!
  type: PointType!
  description: String
  checkoutId: String
}


input GenerateVoucherInput {
  userId: String!
  amount: Float!
  expiresAt: String!
}

input UseVoucherInput {
  voucherCode: String!
  checkoutId: String
  isInStore: Boolean
  amountUsed: Float
  expiresAt: String!
}




input ResetPointsInput {
  userId: String!
  reason: String
}



`