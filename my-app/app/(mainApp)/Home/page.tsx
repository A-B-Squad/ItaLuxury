"use client";
import AdsCarousel from "@/components/adverstissment/carousel";
import FullWidth from "@/components/adverstissment/FullWidth";
import Left from "@/components/adverstissment/left";
import Right from "@/components/adverstissment/right";
import SideAds from "@/components/adverstissment/sideAds";
import ProductTabs from "@/components/ProductCarousel/productTabs";
import TitleProduct from "@/components/ProductCarousel/titleProduct";
import BestSales from "@/components/BestSales"
import {
  SIDE_ADS_NEW_PRODUCT,
  TAKE_6_PRODUCTS,
  TAKE_6_PRODUCTS_PRICE_20,
} from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import ProductInfo from "../../components/ProductInfo/ProductInfo";
import ClientServices from "./_components/ClientServices";
import Services from "./_components/services";
import TopDeals from "./TopDeals/TopDeals";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
const Home = () => {
  const [countdownToNextDay, setCountdownToNextDay] = useState<number>(0);

  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilNextDay = tomorrow.getTime() - now.getTime();

    setCountdownToNextDay(timeUntilNextDay > 0 ? timeUntilNextDay : 0);

    const interval = setInterval(() => {
      const newTimeUntilNextDay = tomorrow.getTime() - new Date().getTime();
      setCountdownToNextDay(newTimeUntilNextDay > 0 ? newTimeUntilNextDay : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { loading: loadingNewProduct, data: Products_6 } = useQuery(
    TAKE_6_PRODUCTS,
    {
      variables: { limit: 6 },
    }
  );
  const { loading: loadingProduct, data: Product_less_20 } = useQuery(
    TAKE_6_PRODUCTS_PRICE_20,
    {
      variables: { limit: 6 },
    }
  );

  const { loading: loadingLeftAdsNewProduct, data: leftAds } = useQuery(
    SIDE_ADS_NEW_PRODUCT,
    { variables: { position: "left_new_product" } }
  );

  const { loading: loadingRightAdsNewProduct, data: rightAds } = useQuery(
    SIDE_ADS_NEW_PRODUCT,
    { variables: { position: "rigth_new_product" } }
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
              data={Products_6}
              loadingNewProduct={loadingNewProduct}
            />
          </div>
        </div>
        <FullWidth />
        <div className="TopDeals">
          <div className=" flex justify-between flex-col md:flex-row gap-2 items-start  ">
            <TitleProduct title={"Meilleures offres du jour"} />
            <div className="flex items-start flex-col md:flex-row md:pt-3  ">
              <p className="md:p-2 font-bold">
                Hâtez-vous ! L'offre se termine dans :
              </p>
              <div className="grid grid-flow-col bg-strongBeige text-white  text-center  auto-cols-max">
                <div className="flex items-center gap-2 md:p-2 p-1  rounded-box">
                  <span className="countdown font-mono text-base">
                    <span>
                      {Math.floor(countdownToNextDay / (1000 * 60 * 60))}
                    </span>
                  </span>
                  <span className="">Heurs</span>
                </div>
                <div className="flex items-center gap-1  md:p-2 p-1  ">
                  <span className="countdown font-mono text-base">
                    <span>
                      {Math.floor(
                        (countdownToNextDay % (1000 * 60 * 60)) / (1000 * 60)
                      )}
                    </span>
                  </span>
                  <span>Minutes</span>
                </div>
                <div className="flex items-center gap-1  md:p-2 p-1  ">
                  <span className="countdown font-mono text-base">
                    <span>
                      {Math.floor((countdownToNextDay % (1000 * 60)) / 1000)}
                    </span>
                  </span>
                  <span>Secondes</span>
                </div>
              </div>
            </div>
          </div>
          <TopDeals />
        </div>
        <FullWidth />
        <div className="Carousel_A_20DT">
          <div className="Heading flex items-center justify-between">
            <TitleProduct title={"l'essentiel a 20DT"} />
            <div className="flex items-center gap-1 font-medium hover:text-mediumBeige transition-colors">
              <Link
              rel="preload"
              href={"/Collections/tunisie?price=20"}>
                Voir tous les produits
              </Link>
              <MdKeyboardArrowRight />
            </div>
          </div>
          <div>
            <ProductTabs
              data={Product_less_20}
              loadingNewProduct={loadingProduct}
              carouselWidthClass={
                Product_less_20?.productsLessThen20?.length < 5
                  ? "xl:basis-1/2"
                  : ""
              }
            />
          </div>
        </div>
        <FullWidth />
        <div className="Promotion flex flex-col ">
          <div className="flex items-center justify-between">
            <TitleProduct title={"Promotions"} />
            <div className="flex items-center gap-1 font-medium hover:text-mediumBeige transition-colors">
              <Link 
              rel="preload"
              href={"/Collections/tunisie"}>
                Voir tous les produits
              </Link>
              <MdKeyboardArrowRight />
            </div>
          </div>
          <div className="flex  gap-3">
            <ProductTabs
              data={Products_6}
              loadingNewProduct={loadingNewProduct}
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
        <BestSales/>
      </div>
    </div>
  );
};

export default Home;
