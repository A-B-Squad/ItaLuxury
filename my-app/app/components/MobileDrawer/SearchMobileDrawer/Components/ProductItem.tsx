import Image from "next/image";
import Link from "next/link";

const ProductItem = ({
    product,
    closeDrawer
}: {
    product: any;
    closeDrawer: () => void;
}) => (
    <Link
        href={`/products/${product.slug}`}
        onClick={closeDrawer}
        className="block"
    >
        <div className="flex items-start gap-4 p-3 bg-white hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-colors duration-150 border border-gray-100">
            <div className="relative flex-shrink-0 w-20 h-20 rounded-lg bg-gray-50 overflow-hidden">
                {product.images && product.images[0] ? (
                    <Image  
                        src={product.images[0]}
                        alt={product.name}
                        width={80}
                        height={80}
                        sizes="80px"
                        style={{
                            objectFit: "cover",
                            width: '100%',
                            height: '100%'
                        }}
                        quality={85}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400 text-xs">No image</span>
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-base font-medium text-gray-900 line-clamp-2 mb-2 leading-5">
                    {product.name}
                </p>
                <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-primaryColor">
                        {(
                            product.productDiscounts.length > 0
                                ? product.productDiscounts[0].newPrice
                                : product.price
                        ).toFixed(3)} TND
                    </span>
                    {product.productDiscounts.length > 0 && (
                        <span className="text-sm text-gray-400 line-through">
                            {product.price.toFixed(3)} TND
                        </span>
                    )}
                </div>
            </div>
        </div>
    </Link>
);

export default ProductItem