"use client";

import AdsCarousel from "@/components/adverstissment/carousel";
import Left from "@/components/adverstissment/left";
import Right from "@/components/adverstissment/right";
import SideAds from "@/components/adverstissment/sideAds";
import ProductTabs from "@/components/ProductCarousel/productTabs";
import TitleProduct from "@/components/ProductCarousel/titleProduct";
import BestSales from "./TopSales/BestSales";
import {
  ADVERTISSMENT_QUERY,
  SIDE_ADS_NEW_PRODUCT,
  TAKE_6_PRODUCTS,
  TAKE_6_PRODUCTS_IN_DISCOUNT,
  TAKE_6_PRODUCTS_PRICE_20,
} from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import React from "react";
import ProductInfo from "../../components/ProductInfo/ProductInfo";
import ClientServices from "./_components/ClientServices";
import Services from "./_components/services";
import TopDeals from "./TopDeals/TopDeals";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import { BrandsCarousel } from "./_components/BrandCarousel";
import TimeCountDown from "./_components/TimeCountDown";
import FullWidthAds from "../../components/adverstissment/FullWidth";

const Home = ({data}:any) => {
  const { loading: loadingNewProduct, data: Products_6 } = useQuery(
    TAKE_6_PRODUCTS,
    {
      variables: { limit: 6 },
    },
  );
  const { loading: loadingDiscountProduct, data: Products_inDiscount_6 } =
    useQuery(TAKE_6_PRODUCTS_IN_DISCOUNT, {
      variables: { limit: 6 },
    });

  const { loading: loadingProduct, data: Product_less_20 } = useQuery(
    TAKE_6_PRODUCTS_PRICE_20,
    {
      variables: { limit: 6 },
    },
  );

  const { loading: loadingLeftAdsNewProduct, data: leftAds } = useQuery(
    SIDE_ADS_NEW_PRODUCT,
    { variables: { position: "left_new_product" } },
  );

  const { loading: loadingRightAdsNewProduct, data: rightAds } = useQuery(
    SIDE_ADS_NEW_PRODUCT,
    { variables: { position: "rigth_new_product" } },
  );
  const { data: FullAdsPromotion, loading: FullAdsPromotionLoaded } = useQuery(
    ADVERTISSMENT_QUERY,
    {
      variables: { position: "full_promotion" },
    },
  );
  const { data: FullAds20Product, loading: FullAdsProduct20Loaded } = useQuery(
    ADVERTISSMENT_QUERY,
    {
      variables: { position: "full_ads_20" },
    },
  );
  const { data: FullAdsTopDeals, loading: FullAdsTopDealsLoaded } = useQuery(
    ADVERTISSMENT_QUERY,
    {
      variables: { position: "full_ads_topDeals" },
    },
  );
  return (
    <div className="Home py-10 flex min-h-screen flex-col items-center px-8 ">
      <div className="container">
        <section className="flex justify-center  lg:flex-row flex-col gap-4 items-center">
          <Left />
          <AdsCarousel />
          <Right />
        </section>
        <Services />
        <ProductInfo />
        <div className="nouveaux-product-parent-tabs flex flex-col ">
          <TitleProduct title={"nouveaux Produits"} />
          <div className="Carousel_new_product flex gap-3">
            <SideAds
              adsLoaded={loadingLeftAdsNewProduct}
              image={leftAds?.advertismentByPosition[0]?.images[0]}
              link={leftAds?.advertismentByPosition[0]?.link}
              adsPositon={"Left Ads"}
            />

            <ProductTabs
              title={"nouveaux Produits"}
              data={Products_6?.products}
              loadingNewProduct={loadingNewProduct}
              carouselWidthClass={
                Products_6?.products.length < 5
                  ? " basis-full   md:basis-1/2  "
                  : " basis-full  md:basis-1/2 lg:basis-1/3 xl:basis-1/4  xxl:basis-1/5"
              }
            />
          </div>
        </div>
        <FullWidthAds
          FullAdsLoaded={FullAdsTopDealsLoaded}
          FullImageAds={FullAdsTopDeals?.advertismentByPosition[0]?.images[0]}
        />
        <div className="TopDeals">
          <div className=" flex justify-between flex-col md:flex-row gap-2 items-start  ">
            <TitleProduct title={"Meilleures offres du jour"} />
            <div className="flex items-start flex-col md:flex-row md:pt-3  ">
              <p className="md:p-2 font-bold">
                Hâtez-vous ! L'offre se termine dans :
              </p>
              <TimeCountDown />
            </div>
          </div>
          <TopDeals />
        </div>
        <FullWidthAds
          FullAdsLoaded={FullAdsProduct20Loaded}
          FullImageAds={FullAds20Product?.advertismentByPosition[0]?.images[0]}
        />
        <div className="Carousel_A_20DT ">
          <div className="Heading flex items-center justify-between">
            <TitleProduct title={"l'essentiel a 20DT"} />
            <div className="flex items-center gap-1 font-medium hover:text-mediumBeige transition-colors">
              <Link href={"/Collections/tunisie?price=20"}>
                Voir tous les produits
              </Link>
              <MdKeyboardArrowRight />
            </div>
          </div>
          <ProductTabs
            data={Product_less_20?.productsLessThen20}
            loadingNewProduct={loadingProduct}
            carouselWidthClass={
              Product_less_20?.productsLessThen20.length < 5
                ? " basis-full w-full   lg:basis-1/2  "
                : " basis-full  md:basis-1/2 lg:basis-1/3 xl:basis-1/4  xxl:basis-1/5"
            }
          />
        </div>
        <FullWidthAds
          FullAdsLoaded={FullAdsPromotionLoaded}
          FullImageAds={FullAdsPromotion?.advertismentByPosition[0]?.images[0]}
        />
        <div className="Promotion flex flex-col ">
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
          <div className="flex  gap-3">
            <ProductTabs
              data={Products_inDiscount_6?.productsDiscounts}
              loadingNewProduct={loadingDiscountProduct}
              carouselWidthClass={
                Products_inDiscount_6?.productsDiscounts.length < 5
                  ? " basis-full   md:basis-1/2  "
                  : " basis-full  md:basis-1/2 lg:basis-1/3 xl:basis-1/4   xxl:basis-1/5"
              }
            />
            <SideAds
              adsLoaded={loadingRightAdsNewProduct}
              image={rightAds?.advertismentByPosition[0]?.images[0]}
              link={rightAds?.advertismentByPosition[0]?.link}
              adsPositon={"Right Ads"}
            />
          </div>
        </div>
        <ClientServices />
        <div className="BestSeals">
          <BestSales />
          <BrandsCarousel />
        </div>
      </div>
    </div>
  );
};

export default Home;
