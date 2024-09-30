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
  TAKE_16_PRODUCTS,
  TAKE_16_PRODUCTS_IN_DISCOUNT,
  TAKE_16_PRODUCTS_PRICE_20,
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
    TAKE_16_PRODUCTS_PRICE_20,
    { variables: { limit: 16 }, fetchPolicy: "network-only" },
  );

  const {
    data: Products_inDiscount_16,
    loading: loadingProducts_inDiscount_16,
  } = useQuery(TAKE_16_PRODUCTS_IN_DISCOUNT, {
    variables: { limit: 16 },
    fetchPolicy: "network-only",
  });

  const { data: NewProducts_16, loading: loadingNewProducts_16 } = useQuery(
    TAKE_16_PRODUCTS,
    {
      variables: { limit: 16, visibleProduct: true },
      fetchPolicy: "network-only",
    },
  );
  const { data: TopSellsSectionVisibility } = useQuery(CONTENT_VISIBILITY, {
    variables: { section: "TOP SELL" },
  });
  const { data: TopDealsSectionVisibility } = useQuery(CONTENT_VISIBILITY, {
    variables: { section: "TOP DEAL" },
  });

  useQuery(DELETE_ALL_DISCOUNTS_QUERY);

  const newProducts = useMemo(
    () => NewProducts_16?.allNewProducts,
    [NewProducts_16],
  );
  const discountedProducts = useMemo(
    () => Products_inDiscount_16?.productsDiscounts,
    [Products_inDiscount_16],
  );
  const productsLessThan20 = useMemo(
    () => Products_less_20?.productsLessThen20,
    [Products_less_20],
  );

  return (
    <>
      <CenterAds />
      <div className="Home py-10 flex min-h-screen flex-col items-center px-8">
        <div className="container overflow-hidden">
          <section className="TOP-IMG flex justify-center xl:flex-row flex-col-reverse  gap-4 items-center">
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

          <div className="view lg:px-20">
            <ProductInfo />
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
                  <div className="flex justify-between flex-col md:flex-row mb-5 gap-2 items-start">
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
            <MainCategoriesSlide />

            <div className="new-product-parent-tabs relative   flex flex-col">
              <div className="Heading pb-8 flex items-center mb-5 justify-between ">
                <TitleProduct title={"Nouveaux Produits"} />
                <div className="flex items-center gap-1 font-medium  text-xs md:text-base hover:text-secondaryColor transition-colors">
                  <Link href={"/Collections/tunisie?choice=new-product"}>
                    Voir tous les produits
                  </Link>
                  <MdKeyboardArrowRight />
                </div>
              </div>
              <div className="Carousel_new_product relative  items-center gap-5 grid grid-cols-12 ">
                <div className="ads  flex-col gap-3  hidden xl:flex xl:col-span-2">
                  <SideAds
                    adsLoaded={loadingLeftAds}
                    image={leftAds?.advertismentByPosition[0]?.images[0]}
                    link={leftAds?.advertismentByPosition[0]?.link}
                    adsPositon={"SideNewProduct"}
                  />
                  <SideAds
                    adsLoaded={loadingLeftAds}
                    image={leftAds?.advertismentByPosition[0]?.images[0]}
                    link={leftAds?.advertismentByPosition[0]?.link}
                    adsPositon={"SideNewProduct"}
                  />
                </div>

                <div className=" col-span-12 xl:col-span-10">
                  <ProductTabs
                    data={newProducts}
                    loadingProduct={loadingNewProducts_16}
                  />
                </div>
              </div>
            </div>

            <FullWidthAds
              FullAdsLoaded={loadingFull20ProductAds}
              FullImageAds={
                BannerLessThen20?.advertismentByPosition[0]?.images[0]
              }
              LinkTo={"/Collections/tunisie?price=20"}
            />
            <div className="Carousel_A_20DT">
              <div className="Heading pb-8 flex mb-5 items-center justify-between">
                <TitleProduct title={"L'essentiel à 20DT"} />
                <div className="flex items-center gap-1 font-medium text-xs md:text-base hover:text-secondaryColor transition-colors">
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
            <div className="Promotion flex flex-col">
              <div className="Heading pb-8 flex items-center mb-5 justify-between">
                <TitleProduct title={"Promotions"} />
                <div className="flex items-center gap-1 font-medium text-xs md:text-base hover:text-secondaryColor transition-colors">
                  <Link href={"/Collections/tunisie?choice=in-discount"}>
                    Voir tous les produits
                  </Link>
                  <MdKeyboardArrowRight />
                </div>
              </div>
              <div className=" items-center grid  grid-cols-12 gap-5">
                <div className="productTabs col-span-12 xl:col-span-10">
                  <ProductTabs
                    data={discountedProducts}
                    loadingProduct={loadingProducts_inDiscount_16}
                  />
                </div>
                <div className="ads   hidden xl:block xl:col-span-2">
                  <SideAds
                    adsLoaded={loadingRightAds}
                    image={rightAds?.advertismentByPosition[0]?.images[0]}
                    link={rightAds?.advertismentByPosition[0]?.link}
                    adsPositon={"Right Ads"}
                  />
                </div>
              </div>
            </div>
          </div>

          <ClientServices />
          {TopSellsSectionVisibility?.getSectionVisibility
            ?.visibility_status && (
            <div className="BestSeals pb-10">
              <div className="Heading pb-8 flex items-center mb-5 justify-between">
                <TitleProduct title={"Meilleures Ventes"} />
              </div>
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
