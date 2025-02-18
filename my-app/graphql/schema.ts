export const typeDefs = `#graphql 
# Enumerations
enum Role {
  USER
  ADMIN
  MODERATOR
}

enum Status {
  REFUNDED
  BACK
  CONFIRMED
  PROCESSING
  TRANSFER_TO_DELIVERY_COMPANY
  PAYED_AND_DELIVERED
  PAYED_NOT_DELIVERED
  PAYMENT_REFUSED
  CANCELLED
}
enum PaymentMethod {
  CREDIT_CARD
  CASH_ON_DELIVERY
}

enum Cause {
  BROKEN
  REFUND
  CANCEL
}

# User-related types
type User {
  id: ID!
  fullName: String!
  email: String!
  role: Role!
  number: String!
  baskets: [Basket]!
  reviews: [Review]!
  checkout:[Checkout]
  favoriteProducts: [FavoriteProducts]!
  ContactUs:[ContactUs]!
}

type AuthPayload {
  token: String!
  user: User!
}

# Category-related types
type Category {
  id: ID!
  smallImage: String
  bigImage: String
  description: String
  name: String!
  parentId: ID
  parent: Category
  products: [Product!]!
  subcategories: [Category!]!
}

type MainCategory {
  id: ID!
  name: String!
  parentId: ID
  description:String!
  bigImage: String
  smallImage: String
  subcategories: [Category!]!
}

# Product-related types
type Product {
  id: ID!
  name: String!
  price: Float!
  purchasePrice: Float!
  isVisible: Boolean!
  reference: String!
  description: String!
  inventory: Int!
  broken: Int!
  solde: Int!
  images: [String!]
  createdAt: String!
  categories: [MainCategory!]!
  productDiscounts: [ProductDiscount!]
  baskets: [Basket!]
  reviews: [Review!]
  favoriteProducts: [FavoriteProducts!]
  attributes: [ProductAttribute!]!
  Colors: Colors
  Brand: Brand

}



type Colors {
  id: ID!
  color: String!
  Hex: String!
  Product: [Product!]

}

type Brand {
  id: ID!
  name: String!
  logo: String!
  categoryId: ID
  Category:Category
  product: [Product!]
}


type ProductDiscount {
  id: ID
  productId: ID
  product: Product
  price: Float
  newPrice: Float
  dateOfStart: String
  dateOfEnd: String
}

# Shopping-related types
type Basket {
  id: ID!
  userId: ID!
  quantity: Int!
  User: User!
  productId: ID!
  Product: Product!
  checkout: [Checkout!]!
}

type Checkout {
  id: ID!
  userId: ID
  userName: String!
  governorateId: ID!
  Governorate: Governorate!
  productInCheckout: [ProductInCheckout]!
  phone: [String!]!
  package:[Package]
  address: String!
  total: Float!
  createdAt: String!
  couponsId: String
  Coupons: Coupons
  User: User
  manualDiscount: Float
  freeDelivery:Boolean
  isGuest:Boolean
  guestEmail:String
  deliveryComment:String
  paymentMethod:PaymentMethod
}
type CreateCheckoutOutput {
  customId:String!
  orderId:String!
}
type ProductInCheckout {
  id: ID!
  checkoutId: ID
  productId: ID!
  product: Product
  productQuantity: Int!
  price: Float!
  discountedPrice: Float!
}
type ApiCredentials {
  id: ID!
  api_id: String!
  access_token: String!
  createdAt: String!
  integrationFor:String!
  domainVerification:String!
}


type Package {
  id: ID!
  customId: String!
  checkoutId: ID!
  status: Status!
  createdAt: String!
  Checkout: Checkout!
  couponsId: String
  comments: [String!]
  delivredAt:String
  inTransitAt:String
  returnedAt:String
}

# Review and favorite-related types
type Review {
  id: ID!
  rating: Float!
  userId: ID!
  user: User!
  productId: ID!
  product: Product!
}

type FavoriteProducts {
  id: ID!
  userId: ID!
  user: User!
  productId: ID!
  Product: Product!
}

# Other types
type ProductAttribute {
  id: ID!
  name: String!
  value: String!
  productId: ID!
  product: Product!
}

type Advertisement {
  id: ID!
  images: [String!]!
  position: String!
  link: String!
}

type Governorate {
  id: ID!
  name: String!
}

type CompanyInfo {
  id: ID
  phone: [String]
  deliveringPrice: Int
  logo: String
  instagram: String
  facebook: String
  location: String
  email: String
}

type TopDeals {
  id: ID!
  productId: ID!
  product: Product!
} 

type Moderator {
  id: ID!
  fullName: String!
  email:String
  phone:String
  password:String
}

type SearchProductsResult {
  results: SearchResults!
  totalCount: Int!
  pagination: PaginationInfo! # Add pagination metadata
}

type PaginationInfo {
  currentPage: Int!
  totalPages: Int!
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}
type SearchResults {
  products: [Product!]!
  categories: [Category!]!
}

type BestSales {
  id: String!
  Product: Product!
  Category: Category!
}

type content_visibility {
  id: String!
  section: String!
  visibility_status: Boolean!
}

type ContactUs {
  id: String!
  userId:String
  subject: String!
  email: String!
  message: String!
  document: String
}

type Coupons {
  id: String
  code: String
  discount: Int
  available: Boolean
  checkout: [Checkout!]
}

# Query type
type Query {
  # User-related queries
  fetchAllUsers: [User]!
  fetchUsersById(userId: ID!): User!

  # Content visibility query
  getSectionVisibility(section:String!): content_visibility!
   getAllSectionVisibility: [content_visibility!]!

  # Best sales query
  getBestSells(limit: Int): [BestSales!]

  # Coupon-related queries
  findUniqueCoupons(codeInput: String!): Coupons
  fetchAllCoupons(page: Int, pageSize: Int): [Coupons!]!

  # Product-related queries
  allNewProducts(limit: Int,visibleProduct:Boolean): [Product!]
  fetchBrands: [Brand!]
  searchProducts(input: ProductSearchInput!): SearchProductsResult!
  colors(limit: Int): [Colors!]
  productsLessThen20(limit: Int): [Product!]
  productsByCategory(categoryName: String!, limit: Int): [Product!]!
  productById(id: ID!): Product!
  getProductImages(productId: String!, colorId: String!): [String!]!

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


  # api Credentials Query
  getApiCredentials(integrationFor:String): ApiCredentials!


  # Other queries
  productColors(productId: ID!): Colors!
  allDeals: [TopDeals!]!
  allGovernorate: [Governorate!]!
  advertismentByPosition(position: String!): [Advertisement]!
  packageById(packageId: ID!): Package!
  packageByUserId(userId: ID!): [Package]!
  getAllPackages: [Package!]
  companyInfo: CompanyInfo!
  allContactUs: [ContactUs!]


  # Automatic discount deletion
  deleteAutoProductDiscount: String!
}

# Mutation type
type Mutation {
  # Advertisement mutations
  createCarouselAdvertisement(input: [advertisementInput]): String
  createBannerAdvertisement(input: [advertisementInput]): String
  createClientService(input: [advertisementInput]): String
  createSideAdvertisement(input: [advertisementInput]): String
  createLeftNextToCarouselAds(input: [advertisementInput]): String
  createBigAds(input: advertisementInput): String

  # Password-related mutations
  forgotPassword(email: String!): String!
  resetPassword(password: String, id: String): String!

  # Section visibility mutation
  updateSectionVisibility(section: String!,visibilityStatus: Boolean!): String!
  
  # Best Sells mutation
  addBestSells(categoryId:String,productId:String!):String!
  deleteProductBestSells(productId:String!):String!
  
  # User-related mutations
  signUp(input: SignUpInput!): AuthPayload!
  signIn(input: SignInInput!): AuthPayload!
  refreshToken(Token: String!): String!

  # Product-related mutations
  createProduct(input: ProductInput!): String!
  updateProduct(productId: ID!, input: ProductInput!): String!
  deleteProduct(productId: ID!): String!
  addRating(productId: ID!, userId: ID!, rating: Int!): String!
  addProductInventory(productId: ID!, inventory: Int!): String!
  undoSellProduct(productId: ID!, quantityReturned: Int!): Product!
  sellProduct(productId: ID!, quantitySold: Int!): Product

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
  payedOrConfirmedOrInTransitPackage(packageId: ID! , paymentMethod:PaymentMethod!, status: String!): String!
  createPackageComments(packageId: ID!, comment: [String!]!): String!
  updateStatusPayOnlinePackage(packageId:ID!,paymentStatus:Status):String!
  # Category-related mutations
  createCategory(input: CreateCategoryInput!): String!
  updateCategory(id: ID!, input: UpdateCategoryInput!): String!
  deleteCategory(id: ID!): String!

  # Favorite product mutation
  addDeleteProductToFavorite(input: AddDeleteProductToFavoriteInput!): FavoriteProducts

  # Company info mutation
  createOrUpdateCompanyInfo(input: CompanyInfoInput!): CompanyInfo!

  # Top deals mutations
  addProductToTopDeals(productId: String!): String!
  deleteTopDeals(productId: String!): String!

  # Moderator creation mutation
  adminSignIn( input: AdminSignInInput! ): String!
  createModerator(adminId: ID!, input: CreateModeratorInput!): String!
  
  # Api Credentials  mutation
  addApiCredentials(input: CreateApiCredentialsInput!): String!
  deleteApiCredentials(id: ID!): String
  # Contact us mutation
  createContactUs(input: ContactUsInput!): String!

  # Coupon-related mutations
  deleteCoupons(couponsId: ID!): String!
  createCoupons(input: CreateCouponInput!): String!
  # Color  mutations
  addColor(color:String! , Hex:String!):String!
  deleteColor(Hex:String!):String!
  # Brand Mutations
  addBrand(name:String!,logo:String!):String!
  deleteBrand(brandId:ID!):String!
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
  inventory: Int!
  images: [String!]!
  categories: [ID!]!
  attributeInputs: [ProductAttributeInput!]
  discount: [CreateProductDiscountInput]
  colorsId: ID
  brandId: ID

}

input UpdateCheckoutInput {
  checkoutId: ID!
  total: Float!
  manualDiscount: Float
  couponsId: ID
  productInCheckout: [ProductInCheckoutUpdateInput!]!
  freeDelivery:Boolean
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

input ProductAttributeInput {
  name: String!
  value: String!
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
  integrationFor:String!
  domainVerification:String

}


input CreateProductDiscountInput {
  dateOfStart: String
  dateOfEnd: String
  newPrice: Float
}

input CreateToBasketInput {
  userId: ID!
  productId: ID!
  quantity: Int!
}

input CreateCheckoutInput {
  userId: ID
  governorateId: ID!
  userName: String
  products: [ProductInCheckoutInput!]
  phone: [String!]
  address: String!
  total: Float!
  couponsId: String
  freeDelivery:Boolean!
  isGuest:Boolean!
  guestEmail:String
  deliveryComment:String
  paymentMethod:PaymentMethod!
}

input CreateCheckoutFromAdminInput {
  userId: ID
  governorateId: ID!
  userName: String
  products: [ProductInCheckoutFromAdminInput!]
  phone: [String!]
  address: String!
  total: Float!
  manualDiscount: Float
  freeDelivery:Boolean

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
  phone: [String!]
  deliveringPrice: Int
  logo: String
  instagram: String
  facebook: String
  location: String
  email: String
}

input CreateModeratorInput {
  fullName: String!
  password: String!
}
input AdminSignInInput {
  fullName: String!
  password: String!
  role:Role
}

input ExchangePackageProductInput {
  packageId: String
  productId: String
  cause: Cause
  description: String
  productQuantity: Int!
}

input ExchangePackageInput {
  packageId: String
  cause: Cause
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
  visibleProduct:Boolean
  sortBy: String 
  sortOrder: String 
}

input ContactUsInput {
  userId:String
  subject: String!
  email: String!
  message: String!
  document: String
}

input advertisementInput {
  images: [String!]!
  position: String!
  link: String!
}

input CreateCouponInput {
  code: String!
  discount: Int!
}
`;
