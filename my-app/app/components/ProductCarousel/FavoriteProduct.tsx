import { useAuth } from "@/app/hooks/useAuth";
import { ProductData } from "@/app/types";
import { useToast } from "@/components/ui/use-toast";
import { ADD_DELETE_PRODUCT_FAVORITE_MUTATION } from "@/graphql/mutations";
import { GET_FAVORITE_STATUS } from "@/graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const FavoriteProduct = ({
  productName,
  productId,
  isFavorite,
  setIsFavorite,
  heartColor,
  heartSize,
}: {
  productName: string;
  productId: string;
  isFavorite: boolean;
  setIsFavorite: any;
  heartColor: string;
  heartSize: number;
}) => {
  const { decodedToken, isAuthenticated } = useAuth();

  const { data: favoriteData, refetch: refetchFavorite } = useQuery(
    GET_FAVORITE_STATUS,
    {
      variables: {
        userId: decodedToken?.userId,
      },
      skip: !isAuthenticated,
    },
  );

  const { toast } = useToast();

  useEffect(() => {
    if (favoriteData && favoriteData.favoriteProducts.length > 0) {
      if (
        favoriteData.favoriteProducts.some(
          (fav: ProductData) => fav.productId === productId,
        )
      ) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    } else {
      setIsFavorite(false);
    }
  }, [favoriteData, productId]);

  const [addToFavorite] = useMutation(ADD_DELETE_PRODUCT_FAVORITE_MUTATION);

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast({
        title: "Produit ajouté aux favoris",
        description:
          "Vous devez vous connecter pour ajouter un produit aux favoris.",
        className: "bg-red-800 text-white",
      });
      return;
    }

    addToFavorite({
      variables: {
        input: {
          userId: decodedToken?.userId,
          productId: productId,
        },
      },
      onCompleted: () => {
        refetchFavorite();
        setIsFavorite(!isFavorite);
        toast({
          title: "Produit ajouté aux favoris",
          description: `Le produit "${productName}" a été ajouté à vos favoris.`,
          className: "bg-primaryColor text-white",
        });
      },
    });
  };

  return (
    <div
      onClick={handleToggleFavorite}
      className="cursor-pointer"
      key={productId}
    >
      {isFavorite ? (
        <FaHeart size={heartSize || ""} color="red" />
      ) : (
        <FaRegHeart size={heartSize || ""} color={heartColor || "white"} />
      )}
    </div>
  );
};

export default FavoriteProduct;
