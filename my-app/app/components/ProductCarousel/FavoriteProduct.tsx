import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const GET_FAVORITE_STATUS = gql`
  query FavoriteProducts($userId: ID!) {
    favoriteProducts(userId: $userId) {
      id
      productId
    }
  }
`;

const ADD_TO_FAVORITE = gql`
  mutation AddProductToFavorite($input: AddProductToFavoriteInput!) {
    addProductToFavorite(input: $input) {
      id
      productId
      userId
    }
  }
`;
const FavoriteProduct = ({ productId, userId }: { productId: string; userId: string | undefined; }) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const { data: favoriteData, refetch: refetchFavorite } = useQuery(
    GET_FAVORITE_STATUS,
    {
      variables: {
        userId: userId ? userId : "",
        productId: productId,
      },
      skip: !userId,
    }
  );

  useEffect(() => {
    if (favoriteData && favoriteData.favoriteProducts.length > 0) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [favoriteData]);

  const [addToFavorite] = useMutation(ADD_TO_FAVORITE);

  const handleToggleFavorite = () => {
    if (!userId) {
      alert("Please login to add to favorites.");
      return;
    }

    addToFavorite({
      variables: {
        input: {
          userId: userId,
          productId: productId,
        },
      },
      onCompleted: () => {
        refetchFavorite();
        setIsFavorite(!isFavorite);
      },
    });
  };

  return (
    <div onClick={handleToggleFavorite}>
      {isFavorite ? (
        <FaHeart color="red" />
      ) : (
        <FaRegHeart color="white" />
      )}
    </div>
  );
};

export default FavoriteProduct;
