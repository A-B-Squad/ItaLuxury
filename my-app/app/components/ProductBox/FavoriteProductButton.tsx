import React from "react";
import FavoriteProduct from "../ProductCarousel/FavoriteProduct";

interface FavoriteProductButtonProps {
  isFavorite: boolean;
  setIsFavorite: (value: boolean) => void;
  productId: string;
  userId?: string;
  productName: string;
}

const FavoriteProductButton: React.FC<FavoriteProductButtonProps> = ({
  isFavorite,
  setIsFavorite,
  productId,
  userId,
  productName,
}) => (
  <div
    className="Favorite relative w-fit cursor-crosshair"
    title="Ajouter à ma liste d'envies"
  >
    <li className="bg-primaryColor rounded-full delay-200 lg:translate-x-20 group-hover:translate-x-0 transition-all p-2 shadow-md hover:bg-secondaryColor">
      <FavoriteProduct
        isFavorite={isFavorite}
        setIsFavorite={setIsFavorite}
        productId={productId}
        userId={userId}
        heartColor=""
        heartSize={16}
        productName={productName}
      />
    </li>
  </div>
);

export default FavoriteProductButton;
