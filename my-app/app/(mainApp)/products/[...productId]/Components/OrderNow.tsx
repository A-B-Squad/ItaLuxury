"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GiShoppingBag } from "react-icons/gi";

import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import Image from "next/legacy/image";
import { CiMail, CiPhone, CiUser } from "react-icons/ci";

import { useToast } from "@/components/ui/use-toast";
import triggerEvents from "@/utlils/trackEvents";

import { CREATE_CHECKOUT_MUTATION } from "@/graphql/mutations";

import { useProductsInBasketStore } from "@/app/store/zustand";
import { Loader2 } from "lucide-react";
import { pushToDataLayer } from "@/utlils/pushToDataLayer";
import {
    BASKET_QUERY,
    COMPANY_INFO_QUERY,
    FETCH_USER_BY_ID,
    FIND_UNIQUE_COUPONS,
    GET_GOVERMENT_INFO,
} from "@/graphql/queries";
import Link from "next/link";
import { MdAddShoppingCart } from "react-icons/md";

// Define interfaces
interface DecodedToken extends JwtPayload {
    userId: string;
}

interface Product {
    id: string;
    name: string;
    images: string[];
    price: number;
    inventory: number;
    quantity: number;
    actualQuantity: number;
    productDiscounts: { newPrice: number }[];
}

interface Governorate {
    id: string;
    name: string;
}

interface OrderNowProps {
    productDetails: Product;
    ActualQuantity: number;
}

const OrderNow: React.FC<OrderNowProps> = ({
    productDetails,
    ActualQuantity,
}) => {
    // Step 1: Initialize state and hooks
    const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
    const [governmentInfo, setGovernmentInfo] = useState<Governorate[]>([]);
    const [discountPercentage, setDiscountPercentage] = useState<number>(0);
    const [couponsId, setCouponsId] = useState<string>("");
    const [deliveryPrice, setDeliveryPrice] = useState<number>(0);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

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
    const total =
        productDetails?.productDiscounts?.length > 0
            ? productDetails?.productDiscounts[0].newPrice * ActualQuantity
            : productDetails?.price * ActualQuantity;

    // Step 3: Set up GraphQL queries and mutations
    const [createCheckout, { loading }] = useMutation(CREATE_CHECKOUT_MUTATION);
    const [isGuest, setIsGuest] = useState<boolean>(false);

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

    // Step 5: Set up side effects
    useEffect(() => {
        const token = Cookies.get("Token");
        if (token) {
            const decoded = jwt.decode(token) as DecodedToken;
            setDecodedToken(decoded);
            setIsLoggedIn(true);
            setIsGuest(false);
        } else {
            setDecodedToken(null);
            setIsLoggedIn(false);
            setIsGuest(true);
        }
    }, []);

    // Step 6: Define utility functions
    const calculateTotal = (): string => {
        const subtotal = Number(total || 0);

        // Check if `subtotal` is valid
        if (isNaN(subtotal)) {
            throw new Error("Total must be a valid number");
        }

        const shippingCost = subtotal >= 499 ? 0 : deliveryPrice || 0;

        let discountedSubtotal = subtotal;
        if (discountPercentage && discountPercentage > 0) {
            discountedSubtotal -= (subtotal * discountPercentage) / 100;
        }

        const finalTotal = discountedSubtotal + shippingCost;

        return finalTotal.toFixed(3);
    };

    // Step 7: Define event handlers
    const onSubmit = async (data: any) => {
        const userEmail = isGuest ? data.email : userData?.fetchUsersById?.email;
        const userName = isGuest
            ? data.fullname
            : userData?.fetchUsersById?.fullName;
        const userPhone = isGuest ? data.phone_1 : userData?.fetchUsersById?.number;

        if (!isValid) {
            toast({
                title: "Erreur de validation",
                description: "Veuillez remplir tous les champs requis correctement.",
                variant: "destructive",
            });
            return;
        }

        if (loading) {
            toast({
                title: "En traitement",
                description:
                    "Votre demande est en cours de traitement. Veuillez patienter.",
                variant: "default",
            });
            return;
        }


        const checkoutInput = {
            userId: decodedToken?.userId,
            userName: data.fullname,
            total: parseFloat(calculateTotal()),
            phone: [data.phone_1, data.phone_2].filter(Boolean),
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
                        productDetails.productDiscounts &&
                            productDetails.productDiscounts.length > 0
                            ? productDetails.productDiscounts[0].newPrice
                            : 0,
                },
            ],
            guestEmail: userEmail,
            deliveryComment: data.deliveryComment,
            paymentMethod: "CASH_ON_DELIVERY",
        };
        console.log(checkoutInput);

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
                const customId = data.createCheckout.customId;

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
                        content_name: "OrderNow",
                        content_type: "product",
                        currency: "TND",
                        value: parseFloat(calculateTotal()),
                        contents: [
                            {
                                id: productDetails.id,
                                quantity: ActualQuantity,
                            },
                        ],
                        num_items: ActualQuantity,
                    },
                });


                router.replace(`/Checkout/EndCheckout?packageId=${customId}`);

            },
            onError: (error) => {
                console.error("OrderNow Error:", error);
                toast({
                    title: "Error",
                    description: "An error occurred during checkout. Please try again.",
                    variant: "destructive",
                });
            },
        });
    };



    const [uniqueCouponsData] = useLazyQuery(FIND_UNIQUE_COUPONS);

    const [showInputCoupon, setShowInputCoupon] = useState<boolean>(false);
    const [changeCouponCode, setChangeCouponCode] = useState<string>("");

    const handleCouponsVerification = async () => {
        if (changeCouponCode.length === 10) {
            const { data: uniqueCoupons } = await uniqueCouponsData({
                variables: { codeInput: changeCouponCode },
            });

            if (uniqueCoupons?.findUniqueCoupons) {
                setCouponsId(uniqueCoupons.findUniqueCoupons.id);
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
            setCouponsId("");
        }
    };

    return (
        <div className="  flex justify-center flex-col items-center w-full mt-10 ">


            {/* OrderNow Form Section */}
            <div className=" w-full p-4 pb-2 bg-white border-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {!isValid && Object.keys(errors).length > 0 && (
                        <p className="text-red-500 mb-4">
                            Veuillez remplir tous les champs requis correctement.
                        </p>
                    )}
                    <div className="flex flex-col w-full">
                        <div className="w-full">
                            <h2 className="text-2xl font-bold mb-4">
                                أشتري الآن
                            </h2>
                            <div className="inputs grid md:grid-cols-2 gap-2 ">
                                <div className="fullName">
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
                                        className="w-full rounded-md border border-gray-200 px-4 py-3 pl-1 text-sm shadow-sm outline-none focus:z-10 focus:border-mabg-primaryColor focus:ring-mabg-primaryColor"
                                        placeholder="Nom et prénom"
                                    />
                                    {errors.fullname && (
                                        <p className="text-red-500">
                                            {errors.fullname.message as string}
                                        </p>
                                    )}
                                </div>

                                <div className="address">
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
                                        className="w-full rounded-md border border-gray-200 px-4 py-3 pl-1 text-sm shadow-sm outline-none focus:z-10 focus:border-mabg-primaryColor focus:ring-mabg-primaryColor"
                                        placeholder="Saisissez votre adresse"
                                        rows={1}
                                    ></textarea>
                                    {errors.address && (
                                        <p className="text-red-500">Ce champ est requis</p>
                                    )}
                                </div>

                                {/* Phone 1 Input */}
                                <div className="phone1">
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
                                                pattern: {
                                                    value: /^[0-9]{8}$/,
                                                    message:
                                                        "Le numéro de téléphone doit comporter 8 chiffres",
                                                },
                                            })}
                                            placeholder="Numéro de téléphone"
                                        />
                                    </div>
                                    {errors.phone_1 && (
                                        <p className="text-red-500">
                                            {errors.phone_1.message as string}
                                        </p>
                                    )}
                                </div>
                                <div className="phone2">
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
                                                pattern: {
                                                    value: /^[0-9]{8}$/,
                                                    message:
                                                        "Le numéro de téléphone doit comporter 8 chiffres",
                                                },
                                            })}
                                            placeholder="Numéro de téléphone"
                                        />
                                    </div>

                                    {errors.phone_2 && (
                                        <p className="text-red-500">
                                            {errors.phone_2.message as string}
                                        </p>
                                    )}
                                </div>
                                {/* Governorate Selection */}
                                <div className="Governorate">
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
                                </div>
                                {/* Email Input (for guest users) */}
                                {!isLoggedIn && (
                                    <div className="email mt-6">
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
                                            Fournir votre email nous permettra de vous envoyer des
                                            mises à jour sur votre commande.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="DeliveryCommentmb-4">
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

                    <div className="PaymentConfermation bg-whit px-3 rounded-xl shado-lg">
                        <h2 className="text-xl font-bold mb-6 text-gray-800">
                            Confirmation et mode de paiement
                        </h2>




                        {/* Coupon Section */}
                        <div className="Coupons gap-2 mt-6 mb-3 md:px-4 ">
                            <div className="flex items-center justify-between gap-2 mb-2">
                                <label
                                    htmlFor="coupon"
                                    className="block text-sm font-semibold"
                                >
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

                        <div className="info md:px-4">
                            <div className="Total py-2 flex w-full items-center justify-between">
                                <p className="text-2xl font-medium text-gray-900">
                                    Total :
                                </p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {calculateTotal()} TND
                                </p>
                            </div>

                            {/* Terms and Conditions */}
                            <p className=" text-sm text-gray-600 ">
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
                        </div>

                        <div className="submit flex flex-col gap-2  w-full items-center mt-5">

                            <button
                                type="submit"
                                className={`${productDetails?.inventory <= 0 ? "cursor-not-allowed" : "cursor-pointer"} min-w-[250px] w-4/5 transition-opacity  py-4  shadow-lg bg-primaryColor hover:bg-opacity-80 text-white text-sm font-bold `}
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <GiShoppingBag size={20} />
                                        أشتري الآن
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default OrderNow;
