import { TableRow, TableCell } from "@/components/ui/table";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HiPlus } from "react-icons/hi2";
import { RiSubtractLine } from "react-icons/ri";

interface BasketTableRowProps {
    product: any;
    onIncrease: () => void;
    onDecrease: () => void;
    onRemove: () => void;
}

export const BasketTableRow = ({ product, onIncrease, onDecrease, onRemove }: BasketTableRowProps) => {
    const quantity = product.quantity || product.actualQuantity || 0;
    const price = product.productDiscounts?.length > 0
        ? product.productDiscounts[0].newPrice
        : product.price;

    return (
        <TableRow>
            <TableCell className="flex items-center">
                <div className="w-24 h-24 relative">
                    <Image
                        alt={product.name}
                        src={product.images?.[0] || "https://via.placeholder.com/150"}
                        fill={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: "contain" }}
                    />
                </div>
                <div className="ml-4">
                    <Link
                        href={`/products/${product.slug}`}
                        className="font-semibold text-sm text-gray-800"
                    >
                        {product.name}
                    </Link>
                    <p className="text-xs text-gray-500">
                        {product.categories?.map((c: any) => c.name).join(", ") || "No categories"}
                    </p>
                </div>
            </TableCell>

            <TableCell>
                <div className="flex divide-x border w-max">
                    <button
                        type="button"
                        className="bg-lightBeige px-2 py-1 font-semibold cursor-pointer"
                        onClick={onDecrease}
                        disabled={quantity === 1}
                    >
                        <RiSubtractLine />
                    </button>
                    <span className="bg-transparent px-2 py-1 font-semibold text-[#333] text-md">
                        {quantity}
                    </span>
                    <button
                        type="button"
                        className="bg-primaryColor text-white px-2 py-1 font-semibold cursor-pointer"
                        disabled={product.actualQuantity === product?.inventory}
                        onClick={onIncrease}
                    >
                        <HiPlus />
                    </button>
                </div>
            </TableCell>

            <TableCell className="w-[30%]">
                {product?.productDiscounts?.length > 0 ? (
                    <>
                        <h4 className="text-md w-max font-bold text-[#333]">
                            {Number(product.productDiscounts[0].newPrice).toFixed(3)} TND
                        </h4>
                        <h4 className="text-base w-full font-semibold text-gray-700 line-through">
                            {Number(product.price).toFixed(3)} TND
                        </h4>
                    </>
                ) : (
                    <h4 className="text-md w-max font-bold text-[#333]">
                        {Number(product.price || 0).toFixed(3)} TND
                    </h4>
                )}
            </TableCell>

            <TableCell>
                <Trash2Icon
                    size={23}
                    className="cursor-pointer"
                    color="red"
                    onClick={onRemove}
                />
            </TableCell>
        </TableRow>
    );
};