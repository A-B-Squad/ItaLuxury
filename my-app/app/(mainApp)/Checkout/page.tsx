import React, { useMemo } from "react";
import Checkout from "./Checkout";

const page = ({ searchParams }: any) => {
  const products = useMemo(
    () => JSON.parse(searchParams?.products),
    [searchParams?.products]
  );
  const total = useMemo(
    () => JSON.parse(searchParams?.total),
    [searchParams?.total]
  );

  return <Checkout products={products} total={total} />;
};

export default page;
