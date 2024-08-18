import { gql } from "@apollo/client";

export const SIGNIN_MUTATION = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      token
      user {
        fullName
        email
      }
    }
  }
`;
export const CONTACT_US_MUTATION = gql`
mutation CreateContactUs($input: ContactUsInput!) {
  createContactUs(input: $input)
}
`;
export const SIGNUP_MUTATION = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      user {
        id
        fullName
        email
      }
      token
    }
  }
`;
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
export const ADD_MULTIPLE_TO_BASKET_MUTATION = gql`
mutation Mutation($input: AddMultipleToBasketInput!) {
  addMultipleToBasket(input: $input)
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

export const INCREASE_QUANTITY_MUTATION = gql`
  mutation IncreaseQuantity($basketId: ID!) {
    increaseQuantity(basketId: $basketId) {
      id
      userId
      quantity
    }
  }
`;

export const DECREASE_QUANTITY_MUTATION = gql`
  mutation DecreaseQuantity($basketId: ID!) {
    decreaseQuantity(basketId: $basketId) {
      id
      userId
      productId
      quantity
    }
  }
`;
export const CREATE_CHECKOUT_MUTATION = gql`
 mutation CreateCheckout($input: CreateCheckoutInput!) {
  createCheckout(input: $input)
}
`;

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($password: String, $resetPasswordId: String) {
    resetPassword(password: $password, id: $resetPasswordId)
  }
`;
