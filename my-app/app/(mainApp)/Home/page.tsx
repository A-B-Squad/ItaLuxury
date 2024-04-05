"use client";
import SideAds from "@/app/components/adverstissment/SideAds";
import AdsCarousel from "@/components/adverstissment/carousel";
import Left from "@/components/adverstissment/Left";
import Right from "@/components/adverstissment/Right";
import Services from "./_components/services";
import ProductTabs from "@/components/ProductCarousel/productTabs";
import { gql, useQuery } from "@apollo/client";
import FullWidth from "@/components/adverstissment/FullWidth";
import TitleProduct from "@/app/components/ProductCarousel/titleProduct";
import TopDeals from './TopDeals/TopDeals';
const Home = () => {
  return (
    <div className="Home py-14 flex min-h-screen flex-col items-center px-5 ">
      <div className="container">
        <section className="flex justify-center  md:flex-row flex-col gap-6 items-center">
          <Left />
          <AdsCarousel />
          <Right />
        </section>

        <Services />
        <div className="nouveaux-product-parent-tabs flex flex-col  mt-10   ">
          <TitleProduct title={"nouveaux Produits"} />
          <div className="Carousel_new_product flex gap-3">
            <SideAds
              adsLoaded={loadingAdsNewProduct}
              image={leftAds?.advertismentByPosition?.images[0]}
              link={leftAds?.advertismentByPosition?.link}
            />

            <ProductTabs
              title={"nouveaux Produits"}
              data={data}
              loadingNewProduct={loadingNewProduct}
            />
          </div>
        </div>
        <FullWidth />
        <div className="Carousel_A_20DT">
          <TitleProduct title={"Meilleures offres du jour"} />
          <TopDeals
            // data={data}
            // loadingNewProduct={loadingNewProduct}
          />
        </div>
        <FullWidth />
        <div className="Carousel_A_20DT">
          <TitleProduct title={"l'essentiel a 20DT"} />

          <ProductTabs
            data={data}
            loadingNewProduct={loadingNewProduct}
          />
        </div>
        <FullWidth />
        <div className="Promotion mt-10 flex flex-col ">
          <TitleProduct title={"nouveaux Produits"} />

          <div className="flex items-center gap-3">
            <ProductTabs
              data={data}
              loadingNewProduct={loadingNewProduct}
            />
           
              <SideAds
                adsLoaded={loadingAdsNewProduct}
                image={leftAds?.advertismentByPosition?.images[0]}
                link={leftAds?.advertismentByPosition?.link}
              />
          </div>
        </div>
        <div className="servise_client grid gap-5 py-10 grid-cols-2 md:grid-cols-3 items-center">
          <div className="bg-mediumBeige w-full h-52">
            Service clent image 1
          </div>
          <div className="bg-mediumBeige w-full h-52">
            Service clent image 2
          </div>
          <div className="bg-mediumBeige col-span-2 md:col-span-1 w-full h-52">
            Service clent image 3
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
