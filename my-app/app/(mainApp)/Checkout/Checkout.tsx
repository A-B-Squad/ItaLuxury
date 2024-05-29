"use client";
import { useMutation, useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CiPhone, CiUser } from "react-icons/ci";
import { useForm } from "react-hook-form"; // Import useForm from react-hook-form
import { CREATE_CHECKOUT_MUTATION } from "../../../graphql/mutations";
import Image from "next/legacy/image";
import { GET_GOVERMENT_INFO } from "../../../graphql/queries";
import { useSearchParams } from "next/navigation";
import Loading from "./loading";

interface DecodedToken extends JwtPayload {
  userId: string;
}

const Checkout = () => {
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [GovermentInfo, setGovermentInfo] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const searchParams = useSearchParams();
  const total = searchParams?.get("total") || "0";
  const products = JSON.parse(searchParams?.get("products") || "[]");
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);

  const [createCheckout] = useMutation(CREATE_CHECKOUT_MUTATION);

  useQuery(GET_GOVERMENT_INFO, {
    onCompleted: (data) => {
      setGovermentInfo(data.allGovernorate);
    },
  });

  const onSubmit = (data: any) => {
    // Handle form submission here
    if (!decodedToken) return;

    // Validate phone number
    const phoneRegex = /^[0-9]*$/;
    if (!phoneRegex.test(data.phone)) {
      console.error("Invalid phone number");
      return;
    }

    createCheckout({
      variables: {
        input: {
          userId: decodedToken.userId,
          userName: data.fullName,
          total: total,
          phone: Number(data.phone),
          governorateId: data.governorate,
          address: data.address,
        },
      },
      onCompleted: () => {
        router.push("/Home");
      },
    });
  };

  return (
    <>
      {products.length === 0 ? (
        <Loading />
      ) : (
        <div className="flex justify-center items-center w-full my-10">
          <div className="grid sm:px-10 place-content-between w-full gap-20 lg:grid-cols-2 lg:px-20 xl:px-32 ">
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
                        {goverment.name}
                      </option>
                    ),
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
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Total</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {Number(total).toFixed(3)} TND
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
