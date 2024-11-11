import prepRoute from "@/app/Helpers/_prepRoute";
import Image from "next/legacy/image";
import Link from "next/link";

const ProductImage = ({ product }: { product: any }) => (
  <Link
    rel="preload"
    href={`/Collections/tunisie/?productId=${product?.id}&categories=${[
      product?.categories[0]?.name,
      product?.categories[0]?.subcategories[0]?.name,
      product?.categories[0]?.subcategories[0]?.subcategories[0]?.name,
      product?.name
    ]}`}
    className="h-56 lg:h-full w-full"
  >
    <span className="absolute left-5 top-5 z-20 text-white bg-green-600 px-4 font-semibold text-sm py-1 rounded-md">
      {product?.productDiscounts[0]?.Discount?.percentage}%
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
);
export default ProductImage