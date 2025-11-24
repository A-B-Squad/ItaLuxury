"use client";
import { useAuth } from "@/app/hooks/useAuth";
import {
  useDrawerBasketStore,
  useProductComparisonStore,
  useProductsInBasketStore,
} from "@/app/store/zustand";
import { useToast } from "@/components/ui/use-toast";
import { SIGNIN_MUTATION } from "@/graphql/mutations";
import { BASKET_QUERY } from "@/graphql/queries";
import { setToken } from "@/utils/tokens/token";
import { useMutation, useQuery } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FiHeart, FiUser } from "react-icons/fi";
import { IoBagHandleOutline } from "react-icons/io5";
import SearchBar from "../SearchBar";
import handleAuthAlert from "./Helper/handleAuthAlert";
import AccountMenuLinks from "./AccountMenuLinks";
import PointsSection from "./PointsSection";
import VouchersSection from "./VouchersSection";
import TransactionsSection from "./TransactionsSection";

//  Get style classes based on transparency
const getStyleClasses = (isTransparent: boolean) => ({
  textColor: isTransparent ? 'text-white' : 'text-gray-700',
  iconColor: isTransparent ? 'text-white' : 'text-gray-700',
  bgColor: isTransparent ? 'bg-white/10 backdrop-blur-sm' : 'bg-gray-50',
  hoverBgColor: isTransparent ? 'hover:bg-white/20' : 'hover:bg-gray-100',
});

const TopHeader = ({ userData, isTransparent }: { userData: any; isTransparent?: boolean }) => {
  const { decodedToken, isAuthenticated, logout, updateToken } = useAuth();
  const [showLogout, setShowMenuUserMenu] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'account' | 'points' | 'vouchers' | 'transactions'>('account');
  const { openBasketDrawer } = useDrawerBasketStore();
  const { comparisonList } = useProductComparisonStore();

  const userMenuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLDivElement>(null);

  const {
    quantityInBasket,
    addMultipleProducts,
    setQuantityInBasket,
    clearBasket
  } = useProductsInBasketStore();

  const { register, handleSubmit } = useForm();
  const { toast } = useToast();

  // Handle click outside 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedOutside =
        userMenuRef.current && !userMenuRef.current.contains(event.target as Node) &&
        userButtonRef.current && !userButtonRef.current.contains(event.target as Node);

      if (clickedOutside) {
        setShowMenuUserMenu(false);
      }
    };

    if (showLogout) {
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showLogout]);

  const [SignIn, { loading }] = useMutation(SIGNIN_MUTATION, {
    onCompleted: (data) => {
      setToken(data.signIn.token);
      updateToken(data.signIn.token);
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
          description: "Email ou mot de passe invalide",
          className: "bg-red-800 text-white",
        });
      }
    },
  });

  const { data: basketData, refetch: refetchBasket } = useQuery(BASKET_QUERY, {
    variables: { userId: decodedToken?.userId },
    skip: !isAuthenticated,
    fetchPolicy: "network-only",
  });

  const updateBasketQuantity = useCallback(() => {
    if (decodedToken?.userId && basketData?.basketByUserId) {
      const basketProducts = basketData.basketByUserId.map((item: any) => ({
        ...item.product,
        actualQuantity: item.quantity,
      }));

      const totalQuantity = basketData.basketByUserId.reduce(
        (acc: number, item: any) => acc + item.quantity,
        0
      );

      clearBasket();
      addMultipleProducts(basketProducts);
      setQuantityInBasket(totalQuantity);
    }
  }, [basketData, clearBasket, decodedToken, addMultipleProducts, setQuantityInBasket]);

  useEffect(() => {
    if (decodedToken?.userId) {
      refetchBasket();
    }
  }, [decodedToken, refetchBasket]);

  useEffect(() => {
    if (isAuthenticated) {
      updateBasketQuantity();
    }
  }, [basketData, updateBasketQuantity, isAuthenticated]);

  const onSubmit = (data: any) => {
    SignIn({ variables: { input: data } });
  };

  const { textColor, iconColor, bgColor, hoverBgColor } = getStyleClasses(isTransparent || false);

  return (
    <div className="container hidden lg:flex lg:flex-row flex-col gap-6 py-5 justify-between items-center transition-all duration-500">
      {/* Logo Section */}
      <div className="logo-container hidden lg:block relative w-full max-w-[200px] h-20 transition-all duration-300">
        <Link href="/" className="block w-full h-full">
          <div className="relative w-full h-full">
            <Image
              src={"/images/logos/LOGO.png"}
              width={180}
              height={80}
              style={{ objectFit: "contain" }}
              quality={100}
              priority={true}
              alt="ita-luxury"
              className={`transition-all w-full h-full duration-500 transform-gpu hover:scale-[1.02] ${isTransparent ? 'brightness-0 invert drop-shadow-lg' : ''
                }`}
            />
          </div>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-2xl hidden lg:block">
        <SearchBar userData={userData} />
      </div>

      {/* Right Section - Actions */}
      <div className="list lg:flex items-center gap-8 relative cursor-pointer text-md hidden">
        <ul className="flex items-center gap-8">
          {/* Wishlist */}
          <li className="group">
            <Link
              href={decodedToken?.userId ? `/FavoriteList` : "/signin"}
              onClick={() => handleAuthAlert(decodedToken, "Veuillez vous connecter pour voir vos favoris.")}
              className="flex flex-col items-center gap-1 transition-all"
            >
              <div className={`relative p-2.5 rounded-full ${bgColor} ${hoverBgColor} transition-all duration-300`}>
                <FiHeart className={`${iconColor} group-hover:text-primaryColor text-2xl transition-colors`} />
              </div>
              <span className={`text-xs font-medium ${textColor} group-hover:text-primaryColor transition-colors`}>
                Ma liste d'envies
              </span>
            </Link>
          </li>

          {/* User Menu */}
          <li className="userMenu relative group">
            <div
              ref={userButtonRef}
              onClick={() => setShowMenuUserMenu((prev) => !prev)}
              className="flex flex-col items-center gap-1 cursor-pointer transition-all"
            >
              <div className={`p-2.5 rounded-full ${bgColor} ${hoverBgColor} transition-all duration-300`}>
                <FiUser className={`${iconColor} group-hover:text-primaryColor text-2xl transition-colors`} />
              </div>
              <span className={`text-xs font-medium ${textColor} group-hover:text-primaryColor transition-colors`}>
                {isAuthenticated ? userData?.fullName?.split(' ')[0] || 'Mon compte' : 'Guest'}
              </span>
              <span className={`text-xs ${isTransparent ? 'text-white/80' : 'text-gray-500'}`}>
                Mon compte
              </span>
            </div>

            <div
              ref={userMenuRef}
              className={`absolute w-96 border shadow-xl rounded-lg bg-white right-0 top-full mt-2 transition-all duration-200 z-[60] ${showLogout ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2 pointer-events-none"
                }`}
            >
              {!isAuthenticated && (
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 text-center">Connexion</h3>
                  <form
                    className="flex flex-col w-full"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="mb-3">
                      <label
                        htmlFor="emailOrPhone"
                        className="text-xs font-medium mb-1 block text-gray-700"
                      >
                        Adresse e-mail ou numéro de téléphone
                      </label>
                      <input
                        id="emailOrPhone"
                        autoComplete="email"
                        type="text"
                        className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-primaryColor focus:border-primaryColor"
                        title="emailOrPhone"
                        {...register("emailOrPhone", {
                          required: "L'email ou le numéro de téléphone est requis",
                          validate: (value) => {
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            const phoneRegex = /^\d{8}$/;
                            return (
                              emailRegex.test(value) ||
                              phoneRegex.test(value) ||
                              "Format invalide"
                            );
                          },
                        })}
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="password"
                        className="text-xs font-medium mb-1 block text-gray-700"
                      >
                        Mot de passe
                      </label>
                      <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        title="Mot de passe"
                        className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-primaryColor focus:border-primaryColor"
                        {...register("password", {
                          required: "Le mot de passe est requis",
                        })}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 px-4 text-sm font-semibold rounded-md bg-primaryColor text-white hover:bg-amber-200 focus:outline-none transition-colors"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Chargement...
                        </span>
                      ) : (
                        "CONNEXION"
                      )}
                    </button>
                  </form>

                  <div className="flex items-center my-4">
                    <div className="flex-grow h-px bg-gray-200"></div>
                    <span className="px-3 text-xs text-gray-500">ou</span>
                    <div className="flex-grow h-px bg-gray-200"></div>
                  </div>
                  <div className="auth-buttons-container flex gap-2 items-center justify-center">
                    <Link
                      href={"/signin"}
                      className="w-full py-2.5 px-4 text-sm font-semibold rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 text-center transition-colors"
                    >
                      LOGIN
                    </Link>
                    <Link
                      href={"/signup"}
                      className="w-full py-2.5 px-4 text-sm font-semibold rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 text-center transition-colors"
                    >
                      NEW CLIENT? SIGN UP
                    </Link>
                  </div>
                </div>
              )}

              {isAuthenticated && (
                <>
                  <div className="flex items-center gap-3 mb-4 p-4 pb-0">
                    <div className="w-10 h-10 rounded-full bg-primaryColor/20 flex items-center justify-center text-primaryColor font-bold text-lg">
                      {userData?.fullName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-medium">{userData?.fullName}</p>
                      <p className="text-xs text-gray-500">{userData?.email}</p>
                    </div>
                  </div>

                  <div className="flex border-b border-gray-200">
                    <button
                      onClick={() => setActiveTab('account')}
                      className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === 'account'
                        ? 'text-primaryColor border-b-2 border-primaryColor'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      Compte
                    </button>
                    <button
                      onClick={() => setActiveTab('points')}
                      className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === 'points'
                        ? 'text-primaryColor border-b-2 border-primaryColor'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      Points
                    </button>
                    <button
                      onClick={() => setActiveTab('vouchers')}
                      className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === 'vouchers'
                        ? 'text-primaryColor border-b-2 border-primaryColor'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      Bons
                    </button>
                    <button
                      onClick={() => setActiveTab('transactions')}
                      className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === 'transactions'
                        ? 'text-primaryColor border-b-2 border-primaryColor'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      Historique
                    </button>
                  </div>

                  {activeTab === 'account' && (
                    <AccountMenuLinks
                      decodedToken={decodedToken}
                      comparisonList={comparisonList}
                      logout={logout}
                    />
                  )}
                  {activeTab === 'points' && <PointsSection userData={userData} />}
                  {activeTab === 'vouchers' && <VouchersSection userData={userData} />}
                  {activeTab === 'transactions' && <TransactionsSection userData={userData} />}
                </>
              )}
            </div>
          </li>

          {/* Basket */}
          <li
            onClick={openBasketDrawer}
            title="Votre Panier"
            className="flex flex-col items-center gap-1 cursor-pointer transition-all group"
          >
            <div className={`relative p-2.5 rounded-full ${bgColor} ${hoverBgColor} transition-all duration-300`}>
              <IoBagHandleOutline className={`${iconColor} group-hover:text-primaryColor text-2xl transition-colors`} />
              {quantityInBasket > 0 && (
                <span className="absolute -top-1 -right-1 bg-primaryColor text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                  {quantityInBasket}
                </span>
              )}
            </div>
            <span className={`text-xs font-medium ${textColor} group-hover:text-primaryColor transition-colors`}>
              Panier
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TopHeader;