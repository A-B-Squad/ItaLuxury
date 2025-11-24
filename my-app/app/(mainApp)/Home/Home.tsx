"use client";

import { useQuery } from "@apollo/client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import {
  ADVERTISSMENT_QUERY,
  CONTENT_VISIBILITY,
  TAKE_14_PRODUCTS,
  TAKE_14_PRODUCTS_IN_DISCOUNT,
  TAKE_14_PRODUCTS_PRICE_20,
} from "../../../graphql/queries";

// Critical components - load immediately
import AdsCarousel from "@/app/components/adverstissment/carousel";
import LeftAdsCarousel from "../../components/adverstissment/LeftAdsCarousel";
import { BrandsCarousel } from "./Components/BrandCarousel";
import TitleProduct from "@/app/components/ProductCarousel/titleProduct";
import SearchBar from "@/app/components/Header/SearchBar";

// Dynamic imports for non-critical components
const CenterAds = dynamic(() => import("@/app/components/adverstissment/centerAds"));
const SideAds = dynamic(() => import("@/app/components/adverstissment/sideAds"), {
  ssr: false
});

const FullWidthAds = dynamic(() => import("@/app/components/adverstissment/FullWidth"), {
  ssr: false
});

const Services = dynamic(() => import("../../components/adverstissment/Services"), {
  ssr: false
});

const TopSales = dynamic(() => import("./@TopSales/ToptSales"), {
  ssr: false
});

const TimeCountDown = dynamic(() => import("./Components/TimeCountDown"), {
  ssr: false
});

const ProductTabs = dynamic(() => import("@/app/components/ProductCarousel/productTabs"), {
  ssr: false
});

const TopDeals = dynamic(() => import("./@TopDeals/TopDeals"), {
  ssr: false
});

const ClientServices = dynamic(() => import("../../components/adverstissment/ClientServices"), {
  ssr: false
});

const MainCategoriesSlide = dynamic(() => import("./@mainCategoriesSlide/mainCategoriesSlide"), {
  ssr: false
});


const Home = ({ userData }: any) => {
  const { data: centerCarouselAds, loading: loadingCenterCarouselAds } =
    useQuery(ADVERTISSMENT_QUERY, {
      variables: { position: "slider" },
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
    });

  const { data: AdsNextToCarousel, loading: loadingAdsNextToCarousel } =
    useQuery(ADVERTISSMENT_QUERY, {
      variables: { position: "NextToCarouselAds" },
      fetchPolicy: "cache-first",
    });

  // Visibility queries
  const { data: TopSellsSectionVisibility } = useQuery(CONTENT_VISIBILITY, {
    variables: { section: "TOP SELL" },
    fetchPolicy: "cache-first",
  });

  const { data: TopDealsSectionVisibility } = useQuery(CONTENT_VISIBILITY, {
    variables: { section: "TOP DEAL" },
    fetchPolicy: "cache-first",
  });

  // Secondary queries
  const { data: leftAds, loading: loadingLeftAds } = useQuery(ADVERTISSMENT_QUERY, {
    variables: { position: "SideNewProduct" },
    fetchPolicy: "cache-first",
  });

  const { data: rightAds, loading: loadingRightAds } = useQuery(ADVERTISSMENT_QUERY, {
    variables: { position: "SidePromotion" },
    fetchPolicy: "cache-first",
  });

  const { data: BannerPromotion, loading: loadingFullPromotionAds } = useQuery(ADVERTISSMENT_QUERY, {
    variables: { position: "BannerPromotion" },
    fetchPolicy: "cache-first",
  });

  const { data: clinetContactSideAds, loading: loadingClinetContactSideAds } =
    useQuery(ADVERTISSMENT_QUERY, {
      variables: { position: "clinetContactSideAds" },
      fetchPolicy: "cache-first",
    });

  const { data: BannerLessThen20, loading: loadingFull20ProductAds } = useQuery(ADVERTISSMENT_QUERY, {
    variables: { position: "BannerLessThen20" },
    fetchPolicy: "cache-first",
  });

  const { data: BannerBestDeals, loading: loadingFullTopDealsAds } = useQuery(ADVERTISSMENT_QUERY, {
    variables: { position: "BannerBestDeals" },
    fetchPolicy: "cache-first",
  });

  // Product queries
  const { data: Products_less_20, loading: loadingProducts_less_20 } = useQuery(TAKE_14_PRODUCTS_PRICE_20, {
    variables: { limit: 14 },
    fetchPolicy: "cache-first",
  });

  const { data: Products_inDiscount_14, loading: loadingProducts_inDiscount_14 } = useQuery(TAKE_14_PRODUCTS_IN_DISCOUNT, {
    variables: { limit: 14 },
    fetchPolicy: "cache-first",
  });

  const { data: NewProducts_14, loading: loadingNewProducts_14 } = useQuery(TAKE_14_PRODUCTS, {
    variables: { limit: 14, visibleProduct: true },
    fetchPolicy: "cache-first",
  });


  // Show conditions
  const showTopDeals = TopDealsSectionVisibility?.getSectionVisibility?.visibility_status;
  const showTopSells = TopSellsSectionVisibility?.getSectionVisibility?.visibility_status;

  return (
    <div className="Home flex min-h-screen flex-col">
      {/* Hero Carousel - Full Screen */}
      <section className="w-full">
        <AdsCarousel
          loadingCenterAdsCarousel={loadingCenterCarouselAds}
          centerCarouselAds={centerCarouselAds?.advertismentByPosition}
        />
      </section>

      {/* Main Content */}
      <div className="container mx-auto space-y-10 overflow-hidden py-10 md:px-8 px-3">
  
        {/* Services section */}
        <Services />

        {/* Main content */}
        <div className="view lg:px-10 space-y-10">
          {/* Top Deals Section */}
          {showTopDeals && (
            <div className="space-y-8">
              <FullWidthAds
                FullAdsLoaded={loadingFullTopDealsAds}
                FullImageAds={BannerBestDeals?.advertismentByPosition[0]?.images[0]}
                LinkTo={"/"}
              />

              <div className="TopDeals bg-white md:p-6 p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between flex-col md:flex-row mb-8 gap-4 items-start">
                  <TitleProduct title={"Meilleures Offres du Jour"} />

                  <div className="flex gap-1 items-center flex-col md:flex-row md:bg-gradient-to-r from-amber-50 to-orange-50 md:px-5 md:py-3 md:rounded-lg">
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

          {/* Categories Slide */}
          <MainCategoriesSlide />

          {/* New Products Section */}
          <div className="new-product-parent-tabs relative flex flex-col bg-white p-1 md:p-6 rounded-xl shadow-sm border border-gray-100">

            <div className="Heading pb-14 p-5 md:p-0 md:pb-5 flex mb-5 md:mb-10 items-center justify-between">
              <TitleProduct title={"Nouveaux Produits"} />
              <div className="flex items-center gap-1 font-medium text-xs md:text-base hover:text-secondaryColor transition-colors bg-gray-50 px-4 py-2 rounded-full">
                <Link href={"/Collections?choice=new-product"}>
                  Voir tous les produits
                </Link>
                <MdKeyboardArrowRight />
              </div>
            </div>

            <div className="Carousel_new_product w-full relative flex items-start gap-6 ov">
              <div className="sideImg 2xl:flex-col gap-6 w-fit hidden 2xl:flex">
                <SideAds
                  adsLoaded={loadingClinetContactSideAds}
                  image={clinetContactSideAds?.advertismentByPosition[0]?.images[0]}
                  adsPositon={"SideNewProduct"}
                  link={clinetContactSideAds?.advertismentByPosition[0]?.link}
                />

                <SideAds
                  adsLoaded={loadingLeftAds}
                  image={leftAds?.advertismentByPosition[0]?.images[0]}
                  link={leftAds?.advertismentByPosition[0]?.link}
                  adsPositon={"SideNewProduct"}
                />
              </div>
              <ProductTabs
                userData={userData}
                data={NewProducts_14?.allNewProducts || []}
                loadingProduct={loadingNewProducts_14}
                className={"basis-1/2 md:basis-1/3 lg:basis-1/4"}
              />
            </div>
          </div>

          <FullWidthAds
            FullAdsLoaded={loadingFull20ProductAds}
            FullImageAds={BannerLessThen20?.advertismentByPosition[0]?.images[0]}
            LinkTo={"/Collections?price=20"}
          />

          <div className="Carousel_A_20DT bg-white p-1 md:p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="Heading pb-14 p-5 md:p-0 md:pb-5 flex mb-5 md:mb-10 items-center justify-between">
              <TitleProduct title={"L'essentiel à 20DT"} />
              <div className="flex items-center gap-1 font-medium text-xs md:text-base hover:text-secondaryColor transition-colors bg-gray-50 px-4 py-2 rounded-full">
                <Link href={"/Collections?price=20"}>
                  Voir tous les produits
                </Link>
                <MdKeyboardArrowRight />
              </div>
            </div>

            <ProductTabs
              userData={userData}
              data={Products_less_20?.productsLessThen20 || []}
              loadingProduct={loadingProducts_less_20}
              className={"basis-1/2 md:basis-1/3 lg:basis-1/5 xl:basis-1/6"}
            />
          </div>

          <FullWidthAds
            FullAdsLoaded={loadingFullPromotionAds}
            FullImageAds={BannerPromotion?.advertismentByPosition[0]?.images[0]}
            LinkTo={"/Collections?choice=in-discount"}
          />

          <div className="Promotion flex flex-col bg-white p-1 md:p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="Heading pb-14 p-5 md:p-0 md:pb-5 flex mb-5 md:mb-10 items-center justify-between">
              <TitleProduct title={"Promotions"} />
              <div className="flex items-center gap-1 font-medium text-xs md:text-base hover:text-secondaryColor transition-colors bg-gray-50 px-4 py-2 rounded-full">
                <Link href={"/Collections?choice=in-discount"}>
                  Voir tous les produits
                </Link>
                <MdKeyboardArrowRight />
              </div>
            </div>
            <div className="relative items-start gap-6 flex">
              <ProductTabs
                userData={userData}
                data={Products_inDiscount_14?.productsDiscounts || []}
                loadingProduct={loadingProducts_inDiscount_14}
                className={"basis-1/2 md:basis-1/3 lg:basis-1/4 2xl:basis-1/5"}
              />

              <div className="sideImg w-fit hidden 2xl:block">
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

        {/* Client Services */}
        <ClientServices />

        {/* Top Sales Section */}
        {showTopSells && (
          <div className="BestSeals pb-10 bg-white p-1 md:p-6 rounded-xl shadow-sm border border-gray-100 mb-16">
            <div className="Heading pb-5">
              <TitleProduct title={"Meilleures Ventes"} />
            </div>
            <TopSales userData={userData} />
          </div>
        )}

        {/* Brands Carousel */}
        <BrandsCarousel />
      </div>
    </div>
  );
};

export default Home;