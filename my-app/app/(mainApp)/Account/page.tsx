"use client";
import { useAuth } from "@/lib/auth/useAuth";
import { useQuery } from "@apollo/client";
import { FETCH_USER_BY_ID } from "@/graphql/queries";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FiUser, FiHeart, FiMapPin, FiLock } from "react-icons/fi";
import { GoPackageDependents } from "react-icons/go";
import { IoGitCompare } from "react-icons/io5";
import Link from "next/link";
import { useProductComparisonStore } from "@/app/store/zustand";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

const AccountPage = () => {
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
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="profile">Informations personnelles</TabsTrigger>
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
                  <p>{new Date(user?.createdAt).toLocaleDateString("fr-FR")}</p>
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
            
          
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;