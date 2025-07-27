"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FiCheck, FiClock, FiGift, FiHeart, FiTrendingUp, FiUser, FiX } from "react-icons/fi";
import SearchBar from "./SearchBar";

import { formatDate } from "@/app/Helpers/_formatDate";
import { useOutsideClick } from "@/app/Helpers/_outsideClick";
import {
  useDrawerBasketStore,
  useProductComparisonStore,
  useProductsInBasketStore,
} from "@/app/store/zustand";
import { useToast } from "@/components/ui/use-toast";
import { SIGNIN_MUTATION } from "@/graphql/mutations";
import { BASKET_QUERY, FETCH_USER_BY_ID } from "@/graphql/queries";
import { removeToken } from "@/lib/auth/token";
import { useAuth } from "@/lib/auth/useAuth";
import { useMutation, useQuery } from "@apollo/client";
import { sendGTMEvent } from "@next/third-parties/google";
import Image from "next/legacy/image";
import { useForm } from "react-hook-form";
import { GoPackageDependents } from "react-icons/go";
import { IoBagHandleOutline, IoGitCompare } from "react-icons/io5";
import { MdPointOfSale } from "react-icons/md";


interface Voucher {
  id: string;
  code: string;
  amount: number;
  isUsed: boolean;
  createdAt: string;
  expiresAt: string;
  usedAt: string | null;
  userId: string;
  checkoutId: string | null;
}

interface PointTransaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
  userId: string;
  checkoutId: string | null;
}

const TopHeader = () => {
  const { decodedToken, isAuthenticated } = useAuth();
  const [showLogout, setShowMenuUserMenu] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'account' | 'points' | 'vouchers' | 'transactions'>('account');
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
          description: "Email ou mot de passe invalide",
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
  }, [basketData, clearBasket, addMultipleProducts, setQuantityInBasket, decodedToken]);

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

  const handleBasketClick = () => {
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
    openBasketDrawer();
  };

  const onSubmit = (data: any) => {
    SignIn({ variables: { input: data } });
  };


  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'ADMIN_ADDED':
        return <FiTrendingUp className="text-green-600" />;
      case 'ADJUSTMENT':
        return <FiGift className="text-blue-600" />;
      default:
        return <FiTrendingUp className="text-gray-600" />;
    }
  };

  const getTransactionColor = (amount: number) => {
    if (amount > 0) return 'text-green-600';
    if (amount < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const renderPointsSection = () => {
    const userPoints = userData?.fetchUsersById?.points || 0;
    const transactions = userData?.fetchUsersById?.pointTransactions || [];

    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Mes Points</h3>
          <div className="bg-gradient-to-r from-primaryColor to-amber-400 text-white px-3 py-1 rounded-full text-sm font-bold">
            {formatAmount(userPoints)} pts
          </div>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {transactions.length > 0 ? (
            transactions.map((transaction: PointTransaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getTransactionIcon(transaction.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</p>
                  </div>
                </div>
                <div className={`text-sm font-semibold ${getTransactionColor( transaction.amount)}`}>
                  {transaction.amount > 0 ? '+' : ''}{formatAmount(transaction.amount)} pts
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">Aucune transaction trouvée</p>
          )}
        </div>
      </div>
    );
  };

  const renderVouchersSection = () => {
    const vouchers = userData?.fetchUsersById?.Voucher || [];
    const activeVouchers = vouchers.filter((v: Voucher) => !v.isUsed);
    const usedVouchers = vouchers.filter((v: Voucher) => v.isUsed);

    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Mes Bons</h3>
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            {activeVouchers.length} actifs
          </div>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {activeVouchers.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-green-600 mb-2 flex items-center gap-1">
                <FiCheck size={14} />
                Bons Actifs
              </h4>
              {activeVouchers.map((voucher: Voucher) => (
                <div key={voucher.id} className="border border-green-200 bg-green-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{voucher.code}</p>
                      <p className="text-xs text-gray-600">Expire le: {formatDate(voucher.expiresAt)}</p>
                    </div>
                    <div className="bg-green-600 text-white px-2 py-1 rounded-md text-sm font-bold">
                      {formatAmount(voucher.amount)} TND
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {usedVouchers.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1">
                <FiX size={14} />
                Bons Utilisés
              </h4>
              {usedVouchers.map((voucher: Voucher) => (
                <div key={voucher.id} className="border border-gray-200 bg-gray-50 rounded-lg p-3 opacity-75">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-600">{voucher.code}</p>
                      <p className="text-xs text-gray-500">Utilisé le: {voucher.usedAt ? formatDate(voucher.usedAt) : 'N/A'}</p>
                    </div>
                    <div className="bg-gray-400 text-white px-2 py-1 rounded-md text-sm font-bold">
                      {formatAmount(voucher.amount)} TND
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {vouchers.length === 0 && (
            <p className="text-center text-gray-500 py-4">Aucun bon trouvé</p>
          )}
        </div>
      </div>
    );
  };

  const renderTransactionsSection = () => {
    const transactions = userData?.fetchUsersById?.pointTransactions || [];
    const sortedTransactions = [...transactions].sort((a, b) => parseInt(b.createdAt) - parseInt(a.createdAt));

    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Historique des Transactions</h3>
          <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
            {transactions.length} transactions
          </div>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {sortedTransactions.length > 0 ? (
            sortedTransactions.map((transaction: PointTransaction) => (
              <div key={transaction.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-1 rounded-full bg-white">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-800">{transaction.description}</p>
                    <span className={`text-sm font-semibold ${getTransactionColor( transaction.amount)}`}>
                      {transaction.amount > 0 ? '+' : ''}{formatAmount(transaction.amount)} pts
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <FiClock size={12} />
                    {formatDate(transaction.createdAt)}
                    <span className="bg-gray-200 px-2 py-0.5 rounded text-xs">
                      {transaction.type}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">Aucune transaction trouvée</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container hidden md:flex md:flex-row flex-col gap-3 py-4 justify-between items-center border-b border-gray-200">
      <div className="logo-container hidden md:block relative w-full max-w-[180px] h-16 md:h-20 transition-all duration-300">
        <Link href="/" className="block w-full h-full">
          <div className="relative w-full h-full">
            <Image
              src={"/LOGO.png"}
              layout="fill"
              objectFit="contain"
              quality={100}
              priority={true}
              alt="ita-luxury"
              className="transition-transform duration-300 transform-gpu hover:scale-[1.02]"
            />
          </div>
        </Link>
      </div>

      <div className="w-full max-w-xl">
        <SearchBar />
      </div>

      <div className="list md:flex items-center gap-6 relative cursor-pointer text-md hidden">
        <ul className="flex items-center gap-6">
          <li className="userMenu relative group">
            <div
              onClick={() => setShowMenuUserMenu((prev) => !prev)}
              className="flex items-center gap-2 cursor-pointer hover:text-primaryColor transition-all"
            >
              <div className="p-2 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors">
                <FiUser className="text-gray-700" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">
                  {isAuthenticated ? 'Bonjour,' : 'Bienvenue'}
                </span>
                <span className="text-sm font-medium">
                  {isAuthenticated
                    ? userData?.fetchUsersById?.fullName || 'Mon compte'
                    : 'Votre Compte'
                  }
                </span>
              </div>
              {/* Points Display - Mobile */}
              {isAuthenticated && (
                <div className="px-4 pb-2">
                  <Link
                    href="/Account"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-primaryColor/10 to-primaryColor/5 px-3 py-2 rounded-full hover:from-primaryColor/20 hover:to-primaryColor/10 transition-all duration-200 border border-primaryColor/20"
                  >
                    <MdPointOfSale className="text-lg text-primaryColor" />
                    <span className="font-semibold text-primaryColor text-sm">
                      {userData?.fetchUsersById?.points || 0} points
                    </span>
                  </Link>
                </div>
              )}
            </div>

            <div
              ref={clickOutside}
              className={`absolute w-96 border shadow-lg rounded-lg bg-white right-0 top-full mt-2 transition-all duration-200 z-[60] ${showLogout ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"
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
                            const phoneRegex = /^[0-9]{8}$/;
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

                  <Link
                    href={"/signup"}
                    className="w-full py-2.5 px-4 text-sm font-semibold rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 text-center transition-colors"
                  >
                    NOUVEAU CLIENT? COMMENCER ICI
                  </Link>
                </div>
              )}

              {isAuthenticated && (
                <>
                  <div className="flex items-center gap-3 mb-4 p-4 pb-0">
                    <div className="w-10 h-10 rounded-full bg-primaryColor/20 flex items-center justify-center text-primaryColor">
                      {userData?.fetchUsersById?.fullName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-medium">{userData?.fetchUsersById?.fullName}</p>
                      <p className="text-xs text-gray-500">{userData?.fetchUsersById?.email}</p>
                    </div>
                  </div>

                  {/* Tab Navigation */}
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

                  {/* Tab Content */}
                  {activeTab === 'account' && (
                    <div className="p-4">
                      <div className="space-y-2">
                        <Link
                          href="/Account"
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          <FiUser className="text-gray-600" />
                          <span className="text-sm font-medium">Mon Compte</span>
                        </Link>

                        <Link
                          href={decodedToken?.userId ? `/TrackingPackages` : "/signin"}
                          onClick={() => {
                            if (!decodedToken || !decodedToken.userId) {
                              alert("Veuillez vous connecter pour voir vos commandes.");
                            }
                          }}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          <GoPackageDependents className="text-gray-600" />
                          <span className="text-sm font-medium">Mes Commandes</span>
                        </Link>

                        <Link
                          href={decodedToken?.userId ? `/FavoriteList` : "/signin"}
                          onClick={() => {
                            if (!decodedToken || !decodedToken.userId) {
                              alert("Veuillez vous connecter pour voir vos favoris.");
                            }
                          }}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          <FiHeart className="text-gray-600" />
                          <span className="text-sm font-medium">Ma Liste D'envies</span>
                        </Link>

                        <Link
                          href="/productComparison"
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          <IoGitCompare className="text-gray-600" />
                          <span className="text-sm font-medium">Comparer ({comparisonList.length})</span>
                        </Link>

                        <button
                          onClick={() => {
                            removeToken();
                            window.sessionStorage.removeItem("products-in-basket");
                            window.sessionStorage.removeItem("comparedProducts");
                            window.location.replace("/");
                          }}
                          className="flex items-center gap-3 p-2 w-full text-left text-red-600 hover:bg-red-50 rounded-md transition-colors mt-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span className="text-sm font-medium">Déconnexion</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'points' && renderPointsSection()}
                  {activeTab === 'vouchers' && renderVouchersSection()}
                  {activeTab === 'transactions' && renderTransactionsSection()}
                </>
              )}
            </div>
          </li>

          <li
            onClick={handleBasketClick}
            title="Votre Panier"
            className="flex items-center gap-2 cursor-pointer hover:text-primaryColor transition-all"
          >
            <div className="relative p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
              <IoBagHandleOutline className="text-gray-700 text-2xl" />
              {quantityInBasket > 0 && (
                <span className="absolute -top-1 -right-1 bg-primaryColor text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
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