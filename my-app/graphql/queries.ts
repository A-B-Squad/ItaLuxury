import { gql } from "@apollo/client";



export const GET_PRODUCT_IMAGES_QUERY = gql`
  query Query($productId: String!, $colorId: String!) {
    getProductImages(productId: $productId, colorId: $colorId)
  }
`;

export const FETCH_USER_BY_ID = `
 query FetchUsersById($userId: ID!) {
  fetchUsersById(userId: $userId) {
    email
    number
    createdAt
    fullName
    Voucher {
      id
      code
      amount
      isUsed
      createdAt
      expiresAt
      usedAt
      userId
      checkoutId
    }
    pointTransactions {
      id
      amount
      type
      description
      createdAt
      userId
      checkoutId
    }
    number
    points
  }
}

`;

export const GET_REVIEW_QUERY = gql`
   query ProductReview($productId: ID!) {
    productReview(productId: $productId) {
      id
      rating
      comment
      userId
      user {
        fullName
      }
      userName
    }
  }
`;
export const GET_USER_REVIEW_QUERY = gql`
  query ProductReview($productId: ID!, $userId: ID) {
    productReview(productId: $productId, userId: $userId) {
      id
      rating
      comment
    }
  }
`;
export const BASKET_QUERY = gql`
  query BasketByUserId($userId: ID!) {
    basketByUserId(userId: $userId) {
      id
      userId
      quantity
      Product {
        id
        name
        slug
        price
        images
        isVisible
        reference
        inventory
           productDiscounts {
        id
        price
        newPrice
        discountType
        discountValue
        campaignName
        campaignType
        dateOfStart
        dateOfEnd
        isActive
        isDeleted
      }
        categories {
          id
          name
          subcategories {
            id
            name
            subcategories {
              id
              name
            }
          }
        }
      }
    }
  }
`;

export const TAKE_16_PRODUCTS_BY_CATEGORY = gql`
  query productsByCategory($categoryName: String!, $limit: Int!) {
    productsByCategory(categoryName: $categoryName, limit: $limit) {
      id
      name
      slug
      price
      reference
      description
      createdAt
      updatedAt
      inventory
      images
      categories {
        id
        name
        subcategories {
          id
          name
          parentId
          subcategories {
            id
            name
            parentId
          }
        }
      }
      Colors {
        id
        color
        Hex
      }
      technicalDetails
         productDiscounts {
        id
        price
        newPrice
        discountType
        discountValue
        campaignName
        campaignType
        dateOfStart
        dateOfEnd
        isActive
        isDeleted
      }
    }
  }
`;
export const TAKE_14_PRODUCTS_PRICE_20 = gql`
  query ProductsLessThen20($limit: Int!) {
    productsLessThen20(limit: $limit) {
      id
      name
      slug
      price
      reference
      description
      createdAt
      updatedAt
      inventory
      images
      categories {
        id
        name
        subcategories {
          id
          name
          parentId
          subcategories {
            id
            name
            parentId
          }
        }
      }
      Colors {
        id
        color
        Hex
      }
     productDiscounts {
        id
        price
        newPrice
        discountType
        discountValue
        campaignName
        campaignType
        dateOfStart
        dateOfEnd
        isActive
        isDeleted
      }
    }
  }
`;
export const SIDE_ADS_NEW_PRODUCT = gql`
  query Query($position: String!) {
    advertismentByPosition(position: $position) {
      images
      link
    }
  }
`;

export const TOP_DEALS = gql`
  query AllDeals {
    allDeals {
      product {
        id
        name
        slug
        price
        reference
        description
        createdAt
        updatedAt
        inventory
        images
        technicalDetails
        categories {
          id
          name
          subcategories {
            id
            name
            parentId
            subcategories {
              id
              name
              parentId
            }
          }
        }
        Colors {
          id
          color
          Hex
        }
       productDiscounts {
        id
        price
        newPrice
        discountType
        discountValue
        campaignName
        campaignType
        dateOfStart
        dateOfEnd
        isActive
        isDeleted
      }
        }
      }
    }
  
`;
export const CLIENT_SERVICES = gql`
  query Query($position: String!) {
    advertismentByPosition(position: $position) {
      images
      link
    }
  }
`;
export const ADVERTISSMENT_QUERY = gql`
  query AdvertismentByPosition($position: String!) {
    advertismentByPosition(position: $position) {
      images
      link
    }
  }
`;
export const CATEGORIES_QUERY_NOGQL = `
  query FetchMainCategories {
  fetchMainCategories {
    id
    name
    bigImage
    smallImage
    order
    subcategories {
      id
      name
      parentId
      smallImage
      order
      subcategories {
        id
        name
        parentId
        smallImage
        order
      }
    }
  }
}
`;

export const MAIN_CATEGORY_QUERY = gql`
   query FetchMainCategories {
  fetchMainCategories {
    id
    name
    bigImage
    smallImage
    order
    subcategories {
      id
      name
      parentId
      smallImage
      order
      subcategories {
        id
        name
        parentId
        smallImage
        order
      }
    }
  }
}

`;

export const SEARCH_PRODUCTS_QUERY = gql`
  query SearchProducts($input: ProductSearchInput!) {
    searchProducts(input: $input) {
      results {
        products {
          id
          name
          slug
          price
          isVisible
          reference
          description
          inventory
          solde
          images
          createdAt
          updatedAt
          categories {
            id
            name
            description
          }
        
          productDiscounts {
        id
        price
        newPrice
        discountType
        discountValue
        campaignName
        campaignType
        dateOfStart
        dateOfEnd
        isActive
        isDeleted
      }
        }
        categories {
          id
          name
          description
        }
      }
      totalCount
      pagination {
        currentPage
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;
export const SEARCH_PRODUCTS_QUERY_NO_GQL = gql`
  query SearchProducts($input: ProductSearchInput!) {
    searchProducts(input: $input) {
      results {
        products {
          id
          name
          slug
          price
          isVisible
          reference
          description
          inventory
          solde
          images
          createdAt
          updatedAt
          categories {
            id
            name
            description
          }
        
            productDiscounts {
        id
        price
        newPrice
        discountType
        discountValue
        campaignName
        campaignType
        dateOfStart
        dateOfEnd
        isActive
        isDeleted
      }
        }
        categories {
          id
          name
          description
        }
      }
      totalCount
      pagination {
        currentPage
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;



export const FAVORITE_PRODUCTS_QUERY = gql`
  query FavoriteProducts($userId: ID!) {
    favoriteProducts(userId: $userId) {
      Product {
        id
        name
        slug
        price
        isVisible
        reference
        description
        inventory
        solde
        images
        createdAt
        updatedAt
        categories {
          id
          name
          description
          subcategories {
            id
            name
            parentId
            subcategories {
              id
              name
              parentId
            }
          }
        }
productDiscounts {
        id
        price
        newPrice
        discountType
        discountValue
        campaignName
        campaignType
        dateOfStart
        dateOfEnd
        isActive
        isDeleted
      }
      }
    }
  }
`;

export const BEST_SALES_QUERY = gql`
  query GetBestSells {
    getBestSells {
      Product {
        id
        name
        slug  
        images
        price
        description
          productDiscounts {
        id
        price
        newPrice
        discountType
        discountValue
        campaignName
        campaignType
        dateOfStart
        dateOfEnd
        isActive
        isDeleted
      }
        categories {
          id
          name
          description
        }
      }
    }
  }
`;
export const GET_FAVORITE_STATUS = gql`
  query FavoriteProducts($userId: ID!) {
    favoriteProducts(userId: $userId) {
      id
      productId
    }
  }
`;
export const GET_BRANDS = gql`
  query FetchBrands {
    fetchBrands {
      id
      logo
    }
  }
`;

export const COMPANY_INFO_QUERY = `
  query CompanyInfo {
    companyInfo {
      id
      phone
      deliveringPrice
      logo
      facebook
      instagram
      location
      email
    }
  }
`;

export const GET_PACKAGES_BY_USER_ID = gql`
  query PackageByUserId($userId: ID!) {
    packageByUserId(userId: $userId) {
      id
      customId
      Checkout {
        total
        freeDelivery
        productInCheckout {
          productId
          productQuantity
          product {
            name
            slug
          }
        }
      }
      status
      createdAt
    }
  }
`;
export const GET_PACKAGES_BY_ID = gql`
query PackageById($packageId: ID!) {
  packageById(packageId: $packageId) {
    id
    customId
    Checkout {
      total
      freeDelivery
      productInCheckout {
        productId
        productQuantity
        product {
          slug
          name
        }
      }
      total
    }
    status
    createdAt
  }
}

`;

export const ALL_BRANDS = `
query FetchBrands {
  fetchBrands {
    id
    name
    logo
    product {
      slug
      id
      Brand {
        name
      }
      Colors {
        color
        Hex
      }
      categories {
        name
      }
    }
  }
}



`;
export const GET_GOVERMENT_INFO = gql`
  query AllGovernorate {
    allGovernorate {
      id
      name
    }
  }
`;
export const CONTENT_VISIBILITY = gql`
  query GetSectionVisibility($section: String!) {
    getSectionVisibility(section: $section) {
      section
      visibility_status
    }
  }
`;
export const TAKE_14_PRODUCTS = gql`
  query AllNewProducts($limit: Int, $visibleProduct: Boolean) {
    allNewProducts(limit: $limit, visibleProduct: $visibleProduct) {
      id
      name
      slug
      price
      reference
      description
      createdAt
      updatedAt
      inventory
      images
      categories {
        id
        name
        description
        subcategories {
          id
          name
          parentId
          subcategories {
            id
            name
            parentId
          }
        }
      }
      Colors {
        id
        color
        Hex
      }
      technicalDetails
         productDiscounts {
        id
        price
        newPrice
        discountType
        discountValue
        campaignName
        campaignType
        dateOfStart
        dateOfEnd
        isActive
        isDeleted
      }
    }
  }
`;
export const TAKE_14_PRODUCTS_IN_DISCOUNT = gql`
  query ProductsDiscounts($limit: Int) {
    productsDiscounts(limit: $limit) {
      id
      name
      slug
      price
      reference
      description
      createdAt
      updatedAt
      inventory
      images
      categories {
        id
        name
        description
        subcategories {
          id
          name
          parentId
          subcategories {
            id
            name
            parentId
          }
        }
      }
      technicalDetails
      Colors {
        id
        color
        Hex
      }
  productDiscounts {
        id
        price
        newPrice
        discountType
        discountValue
        campaignName
        campaignType
        dateOfStart
        dateOfEnd
        isActive
        isDeleted
      }
    }
  }
`;
export const COLORS_QUERY = `
 query Colors {
  colors {
    id
    color
    Hex
    Product {
      slug
      id
    }
  }
}
`;

export const GET_PRODUCTS_BY_SLUG = `
query GetProductBySlug($slug: String!) {
  getProductBySlug(slug: $slug) {
      id
      name
      slug
      price
      isVisible
      reference
      description
      inventory
      solde
      images
      createdAt
      updatedAt
      categories {
        id
        name
        description
        subcategories {
          id
          name
          parentId
          subcategories {
            id
            name
            parentId
          }
        }
      }
        productDiscounts {
        id
        price
        newPrice
        discountType
        discountValue
        campaignName
        campaignType
        dateOfStart
        dateOfEnd
        isActive
        isDeleted
      }
      Colors {
        id
        color
        Hex
      }
      technicalDetails
      reviews {
        rating
        userId
      }
      Brand {
        name
      }
      GroupProductVariant {
        id
        groupProductName
        Products {
          id
          name
          slug
          Colors {
            Hex
          }
        }
      }
    }
  }`

export const PACKAGE_QUERY = gql`
  query GetAllPackages {
    getAllPackages {
      id
      checkoutId
      status
      createdAt
      Checkout {
        id
        total
      }
    }
  }
`;
export const DELETE_ALL_DISCOUNTS_QUERY = gql`
  query Query {
    deleteAutoProductDiscount
  }
`;

export const FIND_UNIQUE_COUPONS = gql`
  query FindUniqueCoupons($codeInput: String!) {
    findUniqueCoupons(codeInput: $codeInput) {
      id
      discount
    }
  }
`;
export const GET_POINT_SETTINGS = gql`
  query GetPointSettings {
    getPointSettings {
      id
      conversionRate
      redemptionRate
      minimumPointsToUse
      loyaltyThreshold
      loyaltyRewardValue
      isActive
    }
  }
`;
