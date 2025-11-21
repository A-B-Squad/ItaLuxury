import { ALL_BRANDS, CATEGORIES_QUERY_NOGQL, COLORS_QUERY } from "@/graphql/queries";
import { fetchGraphQLData } from "@/utils/graphql";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import dynamic from "next/dynamic";
import { ReactNode } from "react";
import SideBarSkeleton from "./components/SideBar/components/LoadingSkeleton/SideBarSkeleton";

// Types
interface LayoutProps {
  children: ReactNode;
}

interface FetchedData {
  categories: any[];
  brands: any[];
  colors: any[];
}

// Dynamic import with loading fallback
const SideBar = dynamic(
  () => import("./components/SideBar/SideBar"),
  {
    ssr: false,
    loading: () => <SideBarSkeleton />
  }
);

// Apollo Client dev tools setup
if (process.env.NODE_ENV === "development") {
  loadDevMessages();
  loadErrorMessages();
}

// Environment validation
if (!process.env.NEXT_PUBLIC_API_URL || !process.env.NEXT_PUBLIC_BASE_URL_DOMAIN) {
  throw new Error("Required environment variables are not defined");
}

// Data fetching with error handling
async function fetchData(): Promise<FetchedData> {
  try {
    const [categoriesResult, brandsResult, colorsResult] = await Promise.all([
      fetchGraphQLData(CATEGORIES_QUERY_NOGQL),
      fetchGraphQLData(ALL_BRANDS),
      fetchGraphQLData(COLORS_QUERY),
    ]);


    return {
      categories: categoriesResult?.fetchMainCategories || [],
      brands: brandsResult?.fetchBrands || [],
      colors: colorsResult?.colors || []
    };
  } catch (error) {
    console.error("Error fetching sidebar data:", error);
    return {
      categories: [],
      brands: [],
      colors: []
    };
  }
}

export default async function Layout({ children }: LayoutProps) {
  const { categories, brands, colors } = await fetchData();

  return (
    <div className="relative flex w-full flex-col -z-0">
      <div className="container gap-3 px-4 flex md:flex-row items-center md:items-start flex-col-reverse relative w-full h-full">
        <SideBar
          categories={categories}
          brands={brands}
          colors={colors}
        />
        <main className="relative flex-1 w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}