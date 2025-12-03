import { useToast } from "@/components/ui/use-toast";
import { FIND_UNIQUE_COUPONS } from "@/graphql/queries";
import { useLazyQuery } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { BiGift } from "react-icons/bi";
import { FaTag, FaTruck, FaShieldAlt, FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface OrderSummaryProps {
  checkoutProducts: ProductInCheckout[];
  total: number;
  discountPercentage: number;
  setDiscountPercentage: (percentage: number) => void;
  deliveryPrice: number;
  calculateTotal: () => string;
  setCoupon: (coupon: { id: string; couponCode: string }) => void;
  handlePreviousStep: () => void;
  isLoggedIn: boolean;
  handleNextStep: () => void;
  currentStep: number;
  isValid: boolean;
  applicableBundles?: any[];
  totalBundleDiscount?: number;
  hasFreeDelivery?: boolean;
}

interface ProductInCheckout {
  id: string;
  name: string;
  images: string[];
  price: number;
  quantity?: number;
  actualQuantity?: number;
  productDiscounts?: { newPrice: number }[];
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  checkoutProducts,
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
  applicableBundles = [],
  totalBundleDiscount = 0,
  hasFreeDelivery = false,
}) => {
  const { toast } = useToast();
  const [uniqueCouponsData] = useLazyQuery(FIND_UNIQUE_COUPONS);

  const [showInputCoupon, setShowInputCoupon] = useState<boolean>(false);
  const [changeCouponCode, setChangeCouponCode] = useState<string>("");
  const [isApplying, setIsApplying] = useState<boolean>(false);

  const handleCouponsVerification = async () => {
    if (changeCouponCode.length !== 10) {
      toast({
        title: "Code invalide",
        description: "Le code promo doit contenir 10 caractères",
        className: "bg-red-600 text-white",
      });
      return;
    }

    setIsApplying(true);
    try {
      const { data: uniqueCoupons } = await uniqueCouponsData({
        variables: { codeInput: changeCouponCode },
      });

      if (uniqueCoupons?.findUniqueCoupons) {
        setCoupon({
          id: uniqueCoupons.findUniqueCoupons.id,
          couponCode: changeCouponCode,
        });
        setDiscountPercentage(uniqueCoupons.findUniqueCoupons.discount);
        toast({
          title: "Code promo appliqué !",
          description: `Vous bénéficiez de ${uniqueCoupons.findUniqueCoupons.discount}% de réduction`,
          className: "bg-green-600 text-white",
        });
      } else {
        toast({
          title: "Code invalide",
          description: "Ce code promo est invalide ou a déjà été utilisé",
          className: "bg-red-600 text-white",
        });
      }
    } finally {
      setIsApplying(false);
    }
  };

  const handleCouponToggle = () => {
    setShowInputCoupon(!showInputCoupon);
    if (showInputCoupon) {
      setChangeCouponCode("");
      setDiscountPercentage(0);
      setCoupon({ id: "", couponCode: "" });
    }
  };



  const subtotal = Number(total);
  const shipping = hasFreeDelivery || subtotal >= 499 ? 0 : deliveryPrice;
  const discount = (subtotal * discountPercentage) / 100;

  return (
    <div className="flex flex-col gap-4">
      {/* Products List Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-primaryColor to-primaryColor/90 px-6 py-4">
          <h3 className="text-xl font-bold text-white">Récapitulatif</h3>
          <p className="text-white/90 text-sm mt-1">
            {checkoutProducts.length} article{checkoutProducts.length > 1 ? "s" : ""} dans votre panier
          </p>
        </div>

        <div className="p-6 max-h-[400px] overflow-y-auto space-y-4">
          {checkoutProducts.map((product: ProductInCheckout) => (
            <div
              key={product.id}
              className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex-shrink-0">
                <Image
                  className="w-20 h-20 rounded-lg object-cover border-2 border-white shadow-sm"
                  width={80}
                  height={80}
                  src={product.images[0]}
                  alt={product.name}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                  {product.name}
                </h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    Qté: {product.quantity || product.actualQuantity}
                  </span>
                  <span className="text-lg font-bold text-primaryColor">
                    {product.productDiscounts?.length
                      ? product.productDiscounts[0].newPrice.toFixed(2)
                      : product.price.toFixed(2)}{" "}
                    TND
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Coupon Section */}
          {currentStep === 2 && (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FaTag className="text-primaryColor" />
                  <span className="font-semibold text-gray-900">Code promo</span>
                </div>
                <button
                  type="button"
                  onClick={handleCouponToggle}
                  className="text-sm font-medium text-primaryColor hover:text-primaryColor/80 transition-colors"
                >
                  {showInputCoupon ? "Annuler" : "+ Ajouter"}
                </button>
              </div>

              {showInputCoupon && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 border-2 border-gray-200 px-4 py-2.5 text-sm rounded-xl outline-none focus:border-primaryColor transition-colors uppercase"
                      maxLength={10}
                      value={changeCouponCode}
                      onChange={(e) => setChangeCouponCode(e.target.value.toUpperCase())}
                      placeholder="PROMO2024"
                    />
                    <button
                      type="button"
                      disabled={isApplying}
                      onClick={handleCouponsVerification}
                      className="bg-primaryColor hover:bg-primaryColor/90 text-white font-medium rounded-xl px-5 py-2.5 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {isApplying ? "..." : "Appliquer"}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      {changeCouponCode.length}/10 caractères
                    </span>
                    {discountPercentage > 0 && (
                      <span className="text-green-600 font-semibold">
                        ✓ Code appliqué ({discountPercentage}%)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 🎯 BUNDLE PROMOTIONS SECTION */}
          {applicableBundles && applicableBundles.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <BiGift className="text-green-600 text-xl" />
                <span className="font-bold text-green-800">Offres actives</span>
              </div>
              <div className="space-y-2">
                {applicableBundles.map((evaluation: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {evaluation.bundle.name}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        ✓ {evaluation.message}
                      </p>
                    </div>
                    {evaluation.discount > 0 && (
                      <span className="text-green-600 font-bold">
                        -{evaluation.discount.toFixed(2)} TND
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Free Shipping Banner */}
          {subtotal < 499 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <FaTruck className="text-amber-600 text-xl mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">
                    Plus que {(499 - subtotal).toFixed(2)} TND pour la livraison gratuite !
                  </p>
                  <div className="mt-2 h-2 bg-amber-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-600 transition-all duration-300"
                      style={{ width: `${(subtotal / 499) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Price Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-gray-700">
              <span className="text-sm">Sous-total</span>
              <span className="font-semibold">{subtotal.toFixed(2)} TND</span>
            </div>

            {/* 🎯 ADD BUNDLE DISCOUNT LINE */}
            {totalBundleDiscount > 0 && (
              <div className="flex items-center justify-between text-green-600">
                <div className="flex items-center gap-2">
                  <BiGift />
                  <span className="text-sm">Réduction Bundle</span>
                </div>
                <span className="font-semibold">-{totalBundleDiscount.toFixed(2)} TND</span>
              </div>
            )}

            <div className="flex items-center justify-between text-gray-700">
              <div className="flex items-center gap-2">
                <FaTruck className="text-gray-400" />
                <span className="text-sm">Livraison</span>
              </div>
              <span className="font-semibold">
                {hasFreeDelivery ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <BiGift className="text-lg" />
                    Gratuit
                  </span>
                ) : shipping === 0 ? (
                  <span className="text-green-600">Gratuit</span>
                ) : (
                  `${shipping.toFixed(2)} TND`
                )}
              </span>
            </div>

            {discountPercentage > 0 && (
              <div className="flex items-center justify-between text-green-600">
                <div className="flex items-center gap-2">
                  <FaTag />
                  <span className="text-sm">Réduction code promo ({discountPercentage}%)</span>
                </div>
                <span className="font-semibold">-{discount.toFixed(2)} TND</span>
              </div>
            )}

            {/* 🎯 ADD TOTAL SAVINGS SUMMARY */}
            {(totalBundleDiscount > 0 || discountPercentage > 0) && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-green-800">
                    Vous économisez
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    {(totalBundleDiscount + discount).toFixed(2)} TND
                  </span>
                </div>
              </div>
            )}

            <div className="border-t-2 border-gray-200 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primaryColor">
                  {calculateTotal()} TND
                </span>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaShieldAlt className="text-green-600 text-lg" />
              <span>Paiement 100% sécurisé</span>
            </div>
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-500 leading-relaxed">
            En validant votre commande, vous acceptez nos{" "}
            <Link href="/Terms-of-use" className="text-primaryColor hover:underline">
              Conditions générales
            </Link>{" "}
            et notre{" "}
            <Link href="/Privacy-Policy" className="text-primaryColor hover:underline">
              Politique de confidentialité
            </Link>
            .
          </p>

          {/* Navigation Buttons */}
          {currentStep === 2 && (
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handlePreviousStep}
                disabled={isLoggedIn}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${isLoggedIn
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
              >
                <FaArrowLeft className="text-sm" />
                Précédent
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!isValid}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${isValid
                  ? "bg-primaryColor text-white hover:bg-primaryColor/90 shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                Suivant
                <FaArrowRight className="text-sm" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};