"use client";

import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useQuery } from "@apollo/client";
import {
  ADVERTISSMENT_QUERY,
  CONTENT_VISIBILITY,
  DELETE_ALL_DISCOUNTS_QUERY,
  TAKE_10_PRODUCTS,
  TAKE_10_PRODUCTS_IN_DISCOUNT,
  TAKE_10_PRODUCTS_PRICE_20,
} from "../../../graphql/queries";
import { BrandsCarousel } from "./Components/BrandCarousel";
import Loading from "./Loader";

const AdsCarousel = dynamic(
  () => import("@/app/components/adverstissment/carousel"),
  { ssr: false, loading: () => <Loading /> },
);
const RightAdsCarousel = dynamic(
  () => import("../../components/adverstissment/RightAdsCarousel"),
  { ssr: false },
);
const SideAds = dynamic(
  () => import("@/app/components/adverstissment/sideAds"),
  { ssr: false },
);
const TitleProduct = dynamic(
  () => import("@/app/components/ProductCarousel/titleProduct"),
  { ssr: false },
);
const BestSales = dynamic(() => import("./@TopSales/BestSales"), {
  ssr: false,
});
const ProductInfo = dynamic(
  () => import("@/app/components/ProductInfo/ProductInfo"),
  { ssr: false },
);
const Services = dynamic(() => import("./Components/services"), {
  ssr: false,
});
const TimeCountDown = dynamic(() => import("./Components/TimeCountDown"), {
  ssr: false,
});
const FullWidthAds = dynamic(
  () => import("@/app/components/adverstissment/FullWidth"),
  { ssr: false },
);
const ProductTabs = dynamic(
  () => import("@/app/components/ProductCarousel/productTabs"),
  { ssr: false },
);
const TopDeals = dynamic(() => import("./@TopDeals/TopDeals"), { ssr: false });
const ClientServices = dynamic(() => import("./Components/ClientServices"), {
  ssr: false,
});
const MainCategoriesSlide = dynamic(
  () => import("./@mainCategoriesSlide/mainCategoriesSlide"),
  { ssr: false },
);
const LeftAdsCarousel = dynamic(
  () => import("../../components/adverstissment/LeftAdsCarousel"),
  { ssr: false },
);
const CenterAds = dynamic(
  () => import("@/app/components/adverstissment/centerAds"),
  { ssr: false },
);

const Home = () => {
  const { data: leftAds, loading: loadingLeftAds } = useQuery(
    ADVERTISSMENT_QUERY,
    { variables: { position: "SideNewProduct" } },
  );
  const { data: rightAds, loading: loadingRightAds } = useQuery(
    ADVERTISSMENT_QUERY,
    { variables: { position: "SidePromotion" } },
  );
  const { data: BannerPromotion, loading: loadingFullPromotionAds } = useQuery(
    ADVERTISSMENT_QUERY,
    { variables: { position: "BannerPromotion" } },
  );
  const { data: leftCarouselAds, loading: loadingLeftCarouselAds } = useQuery(
    ADVERTISSMENT_QUERY,
    { variables: { position: "leftCarouselAds" } },
  );
  const { data: AdsNextToCarousel, loading: loadingAdsNextToCarousel } =
    useQuery(ADVERTISSMENT_QUERY, {
      variables: { position: "NextToCarouselAds" },
    });

  const { data: BannerLessThen20, loading: loadingFull20ProductAds } = useQuery(
    ADVERTISSMENT_QUERY,
    { variables: { position: "BannerLessThen20" } },
  );
  const { data: centerCarouselAds, loading: loadingCenterCarouselAds } =
    useQuery(ADVERTISSMENT_QUERY, { variables: { position: "slider" } });
  const { data: BannerBestDeals, loading: loadingFullTopDealsAds } = useQuery(
    ADVERTISSMENT_QUERY,
    { variables: { position: "BannerBestDeals" } },
  );
  const { data: Products_less_20, loading: loadingProducts_less_20 } = useQuery(
    TAKE_10_PRODUCTS_PRICE_20,
    { variables: { limit: 10 } },
  );
  const {
    data: Products_inDiscount_10,
    loading: loadingProducts_inDiscount_10,
  } = useQuery(TAKE_10_PRODUCTS_IN_DISCOUNT, { variables: { limit: 10 } });
  const { data: NewProducts_10, loading: loadingNewProducts_10 } = useQuery(
    TAKE_10_PRODUCTS,
    { variables: { limit: 10, visibleProduct: true } },
  );
  const { data: TopSellsSectionVisibility } = useQuery(CONTENT_VISIBILITY, {
    variables: { section: "TOP SELL" },
  });
  const { data: TopDealsSectionVisibility } = useQuery(CONTENT_VISIBILITY, {
    variables: { section: "TOP DEAL" },
  });

  useQuery(DELETE_ALL_DISCOUNTS_QUERY);

  const newProducts = useMemo(
    () => NewProducts_10?.allNewProducts,
    [NewProducts_10],
  );
  const discountedProducts = useMemo(
    () => Products_inDiscount_10?.productsDiscounts,
    [Products_inDiscount_10],
  );
  const productsLessThan20 = useMemo(
    () => Products_less_20?.productsLessThen20,
    [Products_less_20],
  );
  console.log(newProducts, "##############");

  return (
    <>
      <CenterAds />

      <div className="Home py-10 flex min-h-screen flex-col items-center px-8">
        <div className="container">
          <section className="flex justify-center lg:flex-row flex-col gap-4 items-center">
            <LeftAdsCarousel
              loadingRightAdsCarousel={loadingAdsNextToCarousel}
              AdsNextToCarousel={AdsNextToCarousel?.advertismentByPosition}
            />
            <AdsCarousel
              loadingCenterAdsCarousel={loadingCenterCarouselAds}
              centerCarouselAds={centerCarouselAds?.advertismentByPosition}
            />
          </section>
          <Services />
          <MainCategoriesSlide />
          <ProductInfo />
          <div className="nouveaux-product-parent-tabs flex flex-col">
            <TitleProduct title={"Nouveaux Produits"} />
            <div className="Carousel_new_product flex gap-3">
              <SideAds
                adsLoaded={loadingLeftAds}
                image={leftAds?.advertismentByPosition[0]?.images[0]}
                link={leftAds?.advertismentByPosition[0]?.link}
                adsPositon={"SideNewProduct"}
              />
              <ProductTabs
                title={"Nouveaux Produits"}
                data={newProducts}
                loadingProduct={loadingNewProducts_10}
                carouselWidthClass={
                  NewProducts_10?.allNewProducts < 5
                    ? "basis-full md:basis-1/2"
                    : "basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4 xxl:basis-1/5"
                }
              />
            </div>
          </div>
          {TopDealsSectionVisibility?.getSectionVisibility
            ?.visibility_status && (
            <>
              <FullWidthAds
                FullAdsLoaded={loadingFullTopDealsAds}
                FullImageAds={
                  BannerBestDeals?.advertismentByPosition[0]?.images[0]
                }
                LinkTo={"/"}
              />
              <div className="TopDeals">
                <div className="flex justify-between flex-col md:flex-row gap-2 items-start">
                  <TitleProduct title={"Meilleures Offres du Jour"} />
                  <div className="flex items-start flex-col md:flex-row md:pt-3">
                    <p className="md:p-2 font-bold">
                      Hâtez-vous ! L'offre se termine dans :
                    </p>
                    <TimeCountDown />
                  </div>
                </div>
                <TopDeals />
              </div>
            </>
          )}
          <FullWidthAds
            FullAdsLoaded={loadingFull20ProductAds}
            FullImageAds={
              BannerLessThen20?.advertismentByPosition[0]?.images[0]
            }
            LinkTo={"/Collections/tunisie?price=20"}
          />
          <div className="Carousel_A_20DT">
            <div className="Heading flex items-center justify-between">
              <TitleProduct title={"L'essentiel à 20DT"} />
              <div className="flex items-center gap-1 font-medium hover:text-secondaryColor transition-colors">
                <Link href={"/Collections/tunisie?price=20"}>
                  Voir tous les produits
                </Link>
                <MdKeyboardArrowRight />
              </div>
            </div>
            <ProductTabs
              data={productsLessThan20}
              loadingProduct={loadingProducts_less_20}
              carouselWidthClass={
                productsLessThan20?.length < 5
                  ? "basis-full w-full lg:basis-1/2"
                  : "basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4 xxl:basis-1/5"
              }
            />
          </div>
          <FullWidthAds
            FullAdsLoaded={loadingFullPromotionAds}
            FullImageAds={BannerPromotion?.advertismentByPosition[0]?.images[0]}
            LinkTo={"/Collections/tunisie?choice=in-discount"}
          />
          <div className="Promotion flex flex-col">
            <div className="flex items-center justify-between">
              <TitleProduct title={"Promotions"} />
              <div className="flex items-center gap-1 font-medium hover:text-secondaryColor transition-colors">
                <Link href={"/Collections/tunisie?choice=in-discount"}>
                  Voir tous les produits
                </Link>
                <MdKeyboardArrowRight />
              </div>
            </div>
            <div className="flex gap-3">
              <ProductTabs
                data={discountedProducts}
                loadingProduct={loadingProducts_inDiscount_10}
                carouselWidthClass={
                  discountedProducts?.length < 5
                    ? "basis-full md:basis-1/2"
                    : "basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4 xxl:basis-1/5"
                }
              />
              <SideAds
                adsLoaded={loadingRightAds}
                image={rightAds?.advertismentByPosition[0]?.images[0]}
                link={rightAds?.advertismentByPosition[0]?.link}
                adsPositon={"Right Ads"}
              />
            </div>
          </div>
          <ClientServices />
          {TopSellsSectionVisibility?.getSectionVisibility
            ?.visibility_status && (
            <div className="BestSeals pb-24">
              <BestSales />
            </div>
          )}
          <BrandsCarousel />
        </div>
      </div>
    </>
  );
};

export default Home;
