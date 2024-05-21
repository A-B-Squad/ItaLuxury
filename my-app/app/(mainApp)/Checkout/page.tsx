import React, { useMemo } from "react";
import Checkout from "./Checkout";

// Define a type for searchParams if possible
type SearchParams = {
  products?: string;
  total?: string;
};

const Page = ({ searchParams }: { searchParams: SearchParams }) => {
  const products = useMemo(() => {
    try {
      return JSON.parse(searchParams?.products || "{}");
    } catch (error) {
      console.error("Failed to parse products:", error);
      return {};
    }
  }, [searchParams?.products]);

  const total = useMemo(() => {
    try {
      return JSON.parse(searchParams?.total || "0");
    } catch (error) {
      console.error("Failed to parse total:", error);
      return 0;
    }
  }, [searchParams?.total]);

  return <Checkout products={products} total={total} />;
};

export default Page;
