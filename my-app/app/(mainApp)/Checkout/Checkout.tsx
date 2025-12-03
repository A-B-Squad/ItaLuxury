"use client";
import { useQuery } from "@apollo/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  GET_GOVERMENT_INFO,
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
import { trackInitiateCheckout } from "@/utils/facebookEvents";
import { useBundles } from "@/app/hooks/useBundles";

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

  // Store authenticated user data locally
  const [authenticatedUserId, setAuthenticatedUserId] = useState<any>(null);


  const { createCheckout, loading } = useCheckout(setSubmitLoading);

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

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoggedIn(true);
      setCurrentStep(2);
      setIsGuest(false);
      // Set authenticated user from userData prop
      if (userData) {
        setAuthenticatedUserId(userData.id);
      }
    } else {
      setIsLoggedIn(false);
      setIsGuest(true);
      setCurrentStep(1);
      setAuthenticatedUserId(null);
    }
  }, [isAuthenticated, decodedToken, userData]);



  const cartItemsForBundles = useMemo(() => {
    return checkoutProducts.map((product: any) => ({
      productRef: product.reference || product.id,
      quantity: product.actualQuantity || product.quantity || 0,
      price: product.productDiscounts?.length > 0
        ? product.productDiscounts[0].newPrice
        : product.price,
      name: product.name
    }));
  }, [checkoutProducts]);

  const {
    applicableBundles,
    totalDiscount,
    hasFreeDelivery,
    loading: bundlesLoading
  } = useBundles(cartItemsForBundles);


  // Handler for auth success
  const handleAuthSuccess = useCallback((userId: any) => {
    setAuthenticatedUserId(userId);
  }, []);

  //  calculateTotal to include bundle discount
  const calculateTotal = useCallback(() => {
    let subtotal = Number(checkoutTotal);

    // Apply bundle discount FIRST
    subtotal -= totalDiscount;

    // Then check for free delivery
    const shippingCost = hasFreeDelivery || subtotal >= 499 ? 0 : deliveryPrice;

    // Then apply coupon discount if any
    if (discountPercentage > 0) {
      subtotal -= (subtotal * discountPercentage) / 100;
    }

    return (subtotal + shippingCost).toFixed(2);
  }, [checkoutTotal, totalDiscount, hasFreeDelivery, deliveryPrice, discountPercentage]);


  const onSubmit = async (data: any) => {
    const userEmail = isGuest ? data.email : userData?.email;
    const userName = isGuest ? data.fullname : userData?.fullName;
    const cleanPhone1 = data.phone_1.replaceAll(/\s+/g, '');
    const cleanPhone2 = data.phone_2 ? data.phone_2.replaceAll(/\s+/g, '') : '';
    const userPhone = isGuest ? cleanPhone1 : userData?.number;
    const orderTotal = Number.parseFloat(calculateTotal());
    const userCity = data.governorateName || data.governorate || "";

    // Get userId from multiple sources with priority
    const userId = authenticatedUserId || decodedToken?.userId || userData?.id;



    const checkoutInput = {
      userId: userId,
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

    createCheckout(checkoutInput, {
      userEmail,
      userName,
      userPhone,
      userCity,
      isGuest,
      paymentMethod,
      deliveryPrice,
      calculateTotal,
    });
  };

  const handleNextStep = useCallback(async () => {
    const isValid = await trigger();
    if (isValid) {
      setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length));
      globalThis.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      console.log("Form is invalid:", errors);
    }
  }, [trigger, errors, steps.length]);

  const handlePreviousStep = useCallback(() => {
    globalThis.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  }, []);



  useEffect(() => {
    if (!checkoutProducts || checkoutProducts.length === 0) return;

    const cartItems = checkoutProducts.map((product: any) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      quantity: product.actualQuantity || product.quantity || 1,
      description: product.description,
      Brand: product.Brand,
      Colors: product.Colors,
      categories: product.categories,
      productDiscounts: product.productDiscounts,
      inventory: product.inventory,
      isVisible: product.isVisible,
      reference: product.reference,
      images: product.images,
      technicalDetails: product.technicalDetails,
    }));

    const user = userData ? {
      id: authenticatedUserId || decodedToken?.userId || userData?.id,
      email: userData.email,
      firstName: userData.fullName?.split(' ')[0] || userData.fullName,
      lastName: userData.fullName?.split(' ').slice(1).join(' ') || '',
      phone: userData.number,
      country: "tn",
      city: userData.city || "",
    } : undefined;

    console.log('💰 Tracking InitiateCheckout event:', {
      product_count: cartItems.length,
      total_value: checkoutTotal,
      user: user ? 'logged_in' : 'guest'
    });

    trackInitiateCheckout(cartItems, Number(checkoutTotal), user)
      .then(() => {
        console.log('✅ InitiateCheckout event tracked successfully');
      })
      .catch(error => {
        console.error("❌ Error tracking initiate checkout:", error);
      });

  }, [checkoutProducts, checkoutTotal, userData, authenticatedUserId, decodedToken?.userId]);


  if (checkoutProducts.length === 0) {
    return <Loading />;
  }

  return (
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

        <div>
          <div className="px-4 pt-8 pb-2 bg-white border">
            {currentStep === 1 && !isAuthenticated && (
              <Step1
                setIsLoggedIn={setIsLoggedIn}
                setCurrentStep={setCurrentStep}
                setIsGuest={setIsGuest}
                showLoginForm={showLoginForm}
                setShowLoginForm={setShowLoginForm}
                onAuthSuccess={handleAuthSuccess}
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

          applicableBundles={applicableBundles}
          totalBundleDiscount={totalDiscount}
          hasFreeDelivery={hasFreeDelivery}
        />
      </div>
    </div>
  );
};

export default Checkout;