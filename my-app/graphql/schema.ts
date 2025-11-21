export const typeDefs = `#graphql 
# ============================================================================
# SCALAR TYPES
# ============================================================================

scalar JSON

# ============================================================================
# ENUMERATIONS
# ============================================================================

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

enum DiscountType {
  PERCENTAGE
  FIXED_AMOUNT
}

enum CampaignType {
  MANUAL
  PROMOTIONAL_CAMPAIGN 
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

# ============================================================================
# USER & AUTHENTICATION TYPES
# ============================================================================

type User {
  id: ID!
  fullName: String!
  email: String!
  role: Role!
  number: String!
  points: Int!
  createdAt: String!
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
  discountCampaigns: [DiscountCampaign!]!
  productDiscounts: [ProductDiscount!]!
}

type Moderator {
  id: ID!
  fullName: String!
  email: String
  phone: String
  password: String
}

type AuthPayload {
  token: String!
  userId: ID!
}

# ============================================================================
# CATEGORY TYPES
# ============================================================================

type Category {
  id: ID!
  order: Int!
  name: String!
  parentId: String
  parent: Category
  products: [Product!]!
  subcategories: [Category!]
  bigImage: String
  smallImage: String
  description: String
  BestSales: [BestSales!]!
}

type MainCategory {
  id: ID!
  name: String!
  order: Int!
  parentId: String
  description: String
  bigImage: String
  smallImage: String
  subcategories: [Category!]!
}

# ============================================================================
# PRODUCT TYPES
# ============================================================================

type Product {
  id: ID!
  name: String!
  slug: String
  price: Float!
  purchasePrice: Float!
  isVisible: Boolean!
  reference: String!
  description: String!
  technicalDetails: String
  inventory: Int!
  solde: Int!
  broken: Int!
  images: [String!]!
  categories: [Category!]!
  productDiscounts: [ProductDiscount!]!
  baskets: [Basket!]!
  reviews: [Review!]!
  favoriteProducts: [FavoriteProducts!]!
  ProductInCheckout: [ProductInCheckout!]!
  searchKeywords: String!
  Colors: Colors
  colorsId: String
  TopDeals: TopDeals
  BestSales: [BestSales!]!
  Brand: Brand
  brandId: String
  BreakedProduct: [BreakedProduct!]!
  createdAt: String!
  updatedAt: String
  groupProductVariantId: String
  GroupProductVariant: GroupProductVariant
}

type GroupProductVariant {
  id: ID!
  groupProductName: String!
  Products: [Product!]!
}

type Colors {
  id: ID!
  color: String!
  Hex: String!
  Product: [Product!]!
}

type Brand {
  id: ID!
  name: String!
  logo: String!
  product: [Product!]!
}

type BreakedProduct {
  id: ID!
  cause: String!
  createdAt: String!
  quantity: Int!
  Product: Product
  productId: String!
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

type GoogleProduct {
  id: ID!
  title: String!
  description: String
  link: String!
  image_link: String
  additional_image_link: String
  price: String!
  sale_price: String
  availability: String!
  brand: String
  gtin: String
  mpn: String
  condition: String!
  product_type: String
  google_product_category: String
  color: String
  item_group_id: String
  inventory: Int
  createdAt: String
  updatedAt: String
}

# ============================================================================
# DISCOUNT & CAMPAIGN TYPES
# ============================================================================

type DiscountCampaign {
  id: ID!
  name: String!
  description: String
  type: CampaignType!
  dateStart: String!
  dateEnd: String!
  isActive: Boolean!
  conditions: JSON
  productsAffected: Int!
  totalRevenue: Float!
  createdAt: String!
  updatedAt: String!
  createdBy: Admin
  createdById: String
}

type ProductDiscount {
  id: ID!
  product: Product!
  productId: String!
  price: Float!
  newPrice: Float!
  discountType: DiscountType!
  discountValue: Float!
  campaignName: String
  campaignType: CampaignType!
  dateOfStart: String!
  dateOfEnd: String!
  isActive: Boolean!
  isDeleted: Boolean!
  createdAt: String!
  updatedAt: String!
  createdBy: Admin
  createdById: String
}

type AddPromotionalCampaignResponse {
  success: Boolean!
  message: String!
  affectedProducts: Int!
  campaignId: String
}

type RemovePromotionalCampaignsResponse {
  success: Boolean!
  message: String!
  removedCount: Int!
}

type ReactivateCampaignResult {
  success: Boolean!
  message: String!
  reactivatedCount: Int
  warning: String
}

# ============================================================================
# SHOPPING & CHECKOUT TYPES
# ============================================================================

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
  pointsEarned: Int
  pointsUsed: Int
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

type CheckoutInfo {
  userId: String
  userName: String
  phone: [String]  
  total: Float
  freeDelivery: Boolean
  paymentMethod: String
}

type CheckoutExportInfo {
  userId: String
  userName: String
  phone: [String!]!
  total: Float
  freeDelivery: Boolean
  paymentMethod: PaymentMethod
}

# ============================================================================
# PACKAGE & DELIVERY TYPES
# ============================================================================

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

type PackagePaginationResult {
  packages: [Package!]!
  pagination: PaginationInfo!
}

type PackageExportResult {
  packages: [ExportPackage!]!
  pagination: PaginationInfo!
}

type ExportPackage {
  id: ID!
  customId: String
  createdAt: String!
  status: Status!
  Checkout: CheckoutExportInfo
}

type Governorate {
  id: ID!
  name: String!
  checkout: [Checkout!]!
}

# ============================================================================
# COUPON & LOYALTY TYPES
# ============================================================================

type Coupon {
  id: ID!
  code: String!
  discount: Float!
  available: Boolean!
  checkout: [Checkout!]!
}

type PaginatedCoupons {
  coupons: [Coupon!]!
  totalCount: Int!
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

# ============================================================================
# FEATURED & PROMOTIONAL TYPES
# ============================================================================

type BestSales {
  id: ID!
  Category: Category
  categoryId: String
  Product: Product
  productId: String
}

type TopDeals {
  id: ID!
  product: Product
  productId: String
}

type Advertisement {
  id: ID!
  images: [String!]!
  position: String!
  link: String
}

# ============================================================================
# SEARCH & PAGINATION TYPES
# ============================================================================

type SearchProductsResult {
  results: SearchResults!
  totalCount: Int!
  pagination: PaginationInfo! 
}

type SearchResults {
  products: [Product!]!
  categories: [Category!]!
}

type PaginationInfo {
  currentPage: Int!
  totalPages: Int!
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}

# ============================================================================
# SYSTEM & CONFIGURATION TYPES
# ============================================================================

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

type ApiCredentials {
  id: ID!
  api_id: String!
  access_token: String!
  createdAt: String!
  integrationFor: String!
  domainVerification: String
}

# ============================================================================
# QUERIES
# ============================================================================

type Query {
  # User Queries
  fetchAllUsers: [User!]!
  fetchUsersById(userId: ID!): User!

  # Product Queries
  allNewProducts(limit: Int, visibleProduct: Boolean): [Product!]!
  searchProducts(input: ProductSearchInput!): SearchProductsResult!
  productsLessThen20(limit: Int): [Product!]!
  productsByCategory(categoryName: String!, limit: Int): [Product!]!
  getProductBySlug(slug: String!): Product!
  getProductImages(productId: String!, colorId: String!): [String!]!
  productsDiscounts(limit: Int): [Product!]!
  productColors(productId: ID!): Colors!
  getAllProductGroups: [GroupProductVariant!]!
  getAllProductsForGoogleFeed: [GoogleProduct!]!

  # Category Queries
  fetchMainCategories: [MainCategory!]!
  categoryById(categoryId: String!): Category!

  # Brand & Color Queries
  fetchBrands: [Brand!]!
  colors(limit: Int): [Colors!]!

  # Review & Favorite Queries
  productReview(productId: ID!, userId: ID): [Review!]!
  favoriteProducts(userId: ID!): [FavoriteProducts!]!

  # Basket Queries
  basketByUserId(userId: ID!): [Basket!]!
  fetchAllBasket: [Basket!]!

  # Checkout & Package Queries
  packageById(packageId: ID!): Package
  packageByUserId(userId: ID!): [Package!]!
  getAllPackages(page: Int, pageSize: Int, searchTerm: String, dateFrom: String, dateTo: String, statusFilter: [String]): PackagePaginationResult!
  GetAllPackagesForExport(searchTerm: String, dateFrom: String, dateTo: String, statusFilter: [String]): PackageExportResult!

  # Discount & Campaign Queries
  getActiveCampaigns: [DiscountCampaign!]!
  getAllCampaigns: [DiscountCampaign!]!
  getDiscountHistory(productName: String!): [ProductDiscount!]!
  getCampaignStats(campaignId: String!): DiscountCampaign
  deleteAutoProductDiscount: String!

  # Coupon Queries
  findUniqueCoupons(codeInput: String!): Coupon
  fetchAllCoupons(page: Int, pageSize: Int): PaginatedCoupons!

  # Loyalty & Points Queries
  getUserPoints(userId: ID!): Int!  
  getPointSettings: PointSetting!
  getUserPointTransactions(userId: ID!, limit: Int, offset: Int): [PointTransaction!]!
  getUserVouchers(userId: ID!): [Voucher!]!
  getVoucherByCode(code: String!): Voucher!
  validateVoucher(code: String!): Voucher

  # Featured Product Queries
  getBestSells: [BestSales!]!
  allDeals: [TopDeals!]!

  # System Queries
  companyInfo: CompanyInfo!
  allGovernorate: [Governorate!]!
  advertismentByPosition(position: String!): [Advertisement!]!
  getSectionVisibility(section: String!): content_visibility!
  getAllSectionVisibility: [content_visibility!]!
  allContactUs: [ContactUs!]!
  getApiCredentials(integrationFor: String): ApiCredentials!
}

# ============================================================================
# MUTATIONS
# ============================================================================

type Mutation {
  # User & Authentication Mutations
  signUp(input: SignUpInput!): AuthPayload!
  signIn(input: SignInInput!): AuthPayload!
  refreshToken(Token: String!): String!
  forgotPassword(email: String!): String!
  resetPassword(password: String!, id: String!): String!

  # Admin & Moderator Mutations
  adminSignIn(input: AdminSignInInput!): String!
  createModerator(adminId: ID!, input: CreateModeratorInput!): String!

  # Product Mutations
  createProduct(input: ProductInput!): String!
  updateProduct(slug: String!, input: ProductInput!): String!
  deleteProduct(productId: ID!): String!
  addProductInventory(productId: ID!, inventory: Int!): String!
  sellProduct(productId: ID!, quantitySold: Int!): Product!
  undoSellProduct(productId: ID!, quantityReturned: Int!): Product!

  # Product Group Mutations
  createGroupProductVariant(input: CreateGroupProductVariantInput!): GroupProductVariant!
  updateGroupProductVariant(input: UpdateGroupProductVariantInput!): String!
  deleteGroupProductVariant(id: ID!): String!

  # Review Mutations
  AddReview(input: AddReviewInput!): String!
  deleteReview(reviewId: ID!): Boolean!

  # Category Mutations
  createCategory(input: CreateCategoryInput!): String!
  updateCategory(id: ID!, input: UpdateCategoryInput!): String!
  deleteCategory(id: ID!): String!
  reorderCategories(categoryOrders: [CategoryOrderInput!]!): String!

  # Brand & Color Mutations
  addBrand(name: String!, logo: String!): String!
  deleteBrand(brandId: ID!): String!
  addColor(color: String!, Hex: String!): String!
  deleteColor(Hex: String!): String!

  # Basket Mutations
  addToBasket(input: CreateToBasketInput!): Basket!
  removeProductFromBasket(productId: ID!, basketId: ID!): String!
  increaseQuantity(basketId: ID!): Basket!
  decreaseQuantity(basketId: ID!): Basket!
  addMultipleToBasket(input: AddMultipleToBasketInput!): String!

  # Checkout Mutations
  createCheckout(input: CreateCheckoutInput!): CreateCheckoutOutput!
  createCheckoutFromAdmin(input: CreateCheckoutFromAdminInput!): String!
  updateCheckout(input: UpdateCheckoutInput!): String!
  updateCustomerCheckout(input: UpdateCustomerCheckoutInput!): String!

  # Package Mutations
  updatePackage(input: UpdatePackageInput!): String!
  cancelPackage(input: CancelPackageInput!): String!
  refundPackage(input: RefundPackageInput!): String!
  payedOrConfirmedOrInTransitPackage(packageId: ID!, paymentMethod: PaymentMethod!, status: String!, deliveryReference: String): String!
  createPackageComments(packageId: ID!, comment: [String!]!): String!
  updateStatusPayOnlinePackage(packageId: ID!, paymentStatus: Status!): String!

  # Discount & Campaign Mutations
  addPromotionalCampaign(input: PromotionalCampaignInput!): AddPromotionalCampaignResponse!
  removePromotionalCampaigns(conditions: RemovePromotionalCampaignsConditions, campaignName: String, softDelete: Boolean): RemovePromotionalCampaignsResponse!
  reactivateCampaign(campaignName: String!): ReactivateCampaignResult!
  deleteProductDiscount(productId: ID!): String!

  # Coupon Mutations
  createCoupons(input: CreateCouponInput!): String!
  deleteCoupons(couponsIds: [ID!]!): String!

  # Loyalty & Points Mutations
  manageUserPoints(input: PointTransactionInput!): String!
  updatePointSettings(input: PointSettingsInput!): PointSetting!
  generateVoucher(input: GenerateVoucherInput!): Voucher!
  useVoucher(input: UseVoucherInput!): VoucherResponse!
  resetUserPoints(input: ResetPointsInput!): User!
  deletePointTransaction(transactionId: String!): DeletePointTransactionResponse!

  # Featured Products Mutations
  addBestSells(categoryId: String, productId: String!): String!
  deleteProductBestSells(productId: String!): String!
  addProductToTopDeals(productId: String!): String!
  deleteTopDeals(productId: String!): String!

  # Favorite Products Mutations
  addDeleteProductToFavorite(input: AddDeleteProductToFavoriteInput!): String!

  # Advertisement Mutations
  createCarouselAdvertisement(input: [advertisementInput!]!): String!
  createBannerAdvertisement(input: [advertisementInput!]!): String!
  createClientService(input: [advertisementInput!]!): String!
  createSideAdvertisement(input: [advertisementInput!]!): String!
  createLeftNextToCarouselAds(input: [advertisementInput!]!): String!
  createBigAds(input: advertisementInput!): String!

  # System Configuration Mutations
  createOrUpdateCompanyInfo(input: CompanyInfoInput!): CompanyInfo!
  updateSectionVisibility(section: String!, visibilityStatus: Boolean!): String!
  addApiCredentials(input: CreateApiCredentialsInput!): String!
  deleteApiCredentials(id: ID!): String!

  # Contact Us Mutations
  createContactUs(input: ContactUsInput!): String!
}

# ============================================================================
# INPUT TYPES
# ============================================================================

# User & Authentication Inputs
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

input AdminSignInInput {
  fullName: String!
  password: String!
  role: Role!
}

input CreateModeratorInput {
  fullName: String!
  password: String!
}

# Product Inputs
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
  groupProductVariantId: ID
}

input CreateGroupProductVariantInput {
  groupProductName: String!
}

input UpdateGroupProductVariantInput {
  id: ID!
  groupProductName: String
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

input BrokenProduct {
  productId: String!
  quantity: Int!
}

# Review Inputs
input AddReviewInput {
  productId: ID!
  userId: ID
  rating: Int!
  comment: String
  userName: String
}

# Category Inputs
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

input CategoryOrderInput {
  id: ID!
  order: Int!
}

# Basket Inputs
input CreateToBasketInput {
  userId: ID!
  productId: ID!
  quantity: Int!
}

input AddMultipleToBasketInput {
  userId: ID!
  products: [ProductInputQuantity!]!
}

# Checkout Inputs
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

input ProductInCheckoutInput {
  productId: ID!
  productQuantity: Int!
  price: Float!
  discountedPrice: Float
}

input ProductInCheckoutFromAdminInput {
  productId: ID!
  productQuantity: Int!
  price: Float!
  discountedPrice: Float
}

input ProductInCheckoutUpdateInput {
  productId: String!
  productQuantity: Int!
  price: Float!
  discountedPrice: Float!
}

# Package Inputs
input UpdatePackageInput {
  packageId: ID!
  status: Status!
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

input CancelProductPackageInput {
  packageId: ID!
  cause: Cause!
  description: String
  productId: ID!
  productQuantity: Int!
}

input ExchangePackageInput {
  packageId: String!
  cause: Cause!
  description: String
}

input ExchangePackageProductInput {
  packageId: String!
  productId: String!
  cause: Cause!
  description: String
  productQuantity: Int!
}

# Discount & Campaign Inputs
input CreateProductDiscountInput {
  dateOfStart: String!
  dateOfEnd: String!
  newPrice: Float!
}

input PromotionalCampaignInput {
  discountPercentage: Float
  discountAmount: Float
  dateOfStart: String!
  dateOfEnd: String!
  campaignName: String
  createdById: String
  conditions: DiscountConditions
}

input DiscountConditions {
  minPrice: Float
  maxPrice: Float
  categoryIds: [String!]
  brandIds: [String!]
  isVisible: Boolean
  hasInventory: Boolean
  excludeProductIds: [String!]
}

input RemovePromotionalCampaignsConditions {
  categoryIds: [String!]
  brandIds: [String!]
  productIds: [String!]
}

# Coupon Inputs
input CreateCouponInput {
  code: String!
  discount: Float!
}

# Loyalty & Points Inputs
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

# Featured Products Inputs
input CreateTopDealsInput {
  productId: ID!
}

input AddDeleteProductToFavoriteInput {
  userId: ID!
  productId: ID!
}

# System Configuration Inputs
input CompanyInfoInput {
  phone: [String!]!
  deliveringPrice: Int!
  logo: String!
  instagram: String!
  facebook: String!
  location: String!
  email: String!
}

input advertisementInput {
  images: [String!]!
  position: String!
  link: String
}

input CreateApiCredentialsInput {
  api_id: String!
  access_token: String!
  integrationFor: String!
  domainVerification: String
}

input ContactUsInput {
  userId: String
  subject: String!
  email: String!
  message: String!
  document: String
}
`