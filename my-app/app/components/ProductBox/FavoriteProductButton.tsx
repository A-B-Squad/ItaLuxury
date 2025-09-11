import React, { useState } from "react";
import FavoriteProduct from "../ProductCarousel/FavoriteProduct";

interface FavoriteProductButtonProps {
  isFavorite: boolean;
  setIsFavorite?: (value: boolean) => void;
  productId: string;
  productName: string;
  className?: string;
}

const FavoriteProductButton: React.FC<FavoriteProductButtonProps> = ({
  isFavorite,
  setIsFavorite = () => {},
  productId,
  productName,
  className = "",
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
    >
      <div
        className={`relative cursor-pointer ${className}`}
        title="Ajouter à ma liste d'envies"
      >
        <button
          type="button"
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          className={`flex items-center justify-center rounded-full transition-all duration-300 
          shadow-sm hover:shadow-md bg-white hover:bg-secondaryColor ${className || "p-2"}`}
        >
          <FavoriteProduct
            isFavorite={isFavorite}
            setIsFavorite={setIsFavorite}
            productId={productId}
            heartColor="black"
            heartSize={16}
            productName={productName}
          />
        </button>
      </div>
      
      {/* Custom tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 z-50 whitespace-nowrap">
          <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-md">
            {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          </div>
          <div className="w-2 h-2 bg-gray-800 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
    </div>
  );
};

export default React.memo(FavoriteProductButton);
