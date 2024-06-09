"use client";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CiPhone, CiUser } from "react-icons/ci";
import { useForm } from "react-hook-form";
import { CREATE_CHECKOUT_MUTATION } from "../../../graphql/mutations";
import Image from "next/legacy/image";
import {
  FIND_UNIQUE_COUPONS,
  GET_GOVERMENT_INFO,
} from "../../../graphql/queries";
import { useSearchParams } from "next/navigation";
import Loading from "./loading";
import { useToast } from "@/components/ui/use-toast";
import { useBasketStore } from "@/app/store/zustand";

interface DecodedToken extends JwtPayload {
  userId: string;
}

const Checkout = () => {
  // State declarations
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [GovermentInfo, setGovermentInfo] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const searchParams = useSearchParams();
  const router = useRouter();
  const total = searchParams?.get("total") || "0";
  const products = JSON.parse(searchParams?.get("products") || "[]");
  const [showInputCoupon, setShowInputCoupon] = useState<Boolean>(false);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [couponsId, setCouponsId] = useState<String>("");
  const { toast } = useToast();
  const toggleIsUpdated = useBasketStore((state) => state.toggleIsUpdated);
  const [changeCouponCode, setChangeCouponCode] = useState<string>("");

  const [uniqueCouponsData] = useLazyQuery(FIND_UNIQUE_COUPONS);

  // Decode the JWT token on component mount
  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);

  // Mutation to create a new checkout
  const [createCheckout] = useMutation(CREATE_CHECKOUT_MUTATION);

  // Query to get the government information
  useQuery(GET_GOVERMENT_INFO, {
    onCompleted: (data) => {
      setGovermentInfo(data.allGovernorate);
    },
  });

  // Handle form submission
  const onSubmit = (data: any) => {
    if (!decodedToken) return;

    // Validate phone number
    const phoneRegex = /^[0-9]*$/;
    if (!phoneRegex.test(data.phone)) {
      console.error("Invalid phone number");
      return;
    }

    // Calculate the discounted total
    const discountedTotal = discountPercentage
      ? (+total - (+total * discountPercentage) / 100).toFixed(3)
      : Number(total).toFixed(3);

    // Create the checkout mutation
    createCheckout({
      variables: {
        input: {
          userId: decodedToken.userId,
          userName: data.fullname,
          total: parseFloat(discountedTotal),
          phone: Number(data.phone),
          governorateId: data.governorate,
          address: data.address,
          couponsId: couponsId,
        },
      },
      onCompleted: () => {
        router.push("/");
        toggleIsUpdated();
      },
    });
  };

  // Handle coupon verification
  const handleCouponsVerification = async () => {
    if (changeCouponCode.length === 30) {
      const { data: uniqueCoupons } = await uniqueCouponsData({
        variables: {
          codeInput: changeCouponCode,
        },
      });

      if (uniqueCoupons && uniqueCoupons.findUniqueCoupons) {
        const couponsId = uniqueCoupons.findUniqueCoupons.id;
        const validCoupon = uniqueCoupons.findUniqueCoupons.discount;
        setCouponsId(couponsId);
        setDiscountPercentage(validCoupon);
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
        description: "Code promo invalide ",
        className: "bg-red-800 text-white",
      });
    }
  };

  // Calculate the total with discounts applied
  const calculateTotal = () => {
    if (discountPercentage) {
      return (+total - (+total * discountPercentage) / 100).toFixed(3);
    }
    return Number(total).toFixed(3);
  };

  return (
    <>
      {products.length === 0 ? (
        <Loading />
      ) : (
        <div className="flex justify-center items-center w-full my-10">
          <div className=" container grid sm:px-10  w-full gap-20 xl:grid-cols-2 lg:px-20 xl:px-32 ">
            <div className="px-4 pt-8 ">
              <p className="text-xl font-medium">
                Récapitulatif de la commande
              </p>
              <p className="text-gray-400">Vérifiez vos articles.</p>
              <div className="mt-8 space-y-3 divide-y-2 shadow-sm rounded-lg border bg-white px-2 py-4 sm:px-6">
                {products.map((product: any) => (
                  <div
                    className="flex flex-col rounded-lg bg-white sm:flex-row"
                    key={product.id}
                  >
                    <Image
                      className="m-2 h-24 w-28 rounded-md border  object-center"
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
                          ? product.productDiscounts[0].newPrice.toFixed(3)
                          : product.price.toFixed(3)}{" "}
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
            <div className="px-4 pt-8  ">
              <form onSubmit={handleSubmit(onSubmit)}>
                <label
                  htmlFor="fullname"
                  className="mt-4 mb-2 block text-sm font-medium"
                >
                  <CiUser className="inline-block mr-2 mb-1" /> Nom et Prénom
                </label>
                <input
                  type="text"
                  id="fullName"
                  {...register("fullname", { required: true })}
                  className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nom et prénom"
                />
                {errors.fullname && (
                  <p className="text-red-500">Ce champ est requis</p>
                )}

                <label
                  htmlFor="phone"
                  className="mt-4 mb-2 block text-sm font-medium"
                >
                  <CiPhone className="inline-block mr-2 mb-1" /> Téléphone
                </label>
                <input
                  type="text"
                  id="phone"
                  {...register("phone", {
                    required: true,
                    pattern: /^[0-9]{8}$/,
                  })}
                  className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm uppercase shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="+216 12 345 678"
                />
                {errors.phone && (
                  <p className="text-red-500">
                    Le numéro de téléphone doit comporter 8 chiffres
                  </p>
                )}

                <label
                  htmlFor="governorate"
                  className="mt-4 mb-2 block text-sm font-medium"
                >
                  Governorat
                </label>
                <select
                  id="governorate"
                  {...register("governorate")}
                  className="w-full px-2 outline-none py-2 text-gray-700 bg-gray-200 rounded"
                >
                  <option value="">Sélectionner une governorat</option>
                  {GovermentInfo.map(
                    (goverment: { id: string; name: string }) => (
                      <option key={goverment.id} value={goverment.id}>
                        {goverment.name.toUpperCase()}
                      </option>
                    )
                  )}{" "}
                </select>

                <label
                  htmlFor="address"
                  className="mt-4 mb-2 block text-sm font-medium"
                >
                  Adresse
                </label>
                <textarea
                  id="address"
                  {...register("address")}
                  className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm uppercase shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Saisissez votre adresse"
                ></textarea>
                <div className="Coupons flex flex-col gap-3  ">
                  <div className="flex gap-1 items-center ">
                    <label
                      htmlFor="address"
                      className=" block text-sm font-semibold"
                    >
                      Code promo
                    </label>
                    <button
                      type="button"
                      className="text-blue-800 font-semibold text-sm"
                      onClick={() => {
                        setShowInputCoupon(!showInputCoupon);
                      }}
                    >
                      {showInputCoupon ? "Annuler" : "Afficher"}
                    </button>
                  </div>
                  {showInputCoupon && (
                    <div className="bg-gray-100  w-fit px-8 py-6  flex flex-col gap-3">
                      <div className="inputs flex items-start  gap-2 ">
                        <div className="flex flex-col ">
                          <input
                            type="text"
                            className="border-2 px-3 py-2 text-sm w-72 outline-none "
                            maxLength={30}
                            onChange={(e) => {
                              if (changeCouponCode.length < 30) {
                                setChangeCouponCode(e.target.value);
                              }
                            }}
                            placeholder="Saisissez un code de promo"
                          />
                          <p className="text-sm ml-5 mt-2">
                            {changeCouponCode.length}/30
                          </p>
                        </div>
                        <button
                          type="button"
                          className="bg-blue-800 hover:bg-blue-500 transition-all font-semibold rounded-md text-white px-3 py-2 text-sm"
                          onClick={handleCouponsVerification}
                        >
                          Appliquer
                        </button>
                      </div>
                      <p className="font-normal text-sm leading-6">
                        En passant à la caisse, vous acceptez nos{" "}
                        <span className="text-blue-800 font-semibold">
                          Termes de service
                        </span>{" "}
                        et confirmez que vous avez lu nos{" "}
                        <span className="text-blue-800 font-semibold">
                          Politique de confidentialité.
                        </span>{" "}
                        Vous pouvez annuler les paiements récurrents à tout
                        moment.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 border-t border-b py-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      Total du commande
                    </p>
                    <p className="font-semibold text-gray-900">
                      {Number(total) >= 499
                        ? Number(total).toFixed(3)
                        : (Number(total) - 8).toFixed(3)}{" "}
                      TND
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      Expédition
                    </p>
                    <p className="font-semibold text-gray-900">
                      {" "}
                      {Number(total) >= 499 ? "Gratuit" : "8.000 TND"}
                    </p>
                  </div>
                  {discountPercentage > 0 && (
                    <p className="text-strongBeige font-normal ">
                      <span className="text-sm font-medium text-gray-900">
                        Code Promo:
                      </span>{" "}
                      Vous avez reçu une remise de {discountPercentage}%.
                    </p>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Total</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {calculateTotal()} TND
                  </p>
                </div>

                <button
                  type="submit"
                  className="mt-4 mb-8 w-full rounded-md bg-strongBeige px-6 py-3 font-medium text-white"
                >
                  Passer la commande
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;
