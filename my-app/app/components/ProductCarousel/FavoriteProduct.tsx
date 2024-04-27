import { ADD_TO_FAVORITE_MUTATION } from "@/graphql/mutations";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const GET_FAVORITE_STATUS = gql`
  query FavoriteProducts($userId: ID!) {
    favoriteProducts(userId: $userId) {
      id
      productId
    }
  }
`;


const FavoriteProduct = ({
  productId,
  userId,
  isFavorite,
  setIsFavorite,
}: {
  productId: string;
  userId: string | undefined;
  isFavorite: boolean;
  setIsFavorite: any;
}) => {
  const { data: favoriteData, refetch: refetchFavorite } = useQuery(
    GET_FAVORITE_STATUS,
    {
      variables: {
        userId: userId,
      },
      skip: !userId,
    }
  );

  useEffect(() => {
    if (favoriteData && favoriteData.favoriteProducts.length > 0) {
      if (
        favoriteData.favoriteProducts.some(
          (fav: any) => fav.productId === productId
        )
      ) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    } else {
      setIsFavorite(false);
    }
  }, [favoriteData]);

  const [addToFavorite] = useMutation(ADD_TO_FAVORITE_MUTATION);

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
      {isFavorite ? <FaHeart color="red" /> : <FaRegHeart color="white" />}
    </div>
  );
};

export default FavoriteProduct;
