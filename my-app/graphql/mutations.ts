import { gql } from "@apollo/client";
export const ADD_TO_BASKET_MUTATION = gql`
mutation AddToBasket($input: CreateToBasketInput!) {
  addToBasket(input: $input) {
    id
    userId
    quantity
    productId
  }
}
`;

export const ADD_TO_FAVORITE_MUTATION = gql`
mutation AddProductToFavorite($input: AddProductToFavoriteInput!) {
  addProductToFavorite(input: $input) {
    id
    userId
    productId
  }
}
`;

export const ADD_RATING_MUTATION = gql`
mutation AddRating($productId: ID!, $userId: ID!, $rating: Int!) {
  addRating(productId: $productId, userId: $userId, rating: $rating)
}
`;
export const DELETE_BASKET_BY_ID_MUTATION = gql`
mutation DeleteBasketById($basketId: ID!) {
  deleteBasketById(basketId: $basketId)
}
`;