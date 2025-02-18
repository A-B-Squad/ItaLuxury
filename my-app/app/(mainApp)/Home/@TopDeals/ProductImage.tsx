import Image from "next/legacy/image";
import Link from "next/link";

const ProductImage = ({ product }: { product: any }) => {

  const discountData = product?.productDiscounts?.[0];
  const discountPercentage = discountData
    ? Math.round(((discountData.price - discountData.newPrice) / discountData.price) * 100)
    : null;

  return (

    <Link
      rel="preload"
      href={`/products/tunisie?productId=${product.id}`}
      className="h-56 lg:h-full w-full"
    >
      <span className="absolute left-5 top-5 z-20 text-white bg-green-600 px-4 font-semibold text-sm py-1 rounded-md">
        {discountPercentage}%
      </span>
      <div className="relative lg:col-span-1 row-span-1 lg:row-span-1 h-52 lg:h-full w-full">
        <Image
          layout="fill"
          objectFit="contain"
          className="h-full w-full"
          src={product?.images[0]}
          alt="product"
        />
      </div>
    </Link>
  )
};
export default ProductImage