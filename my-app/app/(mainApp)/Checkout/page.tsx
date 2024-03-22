"use client";
import React, { useEffect, useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";


interface DecodedToken extends JwtPayload {
  userId: string;
}

const Checkout = ({ searchParams }: any) => {
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [phone, setPhone] = useState<string>("");
  const [governorat, setGovernorat] = useState<string>("");
  const [addresse, setAddresse] = useState<string>("");
    const router = useRouter()
  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);

  const CREATE_CHECKOUT_MUTATION = gql`
    mutation CreateCheckout($input: CreateCheckoutInput!) {
      createCheckout(input: $input) {
        id
        userId
        governorateId
        phone
        address
        total
        createdAt
      }
    }
  `;

  const [createCheckout, { loading }] = useMutation(CREATE_CHECKOUT_MUTATION);

  return (
    <div className="flex justify-center items-center">
      {loading ? (
        <div
          className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-strongBeige motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      ) : (
        <form className="w-full mx-20 mt-10 p-10 bg-white rounded shadow-xl">
          <p className="text-gray-800 font-medium">Informations client</p>
          <div className="">
            <label className="block text-sm text-gray-00" htmlFor="cus_name">
              Nom et Prénom
            </label>
            <input
              className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded"
              id="cus_name"
              name="cus_name"
              type="text"
              required
              placeholder="Votre nom et prénom"
              aria-label="Name"
            />
          </div>
          <div className="mt-8">
            <label className="block text-sm text-gray-600" htmlFor="phone">
              Téléphone:
            </label>
            <input
              className="w-full px-2 py-2 text-gray-700 bg-gray-200 rounded"
              id="phone"
              name="phone"
              type="text"
              required
              placeholder="Votre Téléphone"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="mt-8">
            <label className=" text-sm block text-gray-600" htmlFor="cus_email">
              Governorat:
            </label>
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
          <div className="mt-8">
            <label className=" block text-sm  text-gray-600" htmlFor="adresse">
              Addresse :
            </label>
            <input
              className="w-full px-5  py-4 text-gray-700 bg-gray-200 rounded"
              id="adresse"
              name="adresse"
              type="text"
              required
              placeholder="Adresse"
              aria-label="Email"
              onChange={(e) => setAddresse(e.target.value)}
            />
          </div>
          <div className="mt-8">
            <button
              className="px-4 py-1 text-white font-light tracking-wider bg-strongBeige rounded"
              type="button"
              onClick={() => {
                createCheckout({
                  variables: {
                    input: {
                      userId: "e8b5999f-75a9-41a1-8681-658294544c1a",
                      total: +searchParams.total,
                      phone: +phone,
                      governorateId: governorat,
                      address: addresse,
                    },
                  },
                  onCompleted:()=>{
                    router.push('/Home')
                  }
                });
              }}
            >
              {searchParams.total} DT
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Checkout;
