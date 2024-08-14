import { gql } from "@apollo/client";

export const USER_QUERIES = gql`
  query FetchUsersById($userId: ID!) {
    fetchUsersById(userId: $userId) {
      fullName
    }
  }
`;
export const PRODUCT_BY_ID_QUERY = gql`
  query ProductById($productByIdId: ID!) {
    productById(id: $productByIdId) {
      id
      name
      price
      isVisible
      reference
      description
      inventory
      solde
      images
      createdAt
      productDiscounts {
        id
        price
        newPrice
        dateOfEnd
        dateOfStart
      }
      Colors {
        id
        id
        color
        Hex
      }

      attributes {
        id
        name
        value
      }
    }
  }
`;
export const GET_PRODUCT_IMAGES_QUERY = gql`
  query Query($productId: String!, $colorId: String!) {
    getProductImages(productId: $productId, colorId: $colorId)
  }
`;
export const GET_REVIEW_QUERY = gql`
  query ProductReview($productId: ID!) {
    productReview(productId: $productId) {
      id
      rating
      userId
    }
  }
`;
export const GET_USER_REVIEW_QUERY = gql`
  query ProductReview($productId: ID!, $userId: ID) {
    productReview(productId: $productId, userId: $userId) {
      id
      rating
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
        price
        images
        productDiscounts {
          newPrice
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

export const TAKE_10_PRODUCTS_BY_CATEGORY = gql`
  query productsByCategory($categoryName: String!, $limit: Int!) {
    productsByCategory(categoryName: $categoryName, limit: $limit) {
      id
      name
      price
      reference
      description
      createdAt
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
      attributes {
        id
        name
        value
      }
      productDiscounts {
        price
        newPrice
        Discount {
          percentage
        }
      }
    }
  }
`;
export const TAKE_6_PRODUCTS_PRICE_20 = gql`
  query ProductsLessThen20($limit: Int!) {
    productsLessThen20(limit: $limit) {
      id
      name
      price
      reference
      description
      createdAt
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
        price
        newPrice
        Discount {
          percentage
        }
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
        price
        reference
        description
        createdAt
        inventory
        images
        attributes {
          name
          value
        }
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
          price
          newPrice
          dateOfEnd
          Discount {
            percentage
          }
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
export const CATEGORIES_QUERY = `
  query Categories {
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
  }
`;
export const CATEGORY_QUERY = gql`
  query Categories {
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
  }
`;
export const MAIN_CATEGORY_QUERY = gql`
  query FetchMainCategories {
    fetchMainCategories {
      id
      name
      bigImage
      smallImage
      subcategories {
        id
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
          price
          isVisible
          reference
          description
          inventory
          solde
          images
          createdAt
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
            price
            newPrice
            Discount {
              percentage
            }
          }
        }
        categories {
          id
          name
        }
      }
      totalCount
    }
  }
`;

export const FAVORITE_PRODUCTS_QUERY = gql`
  query FavoriteProducts($userId: ID!) {
    favoriteProducts(userId: $userId) {
      Product {
        name
        price
        isVisible
        reference
        description
        inventory
        solde
        images
        createdAt
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
        productDiscounts {
          id
          price
          newPrice
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
        images
        price
        description
        productDiscounts {
          newPrice
          price
          Discount {
            id
            percentage
          }
        }
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
      }
      Category {
        id
        name
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

export const COMPANY_INFO_QUERY = gql`
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
        productInCheckout {
          productId
          product {
            name
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
        productInCheckout {
          productId
          product {
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
        id
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
export const TAKE_6_PRODUCTS = gql`
  query Products($limit: Int!) {
    products(limit: $limit) {
      id
      name
      price
      reference
      description
      createdAt
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
      attributes {
        id
        name
        value
      }
      productDiscounts {
        price
        newPrice
        Discount {
          percentage
        }
      }
    }
  }
`;
export const TAKE_6_PRODUCTS_IN_DISCOUNT = gql`
  query ProductsDiscounts($limit: Int) {
    productsDiscounts(limit: $limit) {
      id
      name
      price
      reference
      description
      createdAt
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
      attributes {
        id
        name
        value
      }
      Colors {
        id
        color
        Hex
      }
      productDiscounts {
        price
        newPrice
        Discount {
          percentage
        }
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
    }
  }
`;
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
