export const typeDefs = `#graphql 
# Define the role enumeration
enum Role {
  USER
  ADMIN
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
  images: [String!]!
  createdAt: String!
  categories: [Category!]!
  productDiscount: ProductDiscount
  baskets: [Basket!]!
  reviews: [Review!]!
  favoriteProducts: [FavoriteProducts!]!
  colors: Colors!
  attributes: [ProductAttribute!]!
}

# Define the Colors type
type Colors {
  id: ID!
  color: String!
  products: [Product!]!
}

# Define the Discount type
type Discount {
  id: ID!
  percentage: Int!
  productDiscounts: [ProductDiscount!]!
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
  user: User!
  productId:ID!
  products:[Product!]!
  checkout: [Checkout!]!
}

# Define the Checkout type
type Checkout {
  id: ID!
  basketId: ID!
  basket: Basket!
  status: String!
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

# Define the Query type
type Query {
  # Fetch all products
  products: [Product!]!
  
  # Fetch products by category name
  productsByCategory(categoryName: String!): [Product!]!

  # Fetch a product by its ID
  productById(id: ID!): Product!

  # Fetch all categories
  categories: [Category!]!

  # Fetch subcategories by parent category ID
  subcategoriesByParentId(parentId: ID!): [Category!]!

  # Fetch a category by its name
  categoryByName(categoryName: String!): Category!

  # Fetch the basket of a user by user ID
  basketByUserId(userId: ID!): Basket!

  # Fetch the checkout information by basket ID
  checkoutById(basketId: ID!): Checkout!

  # Fetch product discount information by product ID
  productDiscount(productId: ID!): ProductDiscount!

  # Fetch all product discounts
  productsDiscounts: [ProductDiscount!]!

  # Fetch product review information by product ID
  productReview(productId: ID!): Review!

  # Fetch favorite products of a user by user ID
  favoriteProducts(userId: ID!): FavoriteProducts!



  # Fetch product colors by product ID
  productColors(productId: ID!): Colors!

  # Fetch product attributes by product ID
  productAttributes(productId: ID!): ProductAttribute!
}

# Define the Mutation type
type Mutation {
  # User mutations
  signUp(input: SignUpInput!): AuthPayload!
  signIn(input: SignInInput!): AuthPayload!

  # Product mutations
  createProduct(input: ProductInput!): Product!
  updateProduct(productId: ID!, input: ProductInput!): Product!
  deleteProduct(productId: ID!): String!

  # Basket mutations
  addToBasket(userId: ID!, productId: ID!): Basket!
  removeProductFromBasket(basketId: ID!): Basket!

  # Category mutations
  createCategory(input: CreateCategoryInput!): Category
  updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
  deleteCategory(id: ID!): Category!

  # Product Discount mutations
  deleteProductDiscount(id: ID!): String!

  # Checkout mutations
  createCheckout(input: CreateCheckoutInput!): Checkout!


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

# Define the AuthPayload type
type AuthPayload {
  token: String!
  user: User!
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
  attributeInputs: [ProductAttributeInput!]!
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

# Define the CreateCheckoutInput input type
input CreateCheckoutInput{
  basketId:ID!,
  status:String!
}
`;
