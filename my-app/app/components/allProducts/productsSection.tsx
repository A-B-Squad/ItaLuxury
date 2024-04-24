import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { convertStringToQueriesObject } from "./sideBar";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_PRODUCTS_QUERY } from "../../../graphql/queries";

const ProductsSection = () => {
  const searchParams = useSearchParams();
  const paramsObj = convertStringToQueriesObject(searchParams);
  const { color, category, price } = paramsObj;
  const colorParam = searchParams.get('color');
  const categoryParam = searchParams.get('category');
  const priceParam = searchParams.get('price');
  const [searchProducts, { loading}] = useLazyQuery(
    SEARCH_PRODUCTS_QUERY
  );
  const [products, setProducts] = useState([]);

  useEffect(() => {
    searchProducts({
      variables: {
        input: {
          categoryId: category && category.length > 0 ? category[0] : undefined,
          colorId: color && color.length> 0 ? color[0] : undefined,
          minPrice: 1,
          maxPrice: price && price.length >0 ? +price[0] : undefined,
        },
        page: 1,
        pageSize: 10, 
      },
      onCompleted:(data)=> {
          console.log('====================================');
          console.log(data);
          console.log('====================================');
      },
    });
    console.log('====================================');
    console.log(colorParam);
    console.log('====================================');
  }, [colorParam,categoryParam,priceParam]);



  return <div>ProductsSection</div>;
};

export default ProductsSection;
