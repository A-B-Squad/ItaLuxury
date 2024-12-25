"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FiHeart, FiUser } from "react-icons/fi";
import SearchBar from "./SearchBar";

import { useOutsideClick } from "@/app/Helpers/_outsideClick";
import {
  useProductComparisonStore,
  useDrawerBasketStore,
  useProductsInBasketStore,
} from "@/app/store/zustand";
import { useToast } from "@/components/ui/use-toast";
import { SIGNIN_MUTATION } from "@/graphql/mutations";
import { BASKET_QUERY, FETCH_USER_BY_ID } from "@/graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import Image from "next/legacy/image";
import { useForm } from "react-hook-form";
import { GoPackageDependents } from "react-icons/go";
import { IoBagHandleOutline, IoGitCompare } from "react-icons/io5";
import { sendGTMEvent } from "@next/third-parties/google";
import { useAuth } from "@/lib/auth/useAuth";
import { removeToken } from "@/lib/auth/token";

const TopHeader = ({ logo }: { logo: string }) => {
  const { decodedToken, isAuthenticated } = useAuth();
  const [showLogout, setShowMenuUserMenu] = useState<boolean>(false);
  const { openBasketDrawer } = useDrawerBasketStore();
  const { comparisonList } = useProductComparisonStore();

  const {
    quantityInBasket,
    addMultipleProducts,
    setQuantityInBasket,
    clearBasket
  } = useProductsInBasketStore();

  const clickOutside = useOutsideClick(() => {
    setShowMenuUserMenu(false);
  });

  const {
    register,
    handleSubmit
  } = useForm();
  const { toast } = useToast();

  const [SignIn, { loading }] = useMutation(SIGNIN_MUTATION, {
    onCompleted: () => {
      window.location.reload();
      toast({
        title: "Connexion",
        description: "Bienvenue",
        className: "bg-primaryColor text-white",
      });
    },
    onError: (error) => {
      if (error) {
        toast({
          title: "Connexion",
          description: "Invalid email or password",
          className: "bg-red-800 text-white",
        });
      }
    },
  });

  const { data: userData } = useQuery(FETCH_USER_BY_ID, {
    variables: {
      userId: decodedToken?.userId,
    },
    skip: !isAuthenticated,
  });

  const { data: basketData, refetch: refetchBasket } = useQuery(BASKET_QUERY, {
    variables: { userId: decodedToken?.userId },
    skip: !isAuthenticated,
    fetchPolicy: "network-only",
  });

  const updateBasketQuantity = useCallback(() => {

    if (decodedToken?.userId && basketData?.basketByUserId) {
      // Prepare basket products with quantity
      const basketProducts = basketData.basketByUserId.map((item: any) => ({
        ...item.product,
        actualQuantity: item.quantity,
      }));

      // Calculate total quantity
      const totalQuantity = basketData.basketByUserId.reduce(
        (acc: number, item: any) => acc + item.quantity,
        0
      );

      // Clear existing basket and set new products
      clearBasket();
      addMultipleProducts(basketProducts);
      setQuantityInBasket(totalQuantity);
    }
  }, [basketData, clearBasket, addMultipleProducts, setQuantityInBasket, decodedToken]);


  useEffect(() => {
    if (decodedToken?.userId) {
      refetchBasket();
    }
  }, [decodedToken, refetchBasket]);

  useEffect(() => {
    // Only call updateBasketQuantity when user is logged in
    if (isAuthenticated) {
      updateBasketQuantity();
    }
  }, [basketData, updateBasketQuantity, isAuthenticated]);

  const handleBasketClick = () => {
    // Send GTM event
    sendGTMEvent({
      event: "view_cart",
      page_location: window.location.href,
      user_data: isAuthenticated ? {
        country: ["tn"],
        external_id: decodedToken?.userId
      } : undefined,
      facebook_data: {
        content_name: "Cart View",
        content_type: "cart",
        currency: "TND",
        num_items: quantityInBasket
      }
    });
    // Open basket drawer
    openBasketDrawer();
  };

  const onSubmit = (data: any) => {
    SignIn({ variables: { input: data } });
  };
  return (
    <div
      className="container flex  md:flex-row flex-col gap-3 justify-between items-center  md:border-b-2 "
    >
      <div className="logo relative w-40 h-20 md:w-48 md:h-20 content-center  ">
        <Link href={"/"}>
          <Image
            src={logo}
            width={192}
            height={96}
            alt="ita-luxury"
            priority={true}
            layout="responsive"
            objectFit="contain"
          />
        </Link>
      </div>
      <SearchBar />
      <div className="list md:flex items-center gap-5 relative cursor-pointer  text-md hidden ">
        <ul className="flex items-center gap-5">
          <li
            className="userMenu w-max  group  "
          >
            <div
              onClick={() => setShowMenuUserMenu((prev) => !prev)}
              className="flex   items-center gap-2 cursor-pointer hover:text-primaryColor transition-all">
              <FiUser />

              {decodedToken?.userId ?
                <p>
                  {userData?.fetchUsersById.fullName}
                </p>
                :
                <p>
                  Votre Compte
                </p>
              }
            </div>

            <div
              ref={clickOutside}
              className={` absolute w-72 h-96 border-2  px-2 py-2  z-[60]  flex  justify-start items-start flex-col  tracking-wider transition-all  ${showLogout ? "translate-y-9 visible" : "invisible translate-y-32"}border-2    bg-white  right-0 z-50`}
            >
              {!isAuthenticated && (
                <form
                  className="flex flex-col w-full "
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <label
                    htmlFor="emailOrPhone"
                    className="text-xs font-medium mb-1"
                  >
                    Adresse e-mail ou numéro de téléphone
                  </label>
                  <input
                    id="emailOrPhone"
                    autoComplete="email"

                    type="text"
                    className="block border outline-gray-400 border-gray-300 py-2.5  text-xs w-full p-1 rounded mb-4"
                    title="emailOrPhone"
                    {...register("emailOrPhone", {
                      required: "L'email ou le numéro de téléphone est requis",
                      validate: (value) => {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        const phoneRegex = /^[0-9]{8}$/;
                        return (
                          emailRegex.test(value) ||
                          phoneRegex.test(value) ||
                          "Format invalide"
                        );
                      },
                    })}
                  />

                  <label
                    htmlFor="password"
                    className="text-xs font-medium mb-1"
                  >
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    title="Mot de passe"
                    className="block border border-gray-300 py-2.5 outline-gray-400   text-xs w-full p-1 rounded mb-4"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full text-center py-1 px-5 text-sm font-semibold  rounded-full bg-primaryColor text-white hover:bg-secondaryColor focus:outline-none my-1 transition-all"
                  >
                    {loading ? "Chargement..." : "CONNEXION"}
                  </button>
                </form>
              )}
              {!isAuthenticated && (
                <Link
                  rel="preload"
                  href={"/signup"}
                  className="w-full py-2 px-1 text-xs border-b  bg-gray-100 hover:text-primaryColor flex justify-between items-center  transition-colors"
                >
                  <FiUser />
                  <p>NOUVEAU CLIENT?</p>
                  <span className="font-semibold">COMMENCER ICI</span>
                </Link>
              )}
              {!isAuthenticated && (
                <Link
                  rel="preload"
                  className="w-full py-2  text-sm border-b gap-2 hover:text-primaryColor flex justify-start items-center  transition-colors"
                  href={"/signin"}
                >
                  <FiUser />
                  <p className="font-semibold ">Mon Compte</p>
                </Link>
              )}
              {decodedToken?.userId && (
                <Link
                  rel="preload"
                  onClick={() => {
                    removeToken()
                    window.sessionStorage.removeItem("products-in-basket");
                    window.sessionStorage.removeItem("comparedProducts");
                    window.location.replace("/");

                  }}
                  className="w-full text-sm py-2 border-b gap-2 hover:text-primaryColor flex justify-start items-center  transition-colors"
                  href={"/"}
                >
                  <FiUser />
                  <p className="font-semibold uppercase">Déconnexion</p>
                </Link>
              )}

              <Link
                rel="preload"
                href={decodedToken?.userId ? `/FavoriteList` : "/signin"}
                onClick={() => {
                  if (!decodedToken || !decodedToken.userId) {
                    alert("Veuillez vous connecter pour voir vos favoris.");
                  }
                }}
                className="w-full text-sm border-b py-2 gap-2 text-center hover:text-primaryColor flex justify-start items-center  transition-colors"
              >
                <FiHeart />
                <p className="font-semibold uppercase">Ma Liste D'envies</p>
              </Link>
              <Link
                rel="preload"
                href={decodedToken?.userId ? `/TrackingPackages` : "/signin"}
                onClick={() => {
                  if (!decodedToken || !decodedToken.userId) {
                    alert("Veuillez vous connecter pour voir vos commandes.");
                  }
                }}
                className="w-full text-sm border-b py-2 gap-2 text-center hover:text-primaryColor flex justify-start items-center  transition-colors"
              >
                <GoPackageDependents />
                <p className="font-semibold uppercase">Mes Commandes</p>
              </Link>

              <Link
                rel="preload"
                href={`/productComparison`}
                className=" text-sm w-full py-2 gap-2 hover:text-primaryColor flex justify-start items-center  transition-colors"
              >
                <IoGitCompare />
                <p className="font-semibold uppercase">
                  Comparer ({comparisonList.length})
                </p>
              </Link>
            </div>
          </li>

          <li
            onClick={handleBasketClick} title="Votre Panier"
            className="whishlist flex items-center gap-2 cursor-pointer hover:text-primaryColor transition-all"
          >
            <div className="relative inline-flex">
              <IoBagHandleOutline size={30} />

              {quantityInBasket >= 0 && (
                <span className="absolute rounded-full py-1 px-1 text-xs font-medium content-[''] leading-none grid place-items-center top-[4%] right-[2%] translate-x-2/4 -translate-y-2/4 bg-primaryColor text-white min-w-[20px] min-h-[20px]">
                  {quantityInBasket}
                </span>
              )}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TopHeader;
