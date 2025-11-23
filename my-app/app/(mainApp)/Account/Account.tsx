"use client";
import { useProductComparisonStore } from "@/app/store/zustand";
import { GET_POINT_SETTINGS } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import LoadingState from "./components/LoadingState";
import NotLoggedInState from "./components/NotLoggedInState";
import UserInfoSection from "./components/UserInfoSection";
import ProgressCardContent from "./components/ProgressCardContent";
import TransactionsList from "./components/TransactionsList";
import VouchersList from "./components/VouchersList";

const Account = ({ userData }: any) => {
  const {
    data: pointSettingsData,
    loading: pointsLoading,
    error: pointsError,
  } = useQuery(GET_POINT_SETTINGS);
  const { comparisonList } = useProductComparisonStore();
  const user = userData;

  if (!user && pointsLoading) {
    return <LoadingState />;
  }

  if (!user) {
    return <NotLoggedInState />;
  }

  if (pointsError) {
    console.error("Points settings error:", pointsError);
  }

  const minimumPoints = pointSettingsData?.getPointSettings?.minimumPointsToUse || "des";
  const userPoints = user?.points || 0;

  return (
    <div className="container py-8 px-4 md:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="profile" className="w-full">
          {/* Tab Navigation */}
          <TabsList className="flex flex-wrap gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger
              value="profile"
              className="flex-1 min-w-[120px] px-4 py-2.5 rounded-md font-medium text-sm transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900"
            >
              Profil
            </TabsTrigger>
            <TabsTrigger
              value="points"
              className="flex-1 min-w-[120px] px-4 py-2.5 rounded-md font-medium text-sm transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900"
            >
              Points
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="flex-1 min-w-[120px] px-4 py-2.5 rounded-md font-medium text-sm transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900"
            >
              Transactions
            </TabsTrigger>
            <TabsTrigger
              value="vouchers"
              className="flex-1 min-w-[120px] px-4 py-2.5 rounded-md font-medium text-sm transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900"
            >
              Bons d'achat
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">
                Informations Personnelles
              </h2>
              <UserInfoSection user={user} />
            </div>
          </TabsContent>

          {/* Points Tab */}
          <TabsContent value="points" className="mt-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">
                Mes Points de Fidélité
              </h2>

              {/* Progress Card */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">
                  Prochain Bon d'achat
                </h3>
                <ProgressCardContent
                  pointsLoading={pointsLoading}
                  pointsError={pointsError}
                  pointSettingsData={pointSettingsData}
                  userPoints={userPoints}
                />
              </div>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="mt-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">
                Historique des Transactions
              </h2>
              <TransactionsList transactions={user?.pointTransactions} />
            </div>
          </TabsContent>

          {/* Vouchers Tab */}
          <TabsContent value="vouchers" className="mt-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">
                Mes Bons d'achat
              </h2>
              <VouchersList
                vouchers={user?.Voucher}
                minimumPoints={minimumPoints}
                userPoints={userPoints}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Account;