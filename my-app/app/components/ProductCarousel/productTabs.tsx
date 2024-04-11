import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";

import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import AllProducts from "./AllProducts";
import Loading from "./Loading";
import NoProductYet from "./NoProductYet";
interface DecodedToken extends JwtPayload {
  userId: string;
}

const ProductTabs = ({ data, loadingNewProduct }: any) => {
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setUserId(decoded.userId);
    }
  }, []);

  return (
    <div className="products-tabs relative cursor-pointer rounded-md shadow-lg grid">
      {loadingNewProduct && <Loading />}
      {!loadingNewProduct && data && (
        <div className="flex overflow-hidden w-full h-fit  ">
          <Carousel className="carousel w-full h-4/5 flex items-center transition-all duration-500 ease-in-out">
            <CarouselContent className="h-full gap-1 px-3  w-full ">
              {(data.products ? data.products : data.productsLessThen20).map(
                (product: any, index: any) => (
                  <AllProducts
                    key={index}
                    productData={product}
                    userId={userId}
                  />
                )
              )}
            </CarouselContent>
            <CarouselPrevious className="px-2 left-5 transition-all bg-strongBeige text-white " />
            <CarouselNext className="px-2 transition-all right-5 bg-strongBeige text-white " />
          </Carousel>
        </div>
      )}
      {!data && !loadingNewProduct && <NoProductYet />}
    </div>
  );
};

export default ProductTabs;
