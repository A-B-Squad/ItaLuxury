"use client";
import { useAuth } from "@/lib/auth/useAuth";
import { useQuery } from "@apollo/client";
import { FETCH_USER_BY_ID } from "@/graphql/queries";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FiUser, FiHeart, FiMapPin, FiLock, FiShoppingBag, FiStar, FiShare2 } from "react-icons/fi";
import { GoPackageDependents } from "react-icons/go";
import { IoGitCompare } from "react-icons/io5";
import Link from "next/link";
import { useProductComparisonStore } from "@/app/store/zustand";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

import { FiGift } from 'react-icons/fi';
import { MdPointOfSale } from 'react-icons/md';
import { formatDate } from "@/app/Helpers/_formatDate";

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
// Add to imports
import { GET_POINT_SETTINGS } from "@/graphql/queries";

const AccountPage = () => {
  // Add this query
  const { data: pointSettingsData } = useQuery(GET_POINT_SETTINGS);

  const router = useRouter();
  const { decodedToken, isAuthenticated } = useAuth();
  const { comparisonList } = useProductComparisonStore();

  const { data: userData, loading } = useQuery(FETCH_USER_BY_ID, {
    variables: {
      userId: decodedToken?.userId,
    },
    skip: !isAuthenticated,
  });
  // useEffect(() => {
  //   // Redirect to login if not authenticated
  //   if (!isAuthenticated && !loading) {
  //     router.push("/signin");
  //   }
  // }, [isAuthenticated, router, loading]);
  if (loading) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-md">
          <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }
  const user = userData?.fetchUsersById;
  return (
    <div className="container py-8 px-4 md:px-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Mon Compte</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b">
              <div className="w-16 h-16 rounded-full bg-primaryColor/20 flex items-center justify-center text-primaryColor text-2xl font-semibold">
                {user?.fullName?.charAt(0) || "U"}
              </div>
              <div>
                <h2 className="font-semibold text-lg">{user?.fullName}</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              <Link
                href="/Account"
                className="w-full flex items-center gap-3 p-3 rounded-md transition-colors bg-primaryColor/10 text-primaryColor"
              >
                <FiUser size={18} />
                <span className="font-medium">Mon Profil</span>
              </Link>

              <Link
                href="/TrackingPackages"
                className="w-full flex items-center gap-3 p-3 rounded-md transition-colors hover:bg-gray-100"
              >
                <GoPackageDependents size={18} />
                <span className="font-medium">Mes Commandes</span>
              </Link>

              <Link
                href="/FavoriteList"
                className="w-full flex items-center gap-3 p-3 rounded-md transition-colors hover:bg-gray-100"
              >
                <FiHeart size={18} />
                <span className="font-medium">Ma Liste D'envies</span>
              </Link>

              <Link
                href="/productComparison"
                className="w-full flex items-center gap-3 p-3 rounded-md transition-colors hover:bg-gray-100"
              >
                <IoGitCompare size={18} />
                <span className="font-medium">Comparer ({comparisonList.length})</span>
              </Link>
            </nav>
          </div>

          <div className="bg-gradient-to-br from-primaryColor to-secondaryColor rounded-lg shadow-sm p-6 text-white">
            <h3 className="font-semibold mb-2">Besoin d'aide?</h3>
            <p className="text-sm mb-4">Notre service client est disponible pour vous aider.</p>
            <Link
              href="/Contact-us"
              className="bg-white text-primaryColor px-4 py-2 rounded-md text-sm font-medium inline-block hover:bg-gray-100 transition-colors"
            >
              Contactez-nous
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="flex w-full p-1 bg-gray-100 rounded-lg mb-6 gap-1">
              <TabsTrigger
                value="profile"
                className="flex-1 py-3 rounded-md data-[state=active]:bg-white data-[state=active]:text-primaryColor data-[state=active]:shadow-sm transition-all"
              >
                <FiUser className="inline-block mr-2" />
                Informations
              </TabsTrigger>
              <TabsTrigger
                value="points"
                className="flex-1 py-3 rounded-md data-[state=active]:bg-white data-[state=active]:text-primaryColor data-[state=active]:shadow-sm transition-all"
              >
                <MdPointOfSale className="inline-block mr-2" />
                Points
              </TabsTrigger>
              <TabsTrigger
                value="transactions"
                className="flex-1 py-3 rounded-md data-[state=active]:bg-white data-[state=active]:text-primaryColor data-[state=active]:shadow-sm transition-all"
              >
                <FiGift className="inline-block mr-2" />
                Transactions
              </TabsTrigger>
              <TabsTrigger
                value="vouchers"
                className="flex-1 py-3 rounded-md data-[state=active]:bg-white data-[state=active]:text-primaryColor data-[state=active]:shadow-sm transition-all"
              >
                <FiGift className="inline-block mr-2" />
                Bons d'achat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">Informations personnelles</h2>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                  <p className="text-sm font-medium text-gray-500 md:w-1/4">Nom complet:</p>
                  <p className="font-medium">{user?.fullName}</p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                  <p className="text-sm font-medium text-gray-500 md:w-1/4">Email:</p>
                  <p>{user?.email}</p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                  <p className="text-sm font-medium text-gray-500 md:w-1/4">Téléphone:</p>
                  <p>{user?.number || "Non renseigné"}</p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                  <p className="text-sm font-medium text-gray-500 md:w-1/4">Date d'inscription:</p>
                  <p>{formatDate(user?.createdAt)}</p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Sécurité du compte</h3>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                  <p className="text-sm font-medium text-gray-500 md:w-1/4">Mot de passe:</p>
                  <p>••••••••</p>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Pour des raisons de sécurité, vous ne pouvez pas modifier vos informations personnelles directement.
                  Veuillez contacter notre service client pour toute modification.
                </p>
              </div>
            </TabsContent>

            {/* Points Overview Tab */}
            <TabsContent value="points" className="bg-white rounded-lg shadow-sm">
              <div className="grid md:grid-cols-2 gap-6 p-6">
                {/* Points Card */}
                <div className="bg-gradient-to-r from-primaryColor to-secondaryColor text-white rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-2">Points Disponibles</h3>
                  <p className="text-5xl font-bold mb-4">{user?.points || 0}</p>
                  <div className="text-sm opacity-90">
                    Points accumulés depuis votre inscription
                  </div>
                </div>

                {/* Progress Card */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4">Prochain Bon d'achat</h3>
                  {pointSettingsData?.getPointSettings && (
                    <>
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Progression</span>
                          <span className="text-sm font-medium">
                            {user?.points || 0} / {pointSettingsData.getPointSettings.minimumPointsToUse} points
                          </span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primaryColor transition-all duration-500"
                            style={{
                              width: `${Math.min(((user?.points || 0) / pointSettingsData.getPointSettings.minimumPointsToUse) * 100, 100)}%`
                            }}
                          />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          {Math.max(pointSettingsData.getPointSettings.minimumPointsToUse - (user?.points || 0), 0)} points restants pour obtenir un bon d'achat de {pointSettingsData.getPointSettings.loyaltyRewardValue} TND
                        </p>
                      </div>

                      <div className="space-y-3 bg-white rounded-xl p-4">
                        <h4 className="font-medium mb-2">Détails du Programme</h4>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 rounded-full bg-primaryColor" />
                          <span>{pointSettingsData.getPointSettings.conversionRate * 100}% de vos achats convertis en points</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 rounded-full bg-primaryColor" />
                          <span>Minimum: {pointSettingsData.getPointSettings.minimumPointsToUse.toLocaleString()} points</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 rounded-full bg-primaryColor" />
                          <span>Récompense: Bon d'achat de {pointSettingsData.getPointSettings.loyaltyRewardValue} TND</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* How to Earn Points Card */}

                <div className="md:col-span-2 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4">Comment gagner plus de points ?</h3>

                  <div className="grid md:grid-cols-3 gap-4">

                    {/* Achats en ligne */}
                    <div className="p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all">
                      <div className="w-10 h-10 bg-primaryColor/10 rounded-full flex items-center justify-center text-primaryColor mb-3">
                        <FiShoppingBag className="text-xl" />
                      </div>
                      <h4 className="font-medium mb-1">Achats en ligne</h4>
                      <p className="text-sm text-gray-600">
                        Gagnez {pointSettingsData?.getPointSettings.conversionRate * 100}% en points sur chaque achat effectué sur notre site.
                      </p>
                    </div>

                    {/* Achats en boutique */}
                    <div className="p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all">
                      <div className="w-10 h-10 bg-primaryColor/10 rounded-full flex items-center justify-center text-primaryColor mb-3">
                        <FiMapPin className="text-xl" />
                      </div>
                      <h4 className="font-medium mb-1">Achats en boutique</h4>
                      <p className="text-sm text-gray-600">
                        Gagnez des points en achetant directement chez <strong>ITA Luxury</strong>, situé à <strong>Khzema, rue de la poste, Sousse</strong>.
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Transactions History Tab */}
            <TabsContent value="transactions" className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">Historique des Transactions</h2>
              <div className="space-y-4">
                {user?.pointTransactions?.map((transaction: PointTransaction) => (
                  <div key={transaction.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`px-2 py-1 rounded text-sm ${transaction.type === 'EARNED' ? 'bg-green-100 text-green-800' :
                          transaction.type === 'EXPIRED' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                          {transaction.type}
                        </span>
                        <p className="mt-2 font-medium">{transaction.description}</p>
                      </div>
                      <p className={`font-bold ${transaction.type === 'EARNED' || transaction.type === 'ADMIN_ADDED' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {transaction.type === 'EARNED' || transaction.type === 'ADMIN_ADDED' ? '+' : '-'}{transaction.amount} points
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                ))}
                {(!user?.pointTransactions || user.pointTransactions.length === 0) && (
                  <p className="text-center text-gray-500">Aucune transaction</p>
                )}
              </div>
            </TabsContent>

            {/* Vouchers Tab */}
            <TabsContent value="vouchers" className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">Mes Bons d'achat</h2>
              <div className="grid gap-4">
                {user?.Voucher?.map((voucher: Voucher) => (
                  <div key={voucher.id} className={`border rounded-lg p-4 ${voucher.isUsed ? 'opacity-60' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-2xl font-bold text-primaryColor">{voucher.amount} TND</p>
                        <p className="text-sm text-gray-500">Code: {voucher.code}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${voucher.isUsed ? 'bg-gray-200' : 'bg-green-100 text-green-800'
                        }`}>
                        {voucher.isUsed ? 'Utilisé' : 'Disponible'}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Expire le: {formatDate(voucher.expiresAt)}</p>
                      {voucher.usedAt && (
                        <p>Utilisé le: {formatDate(voucher.usedAt)}</p>
                      )}
                    </div>
                  </div>
                ))}
                {(!user?.Voucher || user.Voucher.length === 0) && (
                  <p className="text-center text-gray-500">Aucun bon d'achat disponible</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;