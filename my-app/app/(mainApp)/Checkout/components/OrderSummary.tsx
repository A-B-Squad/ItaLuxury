import { useToast } from "@/components/ui/use-toast";
import { FIND_UNIQUE_COUPONS } from "@/graphql/queries";
import { useLazyQuery } from "@apollo/client";
import Image from "next/legacy/image";
import Link from "next/link";
import React, { useState } from "react";
interface OrderSummaryProps {
  products: Product[];
  total: number;
  discountPercentage: number;
  setDiscountPercentage: (percentage: number) => void;
  deliveryPrice: number;
  calculateTotal: () => string;
  setCoupon: (coupon: { id: string; couponCode: string }) => void;
  handlePreviousStep: any;
  isLoggedIn: any;
  handleNextStep: any;
  currentStep: number;
  isValid: boolean;
}
interface Product {
  id: string;
  name: string;
  images: string[];
  price: number;
  quantity?: number;
  actualQuantity?: number;
  productDiscounts?: { newPrice: number }[];
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  products,
  setDiscountPercentage,
  discountPercentage,
  deliveryPrice,
  calculateTotal,
  total,
  setCoupon,
  handlePreviousStep,
  isLoggedIn,
  handleNextStep,
  currentStep,
  isValid,
}) => {
  const { toast } = useToast();
  const [uniqueCouponsData] = useLazyQuery(FIND_UNIQUE_COUPONS);

  const [showInputCoupon, setShowInputCoupon] = useState<boolean>(false);
  const [changeCouponCode, setChangeCouponCode] = useState<string>("");

  const handleCouponsVerification = async () => {
    if (changeCouponCode.length === 10) {
      const { data: uniqueCoupons } = await uniqueCouponsData({
        variables: { codeInput: changeCouponCode },
      });

      if (uniqueCoupons?.findUniqueCoupons) {
        setCoupon({
          id: uniqueCoupons.findUniqueCoupons.id,
          couponCode: changeCouponCode,
        });
        setDiscountPercentage(uniqueCoupons.findUniqueCoupons.discount);
      } else {
        toast({
          title: "Code Promo",
          description: "Code promo invalide ou déjà utilisé",
          className: "bg-red-800 text-white",
        });
      }
    } else {
      toast({
        title: "Code Promo",
        description: "Code promo invalide",
        className: "bg-red-800 text-white",
      });
    }
  };

  const handleCouponToggle = () => {
    setShowInputCoupon(!showInputCoupon);
    if (showInputCoupon) {
      setChangeCouponCode("");
      setDiscountPercentage(0);
      setCoupon({
        id: "",
        couponCode: "",
      });
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="p-8 bg-white h-fit overflow-hidden">
        <p className="text-xl font-medium">Récapitulatif de la commande</p>
        <p className="text-gray-400">Vérifiez vos articles.</p>
        <div className="mt-8 space-y-3 divide-y-2 shadow-sm h-full max-h-[500px] overflow-y-auto px-2 py-4 sm:px-6">
          {products.map((product: Product) => (
            <div
              className="flex flex-col shadow py-2 bg-white sm:flex-row"
              key={product.id}
            >
              <Image
                className="m-2 h-24 w-28 rounded-md border object-center"
                width={112}
                height={96}
                objectFit="contain"
                src={product.images[0]}
                alt={product.name}
              />
              <div className="flex w-full flex-col px-4 py-4">
                <span className="font-semibold">{product.name}</span>
                <p className="mt-auto text-lg font-bold">
                  {product.productDiscounts?.length
                    ? product.productDiscounts[0].newPrice.toFixed(2)
                    : product.price.toFixed(2)}{" "}
                  TND
                </p>
                <p className="mt-auto text-lg font-md text-gray-400">
                  Quantité: {product.quantity || product.actualQuantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="summury bg-white border p-8">
        {/* Coupon Section */}
        {currentStep == 2 && (
          <div className="Coupons my-6">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="coupon" className="block text-sm font-semibold">
                Code promo
              </label>
              <button
                type="button"
                className="text-secondaryColor hover:text-blue-800 text-sm font-medium"
                onClick={handleCouponToggle}
              >
                {showInputCoupon ? "Annuler" : "Ajouter"}
              </button>
            </div>
            {showInputCoupon && (
              <div className="bg-gray-100 p-4 rounded-md">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="flex-grow border-2 px-3 py-2 text-sm rounded-md outline-none"
                    maxLength={10}
                    value={changeCouponCode}
                    onChange={(e) => setChangeCouponCode(e.target.value)}
                    placeholder="Saisissez un code de promo"
                  />
                  <button
                    type="button"
                    className="bg-primaryColor hover:bg-secondaryColor text-white font-medium rounded-md px-4 py-2 text-sm transition-colors duration-100"
                    onClick={handleCouponsVerification}
                  >
                    Appliquer
                  </button>
                </div>
                <p className="text-sm mt-2 text-gray-600">
                  {changeCouponCode.length}/10 caractères
                </p>
              </div>
            )}
          </div>
        )}

        {/* Terms and Conditions */}
        <p className=" text-sm text-gray-600">
          En passant à la caisse, vous acceptez nos{" "}
          <Link
            href="/Terms-of-use"
            className="text-primaryColor hover:underline"
          >
            Termes de service
          </Link>{" "}
          et confirmez que vous avez lu notre{" "}
          <Link
            href="/Privacy-Policy"
            className="text-primaryColor hover:underline"
          >
            Politique de confidentialité
          </Link>
          .
        </p>

        {/* Order Summary */}
        <div className="mt-6 border-t border-b py-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">Sous-total</p>
            <p className="font-semibold text-gray-900">
              {Number(total).toFixed(2)} TND
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">Expédition</p>
            <p className="font-semibold text-gray-900">
              {Number(total) >= 499
                ? "Gratuit"
                : `${deliveryPrice.toFixed(2)} TND`}
            </p>
          </div>
          {discountPercentage > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Remise</p>
              <p className="font-semibold text-green-600">
                -{((Number(total) * discountPercentage) / 100).toFixed(2)} TND (
                {discountPercentage}%)
              </p>
            </div>
          )}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900">Total</p>
          <p className="text-2xl font-semibold text-gray-900">
            {calculateTotal()} TND
          </p>
        </div>
      </div>
      {currentStep == 2 && (
        <div className="NextStep flex items-center justify-evenly mt-2">
          <button
            type="button"
            onClick={handlePreviousStep}
            disabled={isLoggedIn}
            className={`px-4 py-2 bg-gray-200 text-gray-800 rounded-md transition-all duration-300 ${isLoggedIn ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
              }`}
          >
            Précédent
          </button>
          <button
            type="button"
            onClick={handleNextStep}
            className={`px-4 py-2 bg-primaryColor text-white rounded-md hover:opacity-80 transition-all duration-300 ${!isValid ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
};
