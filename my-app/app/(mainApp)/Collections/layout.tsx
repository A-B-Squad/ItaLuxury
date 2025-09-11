import { ALL_BRANDS, CATEGORIES_QUERY, COLORS_QUERY } from "@/graphql/queries";
import { fetchGraphQLData } from "@/utlils/graphql";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import dynamic from "next/dynamic";
import { ReactNode } from "react";


const SideBar = dynamic(() => import("./components/sideBar"), { ssr: false });
if (process.env.NODE_ENV === "development") {
  loadDevMessages();
  loadErrorMessages();
}

interface LayoutProps {
  children: ReactNode;
}
if (
  !process.env.NEXT_PUBLIC_API_URL ||
  !process.env.NEXT_PUBLIC_BASE_URL_DOMAIN
) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}


async function fetchData() {
  const [categoriesData, brandsData, colorsData] = await Promise.all([
    fetchGraphQLData(CATEGORIES_QUERY),
    fetchGraphQLData(ALL_BRANDS),
    fetchGraphQLData(COLORS_QUERY),
  ]);

  return {
    categories: categoriesData?.categories,
    brands: brandsData?.fetchBrands,
    colors: colorsData?.colors,
  };
}

export default async function Layout({ children }: LayoutProps) {
  const { categories, brands, colors } = await fetchData();
  return (
    <div className="relative flex w-full flex-col -z-0">
      <div className="container gap-3 px-4 flex md:flex-row items-center md:items-start flex-col-reverse relative w-full h-full">
        <SideBar categories={categories} brands={brands} colors={colors} />
        <main style={{ width: "inherit" }} className="relative">
          {children}
        </main>
      </div>
    </div>
  );
}
