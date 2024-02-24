export const typeDefs = `#graphql 
# Define the role enumeration
enum Role {
  USER
  ADMIN
  MODERATOR
}

enum Status{
  PENDING
  BACK
  EXCHANGE
  DELIVERED
}

# Define the User type
type User {
  id: ID!
  fullName: String!
  email: String!
  role: Role!
  number: String!
  baskets: [Basket]!
  reviews: [Review]!
  favoriteProducts: [FavoriteProducts]!
}

# Define the AuthPayload type
type AuthPayload {
  token: String!
  user: User!
}

# Define the Category type
type Category {
  id: ID!
  name: String!
  parentId: ID
  parent: Category
  products: [Product!]!
  subcategories: [Category!]!
}

# Define the Product type
type Product {
  id: ID!
  name: String!
  price: Float!
  isVisible: Boolean!
  reference: String!
  description: String!
  inventory: Int!
  solde: Int!
  images: [String!]
  createdAt: String!
  categories: [Category!]!
  productDiscount: [ProductDiscount!]
  baskets: [Basket!]
  reviews: [Review!]
  favoriteProducts: [FavoriteProducts!]
  Colors: Colors!
  attributes: [ProductAttribute!]!
}

# Define the Colors type
type Colors {
  id: ID!
  color: String!
  products: [Product!]
}

# Define the Discount type
type Discount {
  id: ID!
  percentage: Int!
  productDiscounts: [ProductDiscount!]
}

# Define the ProductDiscount type
type ProductDiscount {
  id: ID!
  discountId: ID!
  productId: ID!
  price: Float!
  newPrice: Float!
  dateOfStart: String!
  dateOfEnd: String!
}

# Define the Basket type
type Basket {
  id: ID!
  userId: ID!
  quantity:Int!
  User: User!
  productId:ID!
  Product:Product!
  checkout: [Checkout!]!
}

# Define the Checkout type
type Checkout {
  id: ID!
  userId:ID!
  governorateId:ID!
  productIds:[ID!]!
  phone:[Int!]!
  address:String!
  total:Int!
  createdAt:String!
}

# Define the Package type
type Package{
    id:ID!
    checkoutId: ID!
    status:Status!
    createdAt: String!
    Checkout:Checkout!
}

# Define the Review type
type Review {
    id: ID!
    rating: Float!
    userId: ID!
    user: User!
    productId: ID!
    product: Product!
}

# Define the FavoriteProducts type
type FavoriteProducts {
    id: ID!
    userId: ID!
    user: User!
    productId: ID!
    product: Product!
}

# Define the ProductAttribute type
type ProductAttribute {
    id: ID!
    name: String!
    value: String!
    productId:ID!
    product: Product!
}

type Advertisement {
    id:ID!
    images: [String!]!
    position: String!
}
type Governorate{
  id:ID!
  name:String!
}
type CompanyInfo{
    id:ID!
    phone:[Int!]!
    deliveringPrice:Int
    logo:String!
}


type Moderator {
  id: ID!
  fullName: String!
  email: String!
  number: String!
}
type CompanyInfo {
  id: ID!
  phone:[Int!]!
  deliveringPrice:Int!
  logo:String!
}

# Define the Query type
type Query {
  # Fetch all products
  products: [Product!]
  
  # Fetch products by category name
  productsByCategory(categoryName: String!): [Product!]

  # Fetch a product by its ID
  productById(id: ID!): Product!

  # Fetch all categories
  categories: [Category!]!

  # Fetch subcategories by parent category ID
  subcategoriesByParentId(parentId: ID!): [Category!]

  # Fetch a category by its name
  categoryByName(categoryName: String!): Category!

  # Fetch the basket of a user by user ID
  basketByUserId(userId: ID!): Basket!

  # Fetch product discount information by product ID
  productDiscount(productId: ID!): ProductDiscount!

  # Fetch all product discounts
  productsDiscounts: [ProductDiscount!]

  # Fetch product review information by product ID
  productReview(productId: ID!): [Review!]
  
  # Fetch favorite products of a user by user ID
  favoriteProducts(userId: ID!): [FavoriteProducts!]

  # Fetch product colors by product ID
  productColors(productId: ID!): Colors!

  # Fetch All Governorate
  allGovernorate:[Governorate!]!

  # Fetch Advertisement By Type 
  advertismentByPosition(position:String!):Advertisement!

  # Fetch Package By ID
  packageById(packageId:ID!) :Package!

  # Fetch All Package 
  getAllPackages:[Package!]

  # Fetch Company Info 
  companyInfo:CompanyInfo!
}

# Define the Mutation type
type Mutation {
  # User mutations
    signUp(input: SignUpInput!): AuthPayload!
    signIn(input: SignInInput!): AuthPayload!

  # Fetch Refresh Token
  refreshToken(Token:String!):String!
  
  # Product mutations
    createProduct(input: ProductInput!): Product!
    updateProduct(productId: ID!, input: ProductInput!): Product!
    deleteProduct(productId: ID!): String!

  # New mutation to undo product sale
    undoSellProduct(productId: ID!, quantityReturned: Int!): Product!
  
  # New mutation to handle product sale
    sellProduct(productId: ID!, quantitySold: Int!): Product

  # Product Discount mutations
    deleteProductDiscount(productId: ID!): String!
  
  # Basket mutations
    addToBasket(input: CreateToBasketInput!): Basket!
    
    removeProductFromBasket(productId: ID!): String!
    deleteBasketById(basketId: ID!): String!

    increaseQuantity(basketId: ID!):Basket!
    decreaseQuantity(basketId: ID!): Basket!
  
  # Checkout mutations
    createCheckout(input: CreateCheckoutInput!): Checkout!

  # Package mutations
    updatePackage(input: CreatePackageInput!): Package!
  # Category mutations
    createCategory(input: CreateCategoryInput!): Category
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): Category!

  # mutation to add product to favorites
    addProductToFavorite(input:AddProductToFavoriteInput!): FavoriteProducts!

  # mutation to add Company Info
    createCompanyInfo(input:CompanyInfoInput!):CompanyInfo!

  # mutation to update Company Info
  updateCompanyInfo(input:CompanyInfoInput!,id:String!):CompanyInfo!

  #admin mutation for cerating a moderator
    createModerator(userId:ID!,input: CreateModeratorInput!): Moderator!

}



# Define the SignUpInput input type
input SignUpInput {
    fullName: String!
    email: String!
    password: String!
    number: String!
}

# Define the SignInInput input type
input SignInInput {
    email: String!
    password: String!
}


# Define the CreateProductInput input type
input ProductInput {
    name: String!
    price: Float!
    isVisible: Boolean!
    reference: String!
    description: String!
    inventory: Int!
    images: [String!]!
    categories: [ID!]!
    colorsId: ID
    attributeInputs: [ProductAttributeInput!]
    discount:[CreateProductDiscountInput]
}

# Define the AttributeInput input type
input ProductAttributeInput {
    name: String!
    value: String!
}

# Define the CreateCategoryInput input type
input CreateCategoryInput {
    name: String!
    parentId: ID
}

# Define the UpdateCategoryInput input type
input UpdateCategoryInput {
    name: String
}

# Define the AddProductToFavoriteInput input type
input AddProductToFavoriteInput {
    userId: ID!
    productId: ID!
}

# Define the Create Product Discount input type
input CreateProductDiscountInput{
    discountId: String!
    dateOfStart: String!
    dateOfEnd: String!
    newPrice:Float
}

# Define the Basket Input input type

input CreateToBasketInput{
    userId:ID!
    productId:ID!
    quantity:Int!
}

# Define the CreateCheckoutInput input type
input CreateCheckoutInput{
    userId:ID!
    governorateId:ID!
    productIds:[ID!]
    phone:[Int!]
    address:String!
    total:Int!
}
# Define the CreatePackageInput input type

input CreatePackageInput{
  packageId:String!
  status:Status!
}

# Define the PendingPackageInput input type
input PendingPackageInput{
  checkoutId:String!
}

# Define the CompanyInfoInput input type

input CompanyInfoInput{
  phone:[Int!]
  deliveringPrice:Int
  logo:String
}


# Define the CreateModeratorInput input type
input CreateModeratorInput {
  fullName: String!
  email: String!
  password: String!
  number: String!
}


`;
