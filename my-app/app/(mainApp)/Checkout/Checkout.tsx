"use client";
import { CREATE_POINT_TRANSACTION } from "@/graphql/mutations";
import { useMutation, useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  GET_GOVERMENT_INFO,
  GET_POINT_SETTINGS
} from "../../../graphql/queries";
import Loading from "./loading";

import { useAuth } from "@/app/hooks/useAuth";
import {
  useCheckoutStore
} from "@/app/store/zustand";
import { Loader2 } from "lucide-react";
import { OrderSummary } from "./components/OrderSummary";
import Step1 from "./components/Step1/Step1";
import CheckoutForm from "./components/Step2/CheckoutForm";
import { StepIndicator } from "./components/StepIndicator";
import { useCheckout } from "./hooks/useCheckout";

// Define interfaces
interface Governorate {
  id: string;
  name: string;
}

interface Step {
  id: number;
  name: string;
}

interface CouponState {
  id: string;
  couponCode: string;
}
const Checkout = ({ userData, companyData }: any) => {
  // Step 1: Initialize state and hooks
  const [governmentInfo, setGovernmentInfo] = useState<Governorate[]>([]);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [coupon, setCoupon] = useState<CouponState>({ id: "", couponCode: "" });
  const deliveryPrice: number = companyData?.deliveringPrice ?? 8;
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<
    "CASH_ON_DELIVERY" | "CREDIT_CARD"
  >("CASH_ON_DELIVERY");
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const { decodedToken, isAuthenticated } = useAuth();

  const [createPointTransaction] = useMutation(CREATE_POINT_TRANSACTION);
  const { data: pointSettingsData } = useQuery(GET_POINT_SETTINGS);
  const { createCheckout, loading } = useCheckout(decodedToken, setSubmitLoading);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm({
    mode: "onChange",
  });

  const { checkoutProducts, checkoutTotal } = useCheckoutStore();

  const [isGuest, setIsGuest] = useState<boolean>(false);

  const steps: Step[] = [
    { id: 1, name: "Informations personnelles" },
    { id: 2, name: "Adresses" },
    { id: 3, name: "Mode De Livraison" },
    { id: 4, name: "Paiement" },
  ];


  useQuery(GET_GOVERMENT_INFO, {
    onCompleted: (data) => {
      setGovernmentInfo(data.allGovernorate);
    },
  });


  // Step 5: Set up side effects
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoggedIn(true);
      setCurrentStep(2);
      setIsGuest(false);
    } else {
      setIsLoggedIn(false);
      setIsGuest(true);
      setCurrentStep(1);
    }
  }, [isAuthenticated, decodedToken]);


  // Step 6: Define utility functions
  const calculateTotal = useCallback(() => {
    let subtotal = Number(checkoutTotal);
    const shippingCost = subtotal >= 499 ? 0 : deliveryPrice;

    if (discountPercentage > 0) {
      subtotal -= (subtotal * discountPercentage) / 100;
    }

    return (subtotal + shippingCost).toFixed(2);
  }, [checkoutTotal, deliveryPrice, discountPercentage]);



  // Step 7: Define event handlers
  const onSubmit = async (data: any) => {
    const userEmail = isGuest ? data.email : userData?.email;
    const userName = isGuest
      ? data.fullname
      : userData?.fullName;
    const cleanPhone1 = data.phone_1.replace(/\s+/g, '');
    const cleanPhone2 = data.phone_2 ? data.phone_2.replace(/\s+/g, '') : '';
    const userPhone = isGuest ? cleanPhone1 : userData?.number;
    const orderTotal = parseFloat(calculateTotal())

    const checkoutInput = {
      userId: decodedToken?.userId,
      userName: data.fullname,
      total: orderTotal,
      phone: [cleanPhone1, cleanPhone2].filter(Boolean),
      governorateId: data.governorate,
      address: data.address,
      couponsId: coupon.id,
      freeDelivery: Number(checkoutTotal) >= 499,
      isGuest: isGuest,
      products: checkoutProducts.map((product) => ({
        productId: product.id,
        productQuantity: product.actualQuantity || product.quantity,
        price: product.price,

        discountedPrice:
          product.productDiscounts && product.productDiscounts.length > 0
            ? product.productDiscounts[0].newPrice
            : 0,
      })),
      guestEmail: userEmail,
      deliveryComment: data.deliveryComment,
      paymentMethod: paymentMethod,
    };

    await createCheckout(checkoutInput, {
      userEmail,
      userName,
      userPhone,
      isGuest,
      paymentMethod,
      calculateTotal
    });


  };



  const handleNextStep = useCallback(async () => {
    const isValid = await trigger();
    if (isValid) {
      setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length));
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      console.log("Form is invalid:", errors);
    }
  }, []);


  const handlePreviousStep = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  }, []);

  // Step 8: Render component
  if (checkoutProducts.length === 0) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex justify-center flex-col items-center w-full my-10">
        <StepIndicator steps={steps} currentStep={currentStep} />

        <div className="container grid sm:px-10 w-full gap-20 xl:grid-cols-2 lg:px-20 xl:px-32">
          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-5 rounded-lg flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primaryColor" />
                <p className="mt-2 text-gray-700">
                  Redirection vers la page de paiement...
                </p>
              </div>
            </div>
          )}

          {submitLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-5 rounded-lg flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primaryColor" />
                <p className="mt-2 text-gray-700">
                  Redirection vers la page de Confirmation...
                </p>
              </div>
            </div>
          )}

          {/* Checkout Form Section */}
          <div>
            <div className="px-4 pt-8 pb-2 bg-white border">
              {currentStep === 1 && !isAuthenticated && (
                <Step1
                  setIsLoggedIn={setIsLoggedIn}
                  setCurrentStep={setCurrentStep}
                  setIsGuest={setIsGuest}
                  showLoginForm={showLoginForm}
                  setShowLoginForm={setShowLoginForm}
                />
              )}
              <CheckoutForm
                currentStep={currentStep}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                isValid={isValid}
                errors={errors}
                register={register}
                isLoggedIn={isLoggedIn}
                governmentInfo={governmentInfo}
                handlePreviousStep={handlePreviousStep}
                loading={loading}
                paymentLoading={loading}
                submitLoading={submitLoading}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            </div>
          </div>

          {/* Order Summary Section */}
          <OrderSummary
            checkoutProducts={checkoutProducts}
            setDiscountPercentage={setDiscountPercentage}
            discountPercentage={discountPercentage}
            setCoupon={setCoupon}
            deliveryPrice={deliveryPrice}
            total={checkoutTotal}
            calculateTotal={calculateTotal}
            handlePreviousStep={handlePreviousStep}
            isLoggedIn={isLoggedIn}
            handleNextStep={handleNextStep}
            currentStep={currentStep}
            isValid={isValid}
          />
        </div>
      </div>
    </>
  );
};

export default Checkout;
