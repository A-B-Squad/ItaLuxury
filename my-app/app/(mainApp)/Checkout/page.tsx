"use client";
import { useMutation } from "@apollo/client";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CiPhone, CiUser } from "react-icons/ci";
import { CREATE_CHECKOUT_MUTATION } from "../../../graphql/mutations";

interface DecodedToken extends JwtPayload {
  userId: string;
}

const Checkout = ({ searchParams }: any) => {
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [phone, setPhone] = useState<string>("");
  const [governorat, setGovernorat] = useState<string>("");
  const [addresse, setAddresse] = useState<string>("");
  const router = useRouter();
  const products = JSON.parse(searchParams?.products);
  console.log(searchParams);

  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);



  const [createCheckout, { loading }] = useMutation(CREATE_CHECKOUT_MUTATION);

  return (
    <div className="flex justify-center items-center">
     
        <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
          <div className="px-4 pt-8">
            <p className="text-xl font-medium">Récapitulatif de la commande</p>
            <p className="text-gray-400">Vérifiez vos articles.</p>
            <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
              {products?.map((product: any) => (
                <div className="flex flex-col rounded-lg bg-white sm:flex-row">
                  <img
                    className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                    src={product.images[0]}
                    alt=""
                  />
                  <div className="flex w-full flex-col px-4 py-4">
                    <span className="font-semibold">{product.name}</span>
                    <p className="mt-auto text-lg font-bold">
                      {product.price.toFixed(3)} TND
                    </p>
                    <p className="mt-auto text-lg font-md text-gray-400">
                      Quantité: {product.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
            <p className="text-xl font-medium">Informations du client</p>
            <p className="text-gray-400">
              Complétez votre commande en fournissant les coordonnées de votre
              client.
            </p>
            <div className="">
              <label
                htmlFor="email"
                className="mt-4 mb-2 block text-sm font-medium"
              >
                Nom et Prénom
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nom et prénom"
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                  <CiUser className="font-bold" />
                </div>
              </div>
              <label
                htmlFor="phone"
                className="mt-4 mb-2 block text-sm font-medium"
              >
                Téléphone
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm uppercase shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="+216 12 345 678"
                  onChange={(e) => setPhone(e.target.value)}
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                  <CiPhone className="font-bold" />
                </div>
              </div>
              <label
                htmlFor="governorat"
                className="mt-4 mb-2 block text-sm font-medium"
              >
                Governorat
              </label>
              <div className="relative">
                <select
                  name="governorat"
                  id="governorat"
                  className="w-full px-2 py-2 text-gray-700 bg-gray-200 rounded"
                  onChange={(e) => setGovernorat(e.target.value)}
                >
                  <option>Sélectionner une governorat</option>
                  <option value="g1">Sousse</option>
                </select>
              </div>
              <label
                htmlFor="address"
                className="mt-4 mb-2 block text-sm font-medium"
              >
                Adresse
              </label>
              <div className="relative">
                <textarea
                  id="address"
                  name="address"
                  className="w-full rounded-md border border-gray-200 px-4 py-3  text-sm uppercase shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Saisez votre addresse"
                  onChange={(e) => setAddresse(e.target.value)}
                ></textarea>
              </div>
              <div className="mt-6 border-t border-b py-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    Total du commande
                  </p>
                  <p className="font-semibold text-gray-900">
                    {parseInt(searchParams.total).toFixed(3)} TND
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    Expédition
                  </p>
                  <p className="font-semibold text-gray-900">8.000 TND</p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Total</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {(Number(searchParams.total)).toFixed(3)} TND
                </p>
              </div>
            </div>
            <button
              className="mt-4 mb-8 w-full rounded-md bg-strongBeige px-6 py-3 font-medium text-white"
              onClick={() => {
                createCheckout({
                  variables: {
                    input: {
                      userId: decodedToken?.userId,
                      total: +searchParams.total,
                      phone: +phone,
                      governorateId: governorat,
                      address: addresse,
                    },
                  },
                  onCompleted: () => {
                    router.push("/Home");
                  },
                });
              }}
            >
              Passer la commande
            </button>
          </div>
        </div>
      
    </div>
  );
};

export default Checkout;
