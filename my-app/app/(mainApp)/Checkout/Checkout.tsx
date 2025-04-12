"use client";
import { useMutation, useQuery } from "@apollo/client";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CiMail, CiPhone, CiUser } from "react-icons/ci";

import { useToast } from "@/components/ui/use-toast";
import triggerEvents from "@/utlils/trackEvents";
import Loading from "./loading";

import { CREATE_CHECKOUT_MUTATION } from "@/graphql/mutations";
import {
  BASKET_QUERY,
  COMPANY_INFO_QUERY,
  FETCH_USER_BY_ID,
  GET_GOVERMENT_INFO,
} from "../../../graphql/queries";

import {
  useCheckoutStore,
  useProductsInBasketStore,
} from "@/app/store/zustand";
import { Loader2 } from "lucide-react";
import { OrderSummary } from "./components/OrderSummary";
import Step1 from "./components/Step1/Step1";
import { StepIndicator } from "./components/StepIndicator";
import { sendGTMEvent } from "@next/third-parties/google";
import { useAuth } from "@/lib/auth/useAuth";

// Define interfaces


interface Product {
  id: string;
  name: string;
  images: string[];
  price: number;
  quantity?: number;
  actualQuantity?: number;
  productDiscounts?: { newPrice: number }[];
}

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
const Checkout: React.FC = () => {
  // Step 1: Initialize state and hooks
  const [governmentInfo, setGovernmentInfo] = useState<Governorate[]>([]);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [coupon, setCoupon] = useState<CouponState>({ id: "", couponCode: "" });
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<
    "CASH_ON_DELIVERY" | "CREDIT_CARD"
  >("CASH_ON_DELIVERY");
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const { clearBasket } = useProductsInBasketStore();
  const { decodedToken, isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm({
    mode: "onChange",
  });

  const { toast } = useToast();
  const router = useRouter();

  // Notification step
  // Step 2: Parse URL parameters
  const { checkoutProducts, checkoutTotal } = useCheckoutStore();

  // Step 3: Set up GraphQL queries and mutations
  const [createCheckout, { loading }] = useMutation(CREATE_CHECKOUT_MUTATION);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  const steps: Step[] = [
    { id: 1, name: "Informations personnelles" },
    { id: 2, name: "Adresses" },
    { id: 3, name: "Mode De Livraison" },
    { id: 4, name: "Paiement" },
  ];

  // Step 4: Fetch initial data
  useQuery(COMPANY_INFO_QUERY, {
    onCompleted: (companyData) => {
      setDeliveryPrice(companyData.companyInfo.deliveringPrice);
    },
  });

  useQuery(GET_GOVERMENT_INFO, {
    onCompleted: (data) => {
      setGovernmentInfo(data.allGovernorate);
    },
  });

  const { data: userData } = useQuery(FETCH_USER_BY_ID, {
    variables: { userId: decodedToken?.userId },
    skip: !decodedToken?.userId,
  });
  console.log(userData);


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

    return (subtotal + shippingCost).toFixed(3);
  }, [checkoutTotal, deliveryPrice, discountPercentage]);


  const sendNotification = async (
    orderId: string,
    productsNumber: number,
    userName: string,
    orderTotal: number
  ) => {
    try {
      const response = await fetch("/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          productsNumber,
          userName,
          orderTotal,
        }),
      });

      if (response.ok) {
        console.log("Notification sent successfully!");
      } else {
        console.error("Failed to send notification:", await response.json());
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  // Step 7: Define event handlers
  const onSubmit = async (data: any) => {
    const userEmail = isGuest ? data.email : userData?.fetchUsersById?.email;
    const userName = isGuest
      ? data.fullname
      : userData?.fetchUsersById?.fullName;

    const cleanPhone1 = data.phone_1.replace(/\s+/g, '');
    const cleanPhone2 = data.phone_2 ? data.phone_2.replace(/\s+/g, '') : '';
    const userPhone = isGuest ? cleanPhone1 : userData?.fetchUsersById?.number;

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




    const totalItems = checkoutProducts.reduce(
      (sum, product) => sum + (product?.actualQuantity || product?.quantity || 0),
      0
    );

    // Calculate correct product value including discounts
    const itemsWithPrices = checkoutProducts.map(product => ({
      item_name: product.name,
      item_category: product.categories?.[0]?.name || '',
      id: product.reference,
      quantity: product.actualQuantity || product.quantity,
      price: product.productDiscounts?.length > 0
        ? Number(product.productDiscounts[0].newPrice)
        : Number(product.price)
    }));
    console.log(decodedToken);
    console.log(checkoutInput);

    // Calculate final value including delivery if applicable
    const finalValue = Number(orderTotal);
    createCheckout({
      variables: {
        input: checkoutInput,
      },
      refetchQueries: [
        {
          query: BASKET_QUERY,
          variables: { userId: decodedToken?.userId },
        },
      ],
      onCompleted: async (data) => {
        const customOrderId = data.createCheckout.customId;
        clearBasket();

        sendGTMEvent({
          event: "purchase",
          ecommerce: {
            currency: "TND",
            value: finalValue,
            items: itemsWithPrices,
            transaction_id: customOrderId,
          },
          user_data: {
            em: [userEmail.toLowerCase()],
            fn: [userName],
            ph: [userPhone],
            country: ["tn"],
            ct: checkoutInput.governorateId,
            external_id: decodedToken?.userId
          },
          facebook_data: {
            currency: "TND",
            value: finalValue,
            content_type: "product_group",
            contents: itemsWithPrices,
            content_name: "Purchase",
            num_items: totalItems,
            content_category: "Checkout",
            delivery_category: checkoutInput.freeDelivery ? "free_shipping" : "shipping",
            payment_method: paymentMethod === "CREDIT_CARD" ? "credit_card" : "cash_on_delivery",
            transaction_id: customOrderId
          }
        });
        triggerEvents("Purchase", {
          user_data: {
            em: [userEmail.toLowerCase()],
            fn: [userName],
            ph: [userPhone],
            country: ["tn"],
            ct: checkoutInput.governorateId,
            external_id: decodedToken?.userId,
          },
          custom_data: {
            currency: "TND",
            value: finalValue,
            content_type: "product_group",
            contents: itemsWithPrices,
            content_name: "Purchase",
            num_items: totalItems,
            content_category: "Checkout",
            delivery_category: checkoutInput.freeDelivery ? "free_shipping" : "shipping",
            payment_method: paymentMethod === "CREDIT_CARD" ? "credit_card" : "cash_on_delivery",
            transaction_id: customOrderId
          },
        })

        if (paymentMethod === "CREDIT_CARD") {
          sendGTMEvent({
            event: "add_payment_info",
            ecommerce: {
              currency: "TND",
              value: parseFloat(calculateTotal()),
              payment_type: paymentMethod === "CREDIT_CARD" ? "Credit Card" : "Cash on Delivery",
              items: checkoutProducts
            },
            user_data: {
              em: [userEmail.toLowerCase()],
              fn: [userName],
              ph: [userPhone],
              country: ["tn"],
              ct: checkoutInput.governorateId,
              external_id: decodedToken?.userId
            },
            facebook_data: {
              content_category: "Checkout",
              currency: "TND",
              value: parseFloat(calculateTotal()),
              payment_type: paymentMethod === "CREDIT_CARD" ? "Credit Card" : "Cash on Delivery"
            }
          });
          triggerEvents("AddPaymentInfo", {
            user_data: {
              em: [userEmail.toLowerCase()],
              fn: [userName],
              ph: [userPhone],
              country: ["tn"],
              ct: checkoutInput.governorateId,
              external_id: decodedToken?.userId,
            },
            custom_data: {
              content_category: "Checkout",
              currency: "TND",
              value: parseFloat(calculateTotal()),
              payment_type: paymentMethod === "CREDIT_CARD" ? "Credit Card" : "Cash on Delivery",
            },
          });

          await handleOnlinePayment(customOrderId, userName, userPhone, userEmail);
        } else {
          setSubmitLoading(true);
          sendNotification(customOrderId, checkoutProducts.length, userName, orderTotal)
          router.replace(`/Checkout/EndCheckout?packageId=${customOrderId}`);
        }
      },
      onError: (error) => {
        console.error("Checkout Error:", error);
        toast({
          title: "Error",
          description: "An error occurred during checkout. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  const handleOnlinePayment = async (
    orderId: string,
    userName: string,
    userPhone: string,
    userEmail: string
  ) => {
    if (paymentMethod === "CREDIT_CARD") {
      setPaymentLoading(true);
      const orderTotal = Math.round(Number(calculateTotal()) * 1000)

      try {
        const response = await fetch("/api/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: "TND",
            amount: orderTotal,
            type: "immediate",
            description: "Online payment for order",
            acceptedPaymentMethods: ["wallet", "bank_card", "e-DINAR"],
            lifespan: 10,
            checkoutForm: false,
            addPaymentFeesToAmount: true,
            firstName: userName.split(" ")[0] || "",
            lastName: userName.split(" ")[1] || "",
            phoneNumber: userPhone,
            email: userEmail,
            orderId: `${orderId}`,
            webhook: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/api/webhook/payment?packageId=${orderId}&status=PAYED_NOT_DELIVERED`,
            silentWebhook: true,
            successUrl: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/Checkout/EndCheckout?packageId=${orderId}&status=PAYED_NOT_DELIVERED`,
            failUrl: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/Checkout/EndCheckout?packageId=${orderId}&status=PAYMENT_REFUSED`,
            theme: "light",
          }),
        });

        // Check if the response is not OK (status code 200-299)
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Payment initialization error:", errorData);
          toast({
            title: "Error",
            description: `Payment initialization failed: ${errorData.message || "Unknown error"}`,
            variant: "destructive",
          });
          setPaymentLoading(false);
          return;
        }

        const data = await response.json();

        // Redirect to the payment URL if provided
        if (data.payUrl) {
          sendNotification(orderId, checkoutProducts.length, userName, orderTotal)
          window.location.href = data.payUrl;
        } else {
          throw new Error("No payment URL received");
        }
      } catch (error) {
        // Catch both errors from fetch and thrown errors
        console.error("Payment initialization failed:", error);
        toast({
          title: "Error",
          description: `Unable to process CREDIT_CARD payment: ${error}`,
          variant: "destructive",
        });
        setPaymentLoading(false);
      } finally {
        // Ensure loading state is turned off in any case
        setPaymentLoading(false);
      }
    }
  };

  const handleNextStep = async () => {
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
  };

  const handlePreviousStep = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  // Step 8: Render component
  if (checkoutProducts.length === 0) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex justify-center flex-col items-center w-full my-10">
        <StepIndicator steps={steps} currentStep={currentStep} />

        <div className="container grid sm:px-10 w-full gap-20 xl:grid-cols-2 lg:px-20 xl:px-32">
          {paymentLoading && (
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
              <form onSubmit={handleSubmit(onSubmit)}>
                {!isValid && Object.keys(errors).length > 0 && (
                  <p className="text-red-500 mb-4">
                    Veuillez remplir tous les champs requis correctement.
                  </p>
                )}
                {currentStep === 2 && (
                  <div className="flex flex-col w-full">
                    <div className="w-full">
                      <h2 className="text-2xl font-bold mb-4">
                        Adresse de livraison
                      </h2>

                      {/* Full Name Input */}
                      <label
                        htmlFor="fullname"
                        className="mt-4 mb-2 block text-sm font-medium"
                      >
                        <CiUser className="inline-block mr-2 mb-1" /> Nom et
                        Prénom
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        {...register("fullname", {
                          required: "Ce champ est requis",
                        })}
                        className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-mabg-primaryColor focus:ring-mabg-primaryColor"
                        placeholder="Nom et prénom"
                      />
                      {errors.fullname && (
                        <p className="text-red-500">
                          {errors.fullname.message as string}
                        </p>
                      )}

                      {/* Email Input (for guest users) */}
                      {!isLoggedIn && (
                        <div className="mt-6">
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                          >
                            <CiMail className="inline-block mr-2 align-text-bottom" />{" "}
                            Email (optionnel)
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                              type="email"
                              id="email"
                              {...register("email", {
                                pattern: {
                                  value:
                                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  message: "Adresse e-mail invalide",
                                },
                              })}
                              className="border border-gray-300 rounded-r-md px-4 py-2 w-full focus:outline-none "
                              placeholder="votre@email.com"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <CiMail
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </div>
                          </div>
                          {errors.email && (
                            <p
                              className="mt-2 text-sm text-red-600"
                              id="email-error"
                            >
                              {errors.email.message as string}
                            </p>
                          )}
                          <p
                            className="mt-2 text-sm text-gray-500"
                            id="email-description"
                          >
                            Fournir votre email nous permettra de vous envoyer
                            des mises à jour sur votre commande.
                          </p>
                        </div>
                      )}

                      {/* Phone 1 Input */}
                      <label
                        htmlFor="phone_1"
                        className="mt-4 mb-2 block text-sm font-medium"
                      >
                        <CiPhone className="inline-block mr-2 mb-1" /> Téléphone
                        1
                      </label>
                      <div className="flex items-center">
                        <span className="px-3 py-2 border border-r-0 rounded-l-md bg-gray-100 text-gray-600">
                          +216
                        </span>
                        <input
                          type="tel"
                          id="phone_1"
                          className="border border-gray-300 rounded-r-md px-4 py-2 w-full focus:outline-none "
                          {...register("phone_1", {
                            required: "Ce champ est requis",
                            validate: (value) => {
                              // Remove spaces for validation
                              const cleaned = value.replace(/\s+/g, '');
                              return cleaned.length === 8 && /^\d+$/.test(cleaned) || 
                                "Le numéro de téléphone doit comporter 8 chiffres";
                            }
                          })}
                          placeholder="Numéro de téléphone"
                        />
                      </div>

                      {errors.phone_1 && (
                        <p className="text-red-500">
                          {errors.phone_1.message as string}
                        </p>
                      )}

                      {/* Phone 2 Input (Optional) */}
                      <label
                        htmlFor="phone_2"
                        className="mt-4 mb-2 block text-sm font-medium"
                      >
                        <CiPhone className="inline-block mr-2 mb-1" /> Téléphone
                        2 (optional)
                      </label>
                      <div className="flex items-center">
                        <span className="px-3 py-2 border border-r-0 rounded-l-md bg-gray-100 text-gray-600">
                          +216
                        </span>
                        <input
                          type="tel"
                          id="phone_2"
                          className="border border-gray-300 rounded-r-md px-4 py-2 w-full focus:outline-none "
                          {...register("phone_2", {
                            validate: (value) => {
                              if (!value) return true; // Optional field
                              // Remove spaces for validation
                              const cleaned = value.replace(/\s+/g, '');
                              return cleaned.length === 8 && /^\d+$/.test(cleaned) || 
                                "Le numéro de téléphone doit comporter 8 chiffres";
                            }
                          })}
                          placeholder="Numéro de téléphone"
                        />
                      </div>

                      {errors.phone_2 && (
                        <p className="text-red-500">
                          {errors.phone_2.message as string}
                        </p>
                      )}

                      {/* Governorate Selection */}
                      <label
                        htmlFor="governorate"
                        className="mt-4 mb-2 block text-sm font-medium"
                      >
                        Governorat
                      </label>
                      <select
                        id="governorate"
                        {...register("governorate", {
                          required: "Veuillez sélectionner un gouvernorat",
                        })}
                        className="w-full px-4 py-3 rounded-md border border-gray-200 bg-white text-sm shadow-sm outline-none focus:z-10 focus:border-mabg-primaryColor focus:ring-mabg-primaryColor"
                      >
                        <option value="">Sélectionner une governorat</option>
                        {governmentInfo.map((government: Governorate) => (
                          <option key={government.id} value={government.id}>
                            {government.name.toUpperCase()}
                          </option>
                        ))}
                      </select>
                      {errors.governorate && (
                        <p className="text-red-500">Ce champ est requis</p>
                      )}

                      {/* Address Input */}
                      <label
                        htmlFor="address"
                        className="mt-4 mb-2 block text-sm font-medium"
                      >
                        Adresse
                      </label>
                      <textarea
                        id="address"
                        {...register("address", {
                          required: "L'adresse est requise",
                        })}
                        className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-mabg-primaryColor focus:ring-mabg-primaryColor"
                        placeholder="Saisissez votre adresse"
                        rows={3}
                      ></textarea>
                      {errors.address && (
                        <p className="text-red-500">Ce champ est requis</p>
                      )}

                      <div className="mb-8">
                        <label
                          htmlFor="deliveryComment"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Commentaire pour la livraison (optionnel)
                        </label>
                        <textarea
                          id="deliveryComment"
                          {...register("deliveryComment")}
                          rows={4}
                          className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm outline-none focus:border-primaryColor focus:ring-1 focus:ring-primaryColor"
                          placeholder="Ajoutez des instructions spéciales pour la livraison ici..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="bg-whit p-3 rounded-xl shado-lg">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                      Confirmation et mode de paiement
                    </h2>

                    <div className="flex items-center justify-center mb-8">
                      <div className="bg-gray-50 p-4 rounded-full">
                        <Image
                          width={60}
                          height={60}
                          objectFit="contain"
                          src="/jaxDelivery.png"
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
                            <label key={method} className="relative block">
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
                                objectFit="contain"
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
                                objectFit="contain"
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
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Order Summary Section */}
          <OrderSummary
            products={checkoutProducts}
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
