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
        name
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
      name
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