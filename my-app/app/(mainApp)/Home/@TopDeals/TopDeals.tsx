import { BASKET_QUERY, TOP_DEALS } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import ProductDetails from "./ProductDetails";
import { useAuth } from "@/app/hooks/useAuth";
import Link from "next/link";

const TopDeals = ({ userData }: any) => {
  const { decodedToken, isAuthenticated } = useAuth();

  const { data: basketData, loading: basketLoading } = useQuery(BASKET_QUERY, {
    variables: { userId: decodedToken?.userId },
    skip: !isAuthenticated,
    fetchPolicy: "cache-first",
  });

  const { data: topDeals, loading: dealsLoading } = useQuery(TOP_DEALS, {
    fetchPolicy: "cache-first",
  });

  const isLoading = dealsLoading || (isAuthenticated && basketLoading);

  const checkIsFavorite = (productId: string) => {
    if (!isAuthenticated || !userData?.favorites) return false;
    return userData.favorites.some((fav: any) => fav.productId === productId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto my-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Offres Spéciales</h2>
          <div className="flex items-center gap-1 font-medium text-xs md:text-base hover:text-secondaryColor transition-colors bg-gray-50 px-4 py-2 rounded-full">
            <Link href="/Collections?choice=in-discount">Voir tout</Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="animate-pulse space-y-4">
                <div className="h-48 bg-gray-200 rounded-md" />
                <div className="h-6 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="flex justify-between items-center mt-2">
                  <div className="h-8 bg-gray-200 rounded w-24" />
                  <div className="h-10 bg-gray-200 rounded-full w-10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!topDeals?.allDeals || topDeals.allDeals.length === 0) {
    return (
      <div className="container mx-auto my-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Offres Spéciales</h2>
          <div className="flex items-center gap-1 font-medium text-xs md:text-base hover:text-secondaryColor transition-colors bg-gray-50 px-4 py-2 rounded-full">
            <Link href="/Collections?choice=in-discount">Voir tout</Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="col-span-2 flex justify-center items-center p-8 text-gray-500">
            Aucune offre disponible pour le moment
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Offres Spéciales</h2>
        <div className="flex items-center gap-1 font-medium text-xs md:text-base hover:text-secondaryColor transition-colors bg-gray-50 px-4 py-2 rounded-full">
          <Link href="/Collections?choice=in-discount">Voir tout</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-lg shadow-sm overflow-hidden">
        {topDeals.allDeals.map((deal: any) => (
          <ProductDetails
            key={deal.product.id}
            product={deal.product}
            basketData={basketData}
            isFavorite={checkIsFavorite(deal.product.id)}
            userData={userData}
          />
        ))}
      </div>
    </div>
  );
};

export default TopDeals;