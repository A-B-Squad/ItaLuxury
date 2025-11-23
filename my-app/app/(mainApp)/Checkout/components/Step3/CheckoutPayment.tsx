import { Loader2 } from 'lucide-react';
import Image from "next/image";

import React from 'react';

interface CheckoutPaymentProps {
  isValid: boolean;
  handlePreviousStep: () => void;
  loading: boolean;
  paymentLoading: boolean;
  submitLoading: boolean;
  paymentMethod: "CASH_ON_DELIVERY" | "CREDIT_CARD";
  setPaymentMethod: (method: "CASH_ON_DELIVERY" | "CREDIT_CARD") => void;
}
const CheckoutPayment: React.FC<CheckoutPaymentProps> = ({
  isValid,
  handlePreviousStep,
  loading,
  paymentLoading,
  submitLoading,
  paymentMethod,
  setPaymentMethod
}) => {
  return (
    <div className="bg-whit p-3 rounded-xl shado-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Confirmation et mode de paiement
      </h2>

      <div className="flex items-center justify-center mb-8">
        <div className="bg-gray-50 p-4 rounded-full">
          <Image
            width={60}
            height={60}
            style={{ objectFit: "contain" }}
            src="/images/delivery/jax-delivery.webp"
            alt="JAX Delivery Logo"
          />
        </div>
        <p className="text-xl font-semibold text-gray-900 ml-4">
          JAX Delivery
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Choisissez votre mode de paiement
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["CASH_ON_DELIVERY", "CREDIT_CARD"].map(
            (method: any) => (
              <label
                htmlFor={`paymentMethod-${method}`}
                key={method} className="relative block">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                  className="sr-only peer"
                />
                <div
                  className="flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer
                            peer-checked:border-primaryColor peer-checked:bg-primaryColor/10
                            hover:bg-gray-50 peer-checked:hover:bg-primaryColor/20"
                >
                  <span className="font-medium peer-checked:text-primaryColor">
                    {method === "CASH_ON_DELIVERY"
                      ? "Paiement à la livraison"
                      : "Paiement en ligne"}
                  </span>
                </div>
                <div
                  className="absolute top-4 right-4 w-4 h-4 rounded-full border-2 border-gray-300
                            peer-checked:border-primaryColor peer-checked:bg-primaryColor"
                ></div>
              </label>
            )
          )}
        </div>
        {paymentMethod && (
          <p className="text-sm text-gray-600 mt-2">
            {paymentMethod === "CASH_ON_DELIVERY"
              ? "Paiement comptant à la livraison (Cash on delivery)"
              : "Vous serez redirigé vers la plateforme de paiement sécurisée"}
          </p>
        )}

        {paymentMethod === "CREDIT_CARD" && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 bg-white p-2 rounded-md shadow-sm">
                <Image
                  src="https://res.cloudinary.com/dc1cdbirz/image/upload/v1727700751/ita-luxury/v3zblfgu80imeompvsln.jpg"
                  alt="Visa/Mastercard"
                  width={60}
                  style={{ objectFit: "contain" }}
                  height={30}
                />
                <span className="text-sm text-gray-600">
                  Bank card
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-white p-2 rounded-md shadow-sm">
                <Image
                  src="https://res.cloudinary.com/dc1cdbirz/image/upload/v1727700582/ita-luxury/syy63ssuq7to8u3aufhw.png"
                  alt="E-Dinar"
                  width={60}
                  height={30}
                  style={{ objectFit: "contain" }}
                />
                <span className="text-sm text-gray-600">
                  E-Dinar Card
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={handlePreviousStep}
          className="px-6 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Précédent
        </button>
        <button
          type="submit"
          disabled={
            !isValid ||
            loading ||
            paymentLoading ||
            submitLoading ||
            !paymentMethod
          }
          className={`px-6 py-2 bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primaryColor ${!isValid || loading || !paymentMethod
            ? "opacity-50 cursor-not-allowed"
            : ""
            }`}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Confirmer la commande"
          )}
        </button>
      </div>
    </div>)
}

export default CheckoutPayment