"use client";

import { useQuery } from "@apollo/client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import {
  ADVERTISSMENT_QUERY,
  CONTENT_VISIBILITY,
  DELETE_ALL_DISCOUNTS_QUERY,
  TAKE_14_PRODUCTS,
  TAKE_14_PRODUCTS_IN_DISCOUNT,
  TAKE_14_PRODUCTS_PRICE_20,
} from "../../../graphql/queries";
import { BrandsCarousel } from "./Components/BrandCarousel";

import AdsCarousel from "@/app/components/adverstissment/carousel";
import LeftAdsCarousel from "../../components/adverstissment/LeftAdsCarousel";


const CenterAds = dynamic(
  () => import("@/app/components/adverstissment/centerAds"),
  { ssr: false }
);

const RightAdsCarousel = dynamic(
  () => import("../../components/adverstissment/RightAdsCarousel"),
  { ssr: false }
);
import SideAds from "@/app/components/adverstissment/sideAds"
import NoProductYet from "@/app/components/ProductCarousel/NoProductYet";
const TitleProduct = dynamic(
  () => import("@/app/components/ProductCarousel/titleProduct"),
  { ssr: false }
);
const TopSales = dynamic(() => import("./@TopSales/ToptSales"), {
  ssr: false,
});

const Services = dynamic(() => import("./Components/services"), {
  ssr: false,
});
const TimeCountDown = dynamic(() => import("./Components/TimeCountDown"), {
  ssr: false,
});
const FullWidthAds = dynamic(
  () => import("@/app/components/adverstissment/FullWidth"),
  { ssr: false }
);
const ProductTabs = dynamic(
  () => import("@/app/components/ProductCarousel/productTabs"),
  {
    ssr: false,
    loading: () => <NoProductYet />
  }
);

const TopDeals = dynamic(() => import("./@TopDeals/TopDeals"), { ssr: false });
const ClientServices = dynamic(() => import("./Components/ClientServices"), {
  ssr: false,
});
const MainCategoriesSlide = dynamic(
  () => import("./@mainCategoriesSlide/mainCategoriesSlide"),
  { ssr: false }
);

const Home = ({userData}:any) => {
  const { data: leftAds, loading: loadingLeftAds } = useQuery(
    ADVERTISSMENT_QUERY,
    { variables: { position: "SideNewProduct" } }
  );
  const { data: rightAds, loading: loadingRightAds } = useQuery(
    ADVERTISSMENT_QUERY,
    { variables: { position: "SidePromotion" } }
  );
  const { data: BannerPromotion, loading: loadingFullPromotionAds } = useQuery(
    ADVERTISSMENT_QUERY,
    { variables: { position: "BannerPromotion" } }
  );
  const { data: clinetContactSideAds, loading: loadingClinetContactSideAds } =
    useQuery(ADVERTISSMENT_QUERY, {
      variables: { position: "clinetContactSideAds" },
    });

  const { data: AdsNextToCarousel, loading: loadingAdsNextToCarousel } =
    useQuery(ADVERTISSMENT_QUERY, {
      variables: { position: "NextToCarouselAds" },
    });

  const { data: BannerLessThen20, loading: loadingFull20ProductAds } = useQuery(
    ADVERTISSMENT_QUERY,
    { variables: { position: "BannerLessThen20" } }
  );
  const { data: centerCarouselAds, loading: loadingCenterCarouselAds } =
    useQuery(ADVERTISSMENT_QUERY, { variables: { position: "slider" } });
  const { data: BannerBestDeals, loading: loadingFullTopDealsAds } = useQuery(
    ADVERTISSMENT_QUERY,
    { variables: { position: "BannerBestDeals" } }
  );
  const { data: Products_less_20, loading: loadingProducts_less_20 } = useQuery(
    TAKE_14_PRODUCTS_PRICE_20,
    { variables: { limit: 14 }, fetchPolicy: "cache-first" }
  );

  const {
    data: Products_inDiscount_14,
    loading: loadingProducts_inDiscount_14,
  } = useQuery(TAKE_14_PRODUCTS_IN_DISCOUNT, {
    variables: { limit: 14 },
    fetchPolicy: "cache-first",
  });

  const { data: NewProducts_14, loading: loadingNewProducts_14 } = useQuery(
    TAKE_14_PRODUCTS,
    {
      variables: { limit: 14, visibleProduct: true },
      fetchPolicy: "cache-and-network"
    }
  );
  const { data: TopSellsSectionVisibility } = useQuery(CONTENT_VISIBILITY, {
    variables: { section: "TOP SELL" },
  });
  const { data: TopDealsSectionVisibility } = useQuery(CONTENT_VISIBILITY, {
    variables: { section: "TOP DEAL" },
  });

  useQuery(DELETE_ALL_DISCOUNTS_QUERY);

  const newProducts = useMemo(
    () => NewProducts_14?.allNewProducts,
    [NewProducts_14]
  );
  const discountedProducts = useMemo(
    () => Products_inDiscount_14?.productsDiscounts,
    [Products_inDiscount_14]
  );
  const productsLessThan20 = useMemo(
    () => Products_less_20?.productsLessThen20,
    [Products_less_20]
  );

  // Add a loading state to show a better loading experience
  const isLoading = loadingNewProducts_14 || loadingProducts_inDiscount_14 || loadingProducts_less_20;

  return (
    <>
      {/* <CenterAds /> */}
      <div className="Home py-7 flex min-h-screen flex-col items-center md:px-8 px-3">
        <div className="container mx-auto overflow-hidden ">
          {/* Loading indicator with improved design */}
          {/* {isLoading && (
            <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 border-2 border-gray-200 rounded-full"></div>
                <div className="absolute inset-0 border-t-2 border-primaryColor rounded-full animate-spin"></div>
              </div>
              <p className="mt-6 text-gray-700 font-light tracking-wider">CHARGEMENT</p>
            </div>
          )} */}

          {/* Hero section with improved spacing and alignment */}
          <section className="TOP-IMG flex justify-center xl:flex-row flex-col-reverse gap-6 items-center mb-10">
            <LeftAdsCarousel
              loadingLeftAdsCarousel={loadingAdsNextToCarousel}
              AdsNextToCarousel={AdsNextToCarousel?.advertismentByPosition}
            />
            <AdsCarousel
              loadingCenterAdsCarousel={loadingCenterCarouselAds}
              centerCarouselAds={centerCarouselAds?.advertismentByPosition}
            />
          </section>

          {/* Services section with better spacing */}
          <div className="mb-10 mt-8">
            <Services />
          </div>

          {/* Main content with improved spacing and visual hierarchy */}
          <div className="view lg:px-10 space-y-16">
            {TopDealsSectionVisibility?.getSectionVisibility
              ?.visibility_status && (
                <div className="space-y-8">
                  <FullWidthAds
                    FullAdsLoaded={loadingFullTopDealsAds}
                    FullImageAds={
                      BannerBestDeals?.advertismentByPosition[0]?.images[0]
                    }
                    LinkTo={"/"}
                  />
                  <div className="TopDeals bg-white md:p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between flex-col md:flex-row mb-8 gap-4 items-start">
                      <TitleProduct title={"Meilleures Offres du Jour"} />
                      <div className="flex items-center flex-col md:flex-row md:bg-gradient-to-r from-amber-50 to-orange-50 md:px-5 md:py-3 md:rounded-lg md:shadow-sm border border-amber-100">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 animate-pulse mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="md:mr-3 font-bold text-gray-800 whitespace-nowrap">
                            DERNIÈRE CHANCE ! Offres exclusives :
                          </p>
                        </div>
                        <TimeCountDown />
                      </div>
                    </div>
                    <TopDeals userData={userData} />
                  </div>
                </div>
              )}

            <div className="bg-gray-50 px-6 rounded-xl -mx-6">
              <MainCategoriesSlide />
            </div>

            <div className="new-product-parent-tabs relative flex flex-col bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="Heading pb-16 md:pb-8 flex items-center mb-5 justify-between">
                <TitleProduct title={"Nouveaux Produits"} />
                <div className="flex items-center gap-1 font-medium text-xs md:text-base hover:text-secondaryColor transition-colors bg-gray-50 px-4 py-2 rounded-full">
                  <Link href={"/Collections/tunisie?choice=new-product"}>
                    Voir tous les produits
                  </Link>
                  <MdKeyboardArrowRight />
                </div>
              </div>
              <div className="Carousel_new_product relative items-center gap-6 flex">
                <div className="sideImg xl:flex-col gap-6 w-fit hidden xl:flex">
                  <SideAds
                    adsLoaded={loadingClinetContactSideAds}
                    image={
                      clinetContactSideAds?.advertismentByPosition[0]?.images[0]
                    }
                    link={clinetContactSideAds?.advertismentByPosition[0]?.link}
                    adsPositon={"SideNewProduct"}
                  />
                  <SideAds
                    adsLoaded={loadingLeftAds}
                    image={leftAds?.advertismentByPosition[0]?.images[0]}
                    link={leftAds?.advertismentByPosition[0]?.link}
                    adsPositon={"SideNewProduct"}
                  />
                </div>

                <ProductTabs
                  data={newProducts}
                  loadingProduct={loadingNewProducts_14}
                />
              </div>
            </div>

            <FullWidthAds
              FullAdsLoaded={loadingFull20ProductAds}
              FullImageAds={
                BannerLessThen20?.advertismentByPosition[0]?.images[0]
              }
              LinkTo={"/Collections/tunisie?price=20"}
            />

            <div className="Carousel_A_20DT bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="Heading pb-16 md:pb-8 flex mb-5 items-center justify-between">
                <TitleProduct title={"L'essentiel à 20DT"} />
                <div className="flex items-center gap-1 font-medium text-xs md:text-base hover:text-secondaryColor transition-colors bg-gray-50 px-4 py-2 rounded-full">
                  <Link href={"/Collections/tunisie?price=20"}>
                    Voir tous les produits
                  </Link>
                  <MdKeyboardArrowRight />
                </div>
              </div>

              <ProductTabs
                data={productsLessThan20}
                loadingProduct={loadingProducts_less_20}
              />
            </div>

            <FullWidthAds
              FullAdsLoaded={loadingFullPromotionAds}
              FullImageAds={
                BannerPromotion?.advertismentByPosition[0]?.images[0]
              }
              LinkTo={"/Collections/tunisie?choice=in-discount"}
            />

            <div className="Promotion flex flex-col bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="Heading pb-16 md:pb-8 flex items-center mb-5 justify-between">
                <TitleProduct title={"Promotions"} />
                <div className="flex items-center gap-1 font-medium text-xs md:text-base hover:text-secondaryColor transition-colors bg-gray-50 px-4 py-2 rounded-full">
                  <Link href={"/Collections/tunisie?choice=in-discount"}>
                    Voir tous les produits
                  </Link>
                  <MdKeyboardArrowRight />
                </div>
              </div>
              <div className="relative items-center gap-6 flex">
                <ProductTabs
                  data={discountedProducts}
                  loadingProduct={loadingProducts_inDiscount_14}
                />
                <div className="sideImg w-fit hidden xl:block">
                  <SideAds
                    adsLoaded={loadingRightAds}
                    image={rightAds?.advertismentByPosition[0]?.images[0]}
                    link={rightAds?.advertismentByPosition[0]?.link}
                    adsPositon={"Right Img"}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="my-10 md:my-16 w-full">
            <ClientServices />
          </div>

          {TopSellsSectionVisibility?.getSectionVisibility
            ?.visibility_status && (
              <div className="BestSeals pb-10 bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-16">
                <div className="Heading pb-8 flex items-center mb-5 justify-between">
                  <TitleProduct title={"Meilleures Ventes"} />
                </div>
                <TopSales userData={userData} />
              </div>
            )}

          <div className="bg-gray-50 py-8 px-6 rounded-xl -mx-6 mb-8">
            <BrandsCarousel />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
