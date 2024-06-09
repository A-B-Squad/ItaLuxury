"use client";

import dynamic from "next/dynamic";
import AdsCarousel from "@/components/adverstissment/carousel";
import RightAdsCarousel from "../../components/adverstissment/RightAdsCarousel";
import SideAds from "@/components/adverstissment/sideAds";
import TitleProduct from "@/components/ProductCarousel/titleProduct";
import BestSales from "./TopSales/BestSales";
import React, { useMemo } from "react";
import ProductInfo from "../../components/ProductInfo/ProductInfo";
import Services from "./_components/services";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import { BrandsCarousel } from "./_components/BrandCarousel";
import TimeCountDown from "./_components/TimeCountDown";
import FullWidthAds from "../../components/adverstissment/FullWidth";
import ProductTabs from "@/components/ProductCarousel/productTabs";
import TopDeals from "./TopDeals/TopDeals";
const ClientServices = dynamic(() => import("./_components/ClientServices"));

import { useQuery } from "@apollo/client";
import {
  ADVERTISSMENT_QUERY,
  CONTENT_VISIBILITY,
  DELETE_ALL_DISCOUNTS_QUERY,
  TAKE_6_PRODUCTS,
  TAKE_6_PRODUCTS_IN_DISCOUNT,
  TAKE_6_PRODUCTS_PRICE_20,
} from "../../../graphql/queries";
const Home = () => {
  const { data: leftAds, loading: loadingLeftAds } = useQuery(
    ADVERTISSMENT_QUERY,
    {
      variables: { position: "left_ads_product" },
    }
  );
  const { data: rightAds, loading: loadingRightAds } = useQuery(
    ADVERTISSMENT_QUERY,
    {
      variables: { position: "right_ads_product" },
    }
  );
  const { data: FullAdsPromotion, loading: loadingFullPromotionAds } = useQuery(
    ADVERTISSMENT_QUERY,
    {
      variables: { position: "FullAdsPromotion" },
    }
  );
  const { data: leftCarouselAds, loading: loadingLeftCarouselAds } = useQuery(
    ADVERTISSMENT_QUERY,
    {
      variables: { position: "leftCarouselAds" },
    }
  );
  const { data: rightCarouselAds, loading: loadingRightCarouselAds } = useQuery(
    ADVERTISSMENT_QUERY,
    {
      variables: { position: "rightCarouselAds" },
    }
  );

  const { data: FullAds20Product, loading: loadingFull20ProductAds } = useQuery(
    ADVERTISSMENT_QUERY,
    {
      variables: { position: "full_ads_20" },
    }
  );
  const { data: centerCarouselAds, loading: loadingCenterCarouselAds } =
    useQuery(ADVERTISSMENT_QUERY, {
      variables: { position: "slider" },
    });
  const { data: FullTopDealsAds, loading: loadingFullTopDealsAds } = useQuery(
    ADVERTISSMENT_QUERY,
    {
      variables: { position: "full_ads_topDeals" },
    }
  );
  const { data: Products_less_20, loading: loadingProducts_less_20 } = useQuery(
    TAKE_6_PRODUCTS_PRICE_20,
    {
      variables: { limit: 6 },
    }
  );
  const { data: Products_inDiscount_6, loading: loadingProducts_inDiscount_6 } =
    useQuery(TAKE_6_PRODUCTS_IN_DISCOUNT, {
      variables: { limit: 10 },
    });
  const { data: NewProducts_6, loading: loadingNewProducts_6 } = useQuery(
    TAKE_6_PRODUCTS,
    {
      variables: { limit: 6 },
    }
  );
  const { data: TopSellsSectionVisibility } = useQuery(CONTENT_VISIBILITY, {
    variables: { section: "top sells" },
  });
  useQuery(DELETE_ALL_DISCOUNTS_QUERY);

  const newProducts = useMemo(() => NewProducts_6?.products, [NewProducts_6]);
  const productsDiscounts = useMemo(
    () => Products_inDiscount_6?.productsDiscounts,
    [Products_inDiscount_6]
  );
  const productsLessThan20 = useMemo(
    () => Products_less_20?.productsLessThen20,
    [Products_less_20]
  );
  return (
    <div className="Home py-10 flex min-h-screen flex-col items-center px-8">
      <div className="container">
        <section className="flex justify-center lg:flex-row flex-col gap-4 items-center">
          <RightAdsCarousel
            loadingRightAdsCarousel={loadingRightCarouselAds}
            rightCarouselAds={rightCarouselAds?.advertismentByPosition}
          />
          <AdsCarousel
            loadingCenterAdsCarousel={loadingCenterCarouselAds}
            centerCarouselAds={centerCarouselAds?.advertismentByPosition}
          />
        </section>
        <Services />
        <ProductInfo />
        <div className="nouveaux-product-parent-tabs flex flex-col">
          <TitleProduct title={"Nouveaux Produits"} />
          <div className="Carousel_new_product flex gap-3">
            <SideAds
              adsLoaded={loadingLeftAds}
              image={leftAds?.advertismentByPosition[0]?.images[0]}
              link={leftAds?.advertismentByPosition[0]?.link}
              adsPositon={"Left Ads"}
            />
            <ProductTabs
              title={"Nouveaux Produits"}
              data={newProducts}
              loadingNewProduct={loadingNewProducts_6}
              carouselWidthClass={
                NewProducts_6?.products.length < 5
                  ? "basis-full md:basis-1/2"
                  : "basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4 xxl:basis-1/5"
              }
            />
          </div>
        </div>
        <FullWidthAds
          FullAdsLoaded={loadingFullTopDealsAds}
          FullImageAds={FullTopDealsAds?.advertismentByPosition[0]?.images[0]}
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
        <FullWidthAds
          FullAdsLoaded={loadingFull20ProductAds}
          FullImageAds={FullAds20Product?.advertismentByPosition[0]?.images[0]}
          LinkTo={"/Collections/tunisie?price=20"}
        />
        <div className="Carousel_A_20DT">
          <div className="Heading flex items-center justify-between">
            <TitleProduct title={"L'essentiel à 20DT"} />
            <div className="flex items-center gap-1 font-medium hover:text-mediumBeige transition-colors">
              <Link href={"/Collections/tunisie?price=20"}>
                Voir tous les produits
              </Link>
              <MdKeyboardArrowRight />
            </div>
          </div>
          <ProductTabs
            data={productsLessThan20}
            loadingNewProduct={loadingProducts_less_20}
            carouselWidthClass={
              Products_less_20?.productsLessThen20.length < 5
                ? "basis-full w-full lg:basis-1/2"
                : "basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4 xxl:basis-1/5"
            }
          />
        </div>
        <FullWidthAds
          FullAdsLoaded={loadingFullPromotionAds}
          FullImageAds={FullAdsPromotion?.advertismentByPosition[0]?.images[0]}
          LinkTo={"/Collections/tunisie?choice=in-discount"}

        />
        <div className="Promotion flex flex-col">
          <div className="flex items-center justify-between">
            <TitleProduct title={"Promotions"} />
            <div className="flex items-center gap-1 font-medium hover:text-mediumBeige transition-colors">
              <Link
                rel="preload"
                href={"/Collections/tunisie?choice=in-discount"}
              >
                Voir tous les produits
              </Link>
              <MdKeyboardArrowRight />
            </div>
          </div>
          <div className="flex gap-3">
            <ProductTabs
              data={productsDiscounts}
              loadingNewProduct={loadingProducts_inDiscount_6}
              carouselWidthClass={
                Products_inDiscount_6?.productsDiscounts.length < 5
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
        <div className="BestSeals">
          <BestSales
            TopSellsSectionVisibility={
              TopSellsSectionVisibility?.getSectionVisibility?.visibility_status
            }
          />
        </div>
        <BrandsCarousel />
      </div>
    </div>
  );
};

export default Home;
