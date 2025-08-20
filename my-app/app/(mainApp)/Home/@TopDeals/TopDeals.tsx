"use client";
import { BASKET_QUERY, TOP_DEALS } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import React, { useCallback, useMemo, useEffect, useState } from "react";
import ProductDetails from "./ProductDetails";
import { useAuth } from "@/app/hooks/useAuth";
import { useReducedMotion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const TopDeals = ({ userData }: any) => {
  const { decodedToken, isAuthenticated } = useAuth();
  const prefersReducedMotion = useReducedMotion();
  const [isContentVisible, setIsContentVisible] = useState(false);

  // Show content after initial data load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const { data: basketData, loading: basketLoading } = useQuery(BASKET_QUERY, {
    variables: { userId: decodedToken?.userId },
    skip: !isAuthenticated,
    fetchPolicy: "cache-and-network",
  });



  const { data: topDeals, loading: dealsLoading } = useQuery(TOP_DEALS, {
    fetchPolicy: "cache-first",
  });

  const isLoading = dealsLoading || (isAuthenticated && basketLoading);

  // Memoized check for favorite status
  const checkIsFavorite = useCallback((productId: string) => {
    if (!isAuthenticated || !userData?.favorites) return false;
    return userData.favorites.some(
      (fav: any) => fav.productId === productId
    );
  }, [userData, isAuthenticated]);

  // Render loading skeletons
  const renderSkeletons = useMemo(() => {
    return Array(2).fill(0).map((_, index) => (
      <div key={`skeleton-${index}`} className="p-4 border rounded-lg">
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-48 w-full rounded-md" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex justify-between items-center mt-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>
    ));
  }, []);

  // Memoized products render
  const renderProducts = useMemo(() => {
    if (isLoading) return renderSkeletons;
    if (!topDeals?.allDeals || topDeals.allDeals.length === 0) {
      return (
        <div className="col-span-2 flex justify-center items-center p-8 text-gray-500">
          Aucune offre disponible pour le moment
        </div>
      );
    }

    return topDeals.allDeals.map((deal: any) => (
      <ProductDetails
        key={deal.product.id}
        product={deal.product}
        basketData={basketData}
        isFavorite={checkIsFavorite(deal.product.id)}
        userData={userData}
      />
    ));
  }, [topDeals, basketData, userData, isLoading, renderSkeletons, checkIsFavorite]);

  // CSS classes for animation without Framer Motion
  const containerClasses = useMemo(() => {
    const baseClasses = "container mx-auto my-8";
    if (prefersReducedMotion || !isContentVisible) return baseClasses;
    return `${baseClasses} animate-fadeIn`;
  }, [prefersReducedMotion, isContentVisible]);

  return (
    <div className={containerClasses}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Offres Spéciales</h2>
        <Link href="/Collections/tunisie?choice=in-discount" className="text-primaryColor hover:underline text-sm font-medium">
          Voir tout
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-lg shadow-sm overflow-hidden">
        {renderProducts}
      </div>
    </div>
  );
};

export default React.memo(TopDeals);
