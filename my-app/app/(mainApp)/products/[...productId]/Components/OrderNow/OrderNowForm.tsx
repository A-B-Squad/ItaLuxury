"use client";
import { useMutation, useQuery } from "@apollo/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CiDeliveryTruck, CiLocationOn, CiMail, CiPhone, CiUser } from "react-icons/ci";
import { GiShoppingBag } from "react-icons/gi";

import { useToast } from "@/components/ui/use-toast";
import { CREATE_CHECKOUT_MUTATION, CREATE_POINT_TRANSACTION } from "@/graphql/mutations";
import triggerEvents from "@/utlils/events/trackEvents";


import {
    BASKET_QUERY,
    GET_GOVERMENT_INFO,
    GET_POINT_SETTINGS,
} from "@/graphql/queries";
import { useAuth } from "@/app/hooks/useAuth";
import { sendGTMEvent } from "@next/third-parties/google";
import { OrderSummary } from "./OrderSummary";


// Define interfaces
interface Governorate {
    id: string;
    name: string;
}

interface OrderNowProps {
    productDetails: Product;
    ActualQuantity: number;
    userData: any
    companyData: any
}

const OrderNow: React.FC<OrderNowProps> = ({
    productDetails,
    ActualQuantity,
    userData,
    companyData
}) => {
    // State management
    const { decodedToken, setDecodedToken, isAuthenticated } = useAuth();
    const [governmentInfo, setGovernmentInfo] = useState<Governorate[]>([]);
    const [discountPercentage, setDiscountPercentage] = useState<number>(0);
    const [couponsId, setCouponsId] = useState<string>("");
    const deliveryPrice: number = companyData?.deliveringPrice ?? 8;
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isGuest, setIsGuest] = useState<boolean>(true);
    const [createPointTransaction] = useMutation(CREATE_POINT_TRANSACTION);
    const { data: pointSettingsData } = useQuery(GET_POINT_SETTINGS);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        mode: "onChange",
    });

    const { toast } = useToast();
    const router = useRouter();

    // Calculate total
    const total =
        productDetails?.productDiscounts?.length > 0
            ? productDetails.productDiscounts[0].newPrice * ActualQuantity
            : productDetails?.price * ActualQuantity;


    const subtotal = Number(total || 0);
    const isFreeDelivery = subtotal >= 499;
    const shippingCost = isFreeDelivery ? 0 : deliveryPrice;


    // GraphQL setup
    const [createCheckout, { loading }] = useMutation(CREATE_CHECKOUT_MUTATION);

    // Fetch initial data
    const { data: governmentData } = useQuery(GET_GOVERMENT_INFO);




    useEffect(() => {
        if (governmentData?.allGovernorate) {
            setGovernmentInfo(governmentData.allGovernorate);
        }
    }, [governmentData]);

    // Authentication check
    useEffect(() => {
        if (isAuthenticated) {
            setIsLoggedIn(true);
            setIsGuest(false);
        } else {
            setDecodedToken(null);
            setIsLoggedIn(false);
            setIsGuest(true);
        }
    }, [isAuthenticated, setDecodedToken]);

    // Calculate total with discounts
    const calculateTotal = (): string => {
        const subtotal = Number(total || 0);
        if (isNaN(subtotal)) {
            throw new Error("Total must be a valid number");
        }

        const shippingCost = subtotal >= 499 ? 0 : deliveryPrice || 0;
        let discountedSubtotal = subtotal;

        if (discountPercentage && discountPercentage > 0) {
            discountedSubtotal -= (subtotal * discountPercentage) / 100;
        }

        const finalTotal = discountedSubtotal + shippingCost;
        return finalTotal.toFixed(2);
    };

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
    // Form submission handler

    const onSubmit = async (data: any) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        const userEmail = isGuest ? data.email : userData?.email;
        const userName = isGuest
            ? data.fullname
            : userData?.fullName;
        const cleanPhone1 = data.phone_1.replace(/\s+/g, '');
        const cleanPhone2 = data.phone_2 ? data.phone_2.replace(/\s+/g, '') : '';
        const userPhone = isGuest ? cleanPhone1 : userData?.number;

        try {
            setPaymentLoading(true);

            if (!isValid) {
                toast({
                    title: "Erreur de validation",
                    description: "Veuillez remplir tous les champs requis correctement.",
                    variant: "destructive",
                });
                setIsSubmitting(false);
                setPaymentLoading(false);
                return;
            }

            const checkoutInput = {
                userId: decodedToken?.userId,
                userName: data.fullname,
                total: parseFloat(calculateTotal()),
                phone: [cleanPhone1, cleanPhone2].filter(Boolean),
                governorateId: data.governorate,
                address: data.address,
                couponsId: couponsId,
                freeDelivery: Number(total) >= 499,
                isGuest: isGuest,
                products: [
                    {
                        productId: productDetails.id,
                        productQuantity: ActualQuantity,
                        price: productDetails.price,
                        discountedPrice:
                            productDetails.productDiscounts?.[0]?.newPrice || 0,
                    },
                ],
                guestEmail: userEmail,
                deliveryComment: data.deliveryComment,
                paymentMethod: "CASH_ON_DELIVERY",
            };

            // Store tracking data before making the API call
            const trackingData = {
                userEmail: userEmail?.toLowerCase() || '',
                userName: userName || '',
                userPhone: userPhone || '',
                governorateId: data.governorate,
                userId: decodedToken?.userId,
                productId: productDetails.id,
                quantity: ActualQuantity,
                totalValue: parseFloat(calculateTotal()),
            };

            const { data: checkoutData } = await createCheckout({
                variables: { input: checkoutInput },
                refetchQueries: [
                    {
                        query: BASKET_QUERY,
                        variables: { userId: decodedToken?.userId },
                    },
                ],
            });

            // Get the order ID from the response
            const customOrderId = checkoutData.createCheckout.customId;

            // Handle points transaction
            if (isLoggedIn && decodedToken?.userId) {
                try {
                    const pointSettings = pointSettingsData?.getPointSettings;
                    if (pointSettings && pointSettings.isActive) {
                        const pointsEarned = Math.floor(total * pointSettings.conversionRate);
                        if (pointsEarned > 0) {
                            await createPointTransaction({
                                variables: {
                                    input: {
                                        userId: decodedToken.userId,
                                        amount: pointsEarned,
                                        type: "EARNED",
                                        description: `Points gagnés pour la commande ${customOrderId} (${pointSettings.conversionRate * 100}% de ${total} TND)`,
                                        checkoutId: checkoutData.createCheckout.id
                                    }
                                }
                            });
                        }
                    }
                } catch (error) {
                    console.error("Error creating points transaction:", error);
                }
            }

            // Send notification
            await sendNotification(
                customOrderId,
                1,
                userName,
                productDetails?.productDiscounts?.length > 0
                    ? productDetails.productDiscounts[0].newPrice
                    : productDetails.price
            );

            // Track events
            triggerEvents("Purchase", {
                user_data: {
                    em: [trackingData.userEmail],
                    fn: [trackingData.userName],
                    ph: [trackingData.userPhone],
                    country: ["tn"],
                    ct: trackingData.governorateId,
                    external_id: trackingData.userId,
                },
                custom_data: {
                    content_name: "OrderNow",
                    content_type: "product_group",
                    content_category: "Checkout",
                    currency: "TND",
                    value: trackingData.totalValue,
                    contents: [{
                        id: trackingData.productId,
                        quantity: trackingData.quantity
                    }],
                    num_items: trackingData.quantity,
                },
            });

            sendGTMEvent({
                event: "purchase",
                ecommerce: {
                    currency: "TND",
                    value: trackingData.totalValue,
                    items: [
                        { id: trackingData.productId, quantity: trackingData.quantity }
                    ],
                    transaction_id: customOrderId,
                },
                user_data: {
                    em: [trackingData.userEmail],
                    fn: [trackingData.userName],
                    ph: [trackingData.userPhone],
                    country: ["tn"],
                    ct: trackingData.governorateId,
                    external_id: trackingData.userId
                },
                facebook_data: {
                    content_name: "OrderNow",
                    content_type: "product_group",
                    content_category: "Checkout",
                    currency: "TND",
                    value: trackingData.totalValue,
                    contents: [{
                        id: trackingData.productId,
                        quantity: trackingData.quantity
                    }],
                    num_items: trackingData.quantity,
                }
            });
            // Navigate to success page
            await router.replace(`/Checkout/EndCheckout?packageId=${customOrderId}`);

        } catch (error) {
            console.error("Checkout error:", error);
            toast({
                title: "Error",
                description:
                    "Une erreur s'est produite lors de la commande. Veuillez réessayer.",
                variant: "destructive",
            });
        } finally {
            setPaymentLoading(false);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="lg:hidden w-full mt-6 mb-10 relative z-[9999999]">
            {paymentLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
                    <div className="bg-white p-5 rounded-lg flex flex-col items-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primaryColor" />
                        <p className="mt-2 text-gray-700">
                            Traitement de votre commande...
                        </p>
                    </div>
                </div>
            )}

            <div className="w-full bg-white  border-gray-200  overflow-hidden relative z-[9999999]">


                <form onSubmit={handleSubmit(onSubmit)} className="p-4">
                    {!isValid && Object.keys(errors).length > 0 && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-600 text-sm font-medium">
                                Veuillez remplir tous les champs requis correctement.
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                            Informations personnelles
                        </h3>

                        {/* Full Name Input */}
                        <div>
                            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
                                <CiUser className="inline-block mr-2 mb-1" /> Nom et Prénom <span className="text-gray-500 text-xs">(الاسم واللقب)</span>
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                {...register("fullname", {
                                    required: "Ce champ est requis",
                                })}
                                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-primaryColor focus:ring-1 focus:ring-primaryColor relative z-[9999]"
                                placeholder="Nom et prénom"
                            />
                            {errors.fullname && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.fullname.message as string}
                                </p>
                            )}
                        </div>

                        {/* Address Input */}
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                <CiLocationOn className="inline-block mr-2 mb-1" /> Adresse <span className="text-gray-500 text-xs">(العنوان)</span>
                            </label>
                            <textarea
                                id="address"
                                {...register("address", {
                                    required: "L'adresse est requise",
                                })}
                                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-primaryColor focus:ring-1 focus:ring-primaryColor relative z-[9999]"
                                placeholder="Saisissez votre adresse complète"
                                rows={2}
                            ></textarea>
                            {errors.address && (
                                <p className="mt-1 text-sm text-red-600">
                                    Ce champ est requis
                                </p>
                            )}
                        </div>

                        {/* Phone 1 Input */}
                        <div>
                            <label htmlFor="phone_1" className="block text-sm font-medium text-gray-700 mb-1">
                                <CiPhone className="inline-block mr-2 mb-1" /> Téléphone 1 <span className="text-gray-500 text-xs">(الهاتف 1)</span>
                            </label>
                            <div className="flex items-center">
                                <span className="px-3 py-2.5 border border-r-0 rounded-l-md bg-gray-50 text-gray-600 text-sm">
                                    +216
                                </span>
                                <input
                                    type="tel"
                                    id="phone_1"
                                    className="w-full border border-gray-300 rounded-r-md px-4 py-2.5 text-gray-900 shadow-sm focus:border-primaryColor focus:ring-1 focus:ring-primaryColor relative z-[9999]"
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
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.phone_1.message as string}
                                </p>
                            )}
                        </div>

                        {/* Phone 2 Input */}
                        <div>
                            <label htmlFor="phone_2" className="block text-sm font-medium text-gray-700 mb-1">
                                <CiPhone className="inline-block mr-2 mb-1" /> Téléphone 2 <span className="text-gray-500 text-xs">(الهاتف 2)</span>
                                <span className="text-gray-500 text-xs ml-1">(optionnel)</span>
                            </label>
                            <div className="flex items-center">
                                <span className="px-3 py-2.5 border border-r-0 rounded-l-md bg-gray-50 text-gray-600 text-sm">
                                    +216
                                </span>
                                <input
                                    type="tel"
                                    id="phone_2"
                                    className="w-full border border-gray-300 rounded-r-md px-4 py-2.5 text-gray-900 shadow-sm focus:border-primaryColor focus:ring-1 focus:ring-primaryColor relative z-[9999]"
                                    {...register("phone_2", {
                                        validate: (value) => {
                                            if (!value) return true; // Optional field
                                            // Remove spaces for validation
                                            const cleaned = value.replace(/\s+/g, '');
                                            return cleaned.length === 8 && /^\d+$/.test(cleaned) ||
                                                "Le numéro de téléphone doit comporter 8 chiffres";
                                        }
                                    })}
                                    placeholder="Numéro de téléphone secondaire"
                                />
                            </div>
                            {errors.phone_2 && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.phone_2.message as string}
                                </p>
                            )}
                        </div>

                        {/* Governorate Selection */}
                        <div>
                            <label htmlFor="governorate" className="block text-sm font-medium text-gray-700 mb-1">
                                <CiLocationOn className="inline-block mr-2 mb-1" /> Governorat <span className="text-gray-500 text-xs">(الولاية)</span>
                            </label>
                            <select
                                id="governorate"
                                {...register("governorate", {
                                    required: "Veuillez sélectionner un gouvernorat",
                                })}
                                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-primaryColor focus:ring-1 focus:ring-primaryColor relative z-[9999]"
                            >
                                <option value="">Sélectionner un gouvernorat</option>
                                {governmentInfo.map((government: Governorate) => (
                                    <option key={government.id} value={government.id}>
                                        {government.name.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                            {errors.governorate && (
                                <p className="mt-1 text-sm text-red-600">
                                    Ce champ est requis
                                </p>
                            )}
                        </div>

                        {/* Email Input (for guest only) */}
                        {!isLoggedIn && (
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    <CiMail className="inline-block mr-2 mb-1" /> Email <span className="text-gray-500 text-xs">(البريد الإلكتروني)</span>
                                    <span className="text-gray-500 text-xs ml-1">(optionnel)</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    {...register("email", {
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Adresse e-mail invalide",
                                        },
                                    })}
                                    className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-primaryColor focus:ring-1 focus:ring-primaryColor relative z-[9999]"
                                    placeholder="votre@email.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.email.message as string}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Fournir votre email nous permettra de vous envoyer des mises à jour sur votre commande.
                                </p>
                            </div>
                        )}

                        {/* Delivery Comment */}
                        <div>
                            <label htmlFor="deliveryComment" className="block text-sm font-medium text-gray-700 mb-1">
                                <CiDeliveryTruck className="inline-block mr-2 mb-1" /> Commentaire pour la livraison <span className="text-gray-500 text-xs">(ملاحظات للتوصيل)</span>
                                <span className="text-gray-500 text-xs ml-1">(optionnel)</span>
                            </label>
                            <textarea
                                id="deliveryComment"
                                {...register("deliveryComment")}
                                rows={2}
                                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-primaryColor focus:ring-1 focus:ring-primaryColor relative z-[9999]"
                                placeholder="Instructions spéciales pour la livraison..."
                            ></textarea>
                        </div>
                    </div>

                    {/* Order Summary Section */}
                    <OrderSummary
                        productDetails={productDetails}
                        setDiscountPercentage={setDiscountPercentage}
                        discountPercentage={discountPercentage}
                        calculateTotal={calculateTotal}
                        setCouponsId={setCouponsId}
                        ActualQuantity={ActualQuantity}
                        subtotal={subtotal}
                        shippingCost={shippingCost}
                        isFreeDelivery={
                            isFreeDelivery
                        }
                        loading={loading}
                        isSubmitting={isSubmitting}
                    />

                </form>
            </div>
        </div>
    );
};

export default OrderNow;