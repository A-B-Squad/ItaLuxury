import { gql } from "@apollo/client";

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
        categories {
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
        }
      }
      Colors {
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
export const TAKE_10_PRODUCTS = gql`
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
        }
      }
      Colors {
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
        }
      }
      Colors {
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
          }
        }
        Colors {
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


export const COLORS_QUERY = gql`
  query Colors {
    colors {
      id
      color
      Hex
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
      categories {
         id
          name
          subcategories {
          id
          name
        }
        }
        productDiscounts {
          price
          newPrice
          Discount {
            percentage
          }
        }
      images
      createdAt
    
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