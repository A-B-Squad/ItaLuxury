"use client";
import SideAds from "@/components/adverstissment/sideAds";
import AdsCarousel from "../../components/adverstissment/carousel";
import Left from "../../components/adverstissment/left";
import Right from "../../components/adverstissment/right";
import Services from "./_components/services";
import ProductTabs from "../../components/ProductCarousel/productTabs";
import { gql, useQuery } from "@apollo/client";

const Home = () => {
  const TAKE_6_PRODUCTS = gql`
    query Products($limit: Int!) {
      products(limit: $limit) {
        id
        name
        price
        reference
        description
        createdAt
        categories {
          name
        }
        ProductColorImage {
          images
          Colors {
            color
            Hex
          }
        }
        productDiscounts {
          price
          newPrice
          Discount {
            percentage
          }
        }
      }
    }
  `;
  const { loading: loadingNewProduct, data } = useQuery(TAKE_6_PRODUCTS, {
    variables: { limit: 6 },
  });

  const SIDE_ADS_NEW_PRODUCT = gql`
    query Query($position: String!) {
      advertismentByPosition(position: $position) {
        images
        link
      }
    }
  `;
  const { loading: loadingAdsNewProduct, data: leftAds } = useQuery(
    SIDE_ADS_NEW_PRODUCT,
    { variables: { position: "left_new_product" } }
  );

  return (
    <div className="Home py-14 flex min-h-screen flex-col items-center px-8 ">
      <div className="container">
        <section className="flex justify-center  md:flex-row flex-col gap-6 items-center">
          <Left />
          <AdsCarousel />
          <Right />
        </section>
        <Services />
        <div className="nouveaux-product-parent-tabs  mt-10 flex gap-3 ">
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
    </div>
  );
};

export default Home;
