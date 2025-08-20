import { gql } from "@apollo/client";

export const SIGNIN_MUTATION = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      userId
      token
    }
  }
`;
export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($Token: String!) {
    refreshToken(Token: $Token)
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
      userId
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

export const ADD_REVIEWS_MUTATION = gql`
  mutation AddReview($productId: ID!, $userId: ID, $rating: Int!, $comment: String, $userName: String) {
    AddReview(input: {
      productId: $productId, 
      userId: $userId, 
      rating: $rating,
      comment: $comment,
      userName: $userName
    })
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

export const ADD_DELETE_PRODUCT_FAVORITE_MUTATION = gql`
  mutation AddDeleteProductToFavorite(
    $input: AddDeleteProductToFavoriteInput!
  ) {
    addDeleteProductToFavorite(input: $input) {
      id
      userId
      productId
    }
  }
`;
export const UPDATE_STATUS_PAYMENT_ONLINE_MUTATION = gql`
  mutation UpdateStatusPayOnlinePackage($packageId: ID!, $paymentStatus: Status) {
    updateStatusPayOnlinePackage(
      packageId: $packageId
      paymentStatus: $paymentStatus
    )
  }
`;

export const CREATE_CHECKOUT_MUTATION = gql`
  mutation CreateCheckout($input: CreateCheckoutInput!) {
    createCheckout(input: $input) {
      customId
      orderId
    }
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

export const CREATE_POINT_TRANSACTION = gql`
  mutation CreatePointTransaction($input: PointTransactionInput!) {
    createPointTransaction(input: $input) {
      id
      amount
      type
      description
      createdAt
    }
  }
`;
