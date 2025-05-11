import React, { useState } from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import { Check, Loader2, Tag } from "lucide-react";
import { FIND_UNIQUE_COUPONS } from "@/graphql/queries";
import { useLazyQuery } from "@apollo/client";
import { useToast } from "@/components/ui/use-toast";
import { GiShoppingBag } from "react-icons/gi";
interface OrderSummaryProps {
  products: Product[];
  total: string;
  discountPercentage: number;
  setDiscountPercentage: (percentage: number) => void;
  deliveryPrice: number;
  calculateTotal: () => string;
  setCouponsId: (id: string) => void;
  handlePreviousStep: any
  isLoggedIn: any
  handleNextStep: any
  currentStep: number
  isValid: boolean

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

export const OrderSummary: React.FC<any> = ({
  productDetails,
  setDiscountPercentage,
  discountPercentage,
  calculateTotal,
  setCouponsId,
  subtotal,
  shippingCost,
  isFreeDelivery,
  ActualQuantity,
  loading,
  isSubmitting
}) => {
  const { toast } = useToast();

  // Coupon handling

  const [uniqueCouponsData] = useLazyQuery(FIND_UNIQUE_COUPONS);

  const [showInputCoupon, setShowInputCoupon] = useState<boolean>(false);
  const [changeCouponCode, setChangeCouponCode] = useState<string>("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState<boolean>(false);

  const handleCouponsVerification = async () => {
    try {
      setIsValidatingCoupon(true);
      
      // Allow any coupon length, not just 10 characters
      if (changeCouponCode.trim()) {
        const { data: uniqueCoupons } = await uniqueCouponsData({
          variables: { codeInput: changeCouponCode },
        });

        if (uniqueCoupons?.findUniqueCoupons) {
          setCouponsId(uniqueCoupons.findUniqueCoupons.id);
          setDiscountPercentage(uniqueCoupons.findUniqueCoupons.discount);
          toast({
            title: "Code Promo",
            description: "Code promo appliqué avec succès",
            className: "bg-green-800 text-white",
          });
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
          description: "Veuillez saisir un code promo",
          className: "bg-red-800 text-white",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification du code",
        className: "bg-red-800 text-white",
      });
    } finally {
      setIsValidatingCoupon(false);
    }
  };
  const handleCouponToggle = () => {
    setShowInputCoupon(!showInputCoupon);
    if (showInputCoupon) {
      setChangeCouponCode("");
      setDiscountPercentage(0);
      setCouponsId("");
    }
  };

  return (
    <div className="mt-8 pt-4 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Récapitulatif
      </h3>

      {/* Product Summary - Simplified */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md mb-4">
        {productDetails.images?.[0] && (
          <img
            src={productDetails.images[0]}
            alt={productDetails.name}
            className="w-16 h-16 object-contain border border-gray-200 rounded-md bg-white"
          />
        )}
        <div>
          <h4 className="font-medium text-gray-800 line-clamp-1">{productDetails.name}</h4>
          <p className="text-sm text-gray-500">Qté: {ActualQuantity}</p>
          <div className="flex items-center gap-2 mt-1">
            {productDetails.productDiscounts?.length > 0 ? (
              <>
                <span className="text-gray-400 line-through text-sm">
                  {productDetails.price.toFixed(3)} TND
                </span>
                <span className="text-red-600 font-medium">
                  {productDetails.productDiscounts[0].newPrice.toFixed(3)} TND
                </span>
              </>
            ) : (
              <span className="font-medium">
                {productDetails.price.toFixed(3)} TND
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Coupon Section - Simplified */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <Tag size={16} className="inline mr-2" /> Code promo
          </label>
          <button
            type="button"
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${showInputCoupon
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-primaryColor text-white hover:bg-secondaryColor shadow-sm hover:shadow"
              }`}
            onClick={handleCouponToggle}
            aria-expanded={showInputCoupon}
          >
            {showInputCoupon ? "Annuler" : "Ajouter"}
          </button>
        </div>

        {showInputCoupon && (
          <div className="p-3 bg-gray-50 rounded-md animate-fadeIn">
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="flex-grow border border-gray-300 px-3 py-2 text-sm rounded-md focus:border-primaryColor focus:ring-1 focus:ring-primaryColor"
                maxLength={10}
                value={changeCouponCode}
                onChange={(e) => setChangeCouponCode(e.target.value.toUpperCase())}
                placeholder="Saisir code promo"
                autoFocus
                autoComplete="off"
              />
              <button
                type="button"
                className={`bg-primaryColor hover:bg-secondaryColor text-white font-medium rounded-md px-4 py-2 text-sm transition-colors ${!changeCouponCode.trim() || isValidatingCoupon ? 'opacity-70 cursor-not-allowed' : ''}`}
                onClick={handleCouponsVerification}
                disabled={!changeCouponCode.trim() || isValidatingCoupon}
              >
                {isValidatingCoupon ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Appliquer"
                )}
              </button>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                {changeCouponCode.length}/10
              </p>
              {discountPercentage > 0 && (
                <p className="text-green-600 text-sm font-medium flex items-center">
                  <Check size={14} className="mr-1" /> -{discountPercentage}% appliqué
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Price Breakdown - Simplified */}
      <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
        <div className="flex justify-between text-sm text-gray-700">
          <p>Sous-total</p>
          <p className="font-medium">{subtotal.toFixed(3)} TND</p>
        </div>

        <div className="flex justify-between text-sm">
          <div className="flex flex-col">
            <p className="text-gray-700">Livraison</p>
            {isFreeDelivery && (
              <span className="text-green-600 text-xs flex items-center">
                <Check size={12} className="mr-1" /> Livraison gratuite à partir de 499 TND
              </span>
            )}
          </div>
          <p className={isFreeDelivery ? "text-green-600 font-medium" : "font-medium"}>
            {isFreeDelivery ? "0.000" : `${shippingCost.toFixed(3)}`} TND
          </p>
        </div>

        {discountPercentage > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <p>Réduction ({discountPercentage}%)</p>
            <p className="font-medium">-{((subtotal * discountPercentage) / 100).toFixed(3)} TND</p>
          </div>
        )}
      </div>

      <div className="py-3 flex w-full items-center justify-between mb-4">
        <p className="text-lg font-medium text-gray-900">Total</p>
        <p className="text-xl font-bold text-primaryColor">
          {calculateTotal()} TND
        </p>
      </div>

      <div className="submit flex flex-col w-full items-center mt-5">
        <button
          type="submit"
          disabled={productDetails?.inventory <= 0 || isSubmitting || loading}
          className={`
            ${productDetails?.inventory <= 0 || isSubmitting || loading
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-opacity-90 active:scale-[0.98] transition-transform"
            } 
            min-w-[250px] w-4/5 transition-all py-4 shadow-lg 
            bg-primaryColor text-white text-sm font-bold rounded-md
          `}
          aria-busy={loading || isSubmitting}
        >
          {loading || isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
          ) : (
            <div className="flex items-center justify-center gap-2">
              <GiShoppingBag size={20} />
              Acheter maintenant
            </div>
          )}
        </button>

        {/* Payment method info - Simplified */}
        <div className="payment-info mt-4 w-4/5 bg-gray-50 p-3 rounded-md border border-gray-200">
          <div className="flex items-center">
            <input
              type="radio"
              id="cash"
              name="paymentMethod"
              className="h-4 w-4 text-primaryColor"
              checked
              readOnly
            />
            <label htmlFor="cash" className="ml-2 text-sm font-medium text-gray-700">
              Paiement à la livraison
            </label>
          </div>
        </div>

        {/* Trust badges - Simplified */}
        <div className="trust-badges mt-4 w-4/5 flex flex-wrap justify-center gap-3 p-2">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-gray-700">Paiement sécurisé</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 113 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V8a1 1 0 00-.293-.707l-3-3A1 1 0 0016 4H3z" />
            </svg>
            <span className="text-xs text-gray-700">Livraison rapide</span>
          </div>
          {isFreeDelivery && (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-green-600">Livraison gratuite</span>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 text-center mt-4 w-4/5">
          En commandant, vous acceptez nos <Link href="/Terms-of-use" className="text-primaryColor hover:underline">conditions</Link> et <Link href="/Privacy-Policy" className="text-primaryColor hover:underline">politique de confidentialité</Link>.
        </p>
      </div>
    </div>
  );
};
