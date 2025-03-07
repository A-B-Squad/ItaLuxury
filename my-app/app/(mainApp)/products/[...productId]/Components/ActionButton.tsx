import { memo, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { FaPlus, FaRegHeart } from "react-icons/fa";
import { GoGitCompare } from "react-icons/go";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { MdAddShoppingCart, MdSecurity } from "react-icons/md";
import { RiSubtractFill } from "react-icons/ri";

interface ProductDetails {
    id: string;
    name: string;
    price: number;
    inventory: number;
}

interface ActionButtonProps {
    AddToBasket: (product: ProductDetails) => void;
    handleIncreaseQuantity: () => void;
    handleDecreaseQuantity: () => void;
    productDetails: ProductDetails;
    quantity: number;
    handleToggleFavorite: () => void;
    isProductInCompare: boolean;
    addToCompare: (product: ProductDetails) => void;
}

const ActionButton = memo(({
    AddToBasket,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    productDetails,
    quantity,
    handleToggleFavorite,
    isProductInCompare,
    addToCompare
}: ActionButtonProps) => {
    const router = useRouter();
    const isOutOfStock = productDetails?.inventory <= 0;
    const isMaxQuantity = quantity === productDetails?.inventory;

    const handleBuyNow = useCallback(() => {
        if (!isOutOfStock) {
            AddToBasket(productDetails);
            router.push('/Basket');
        }
    }, [AddToBasket, productDetails, router, isOutOfStock]);

    return (
        <div className="ActionButton p-5 bg-white hidden lg:flex lg:flex-col w-full shadow-lg rounded-lg col-span-3 sticky top-4 gap-4">
            <div className="flex items-start p-4 bg-blue-50 rounded-lg">
                <MdSecurity size={40} className="text-blue-600 flex-shrink-0" />
                <div className="ml-3">
                    <h4 className="text-sm font-semibold text-blue-800 mb-1">Sécurité et vie privée</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">
                        <span className="block mb-1">• Paiements sûrs: Nous ne partageons pas vos données personnelles avec des tiers.</span>
                        <span className="block">• Informations personnelles sécurisées: Protection de votre vie privée garantie.</span>
                    </p>
                </div>
            </div>

            <div className="Quantity flex items-center space-x-3 mt-2">
                <h3 className="tracking-wider font-semibold text-base text-gray-700">Quantité:</h3>

                <div className="flex items-center overflow-hidden rounded-md border border-gray-300">
                    <button
                        type="button"
                        className={`bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 w-10 h-10 flex items-center justify-center text-sm font-semibold ${quantity === 1 || isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        disabled={quantity === 1 || isOutOfStock}
                        onClick={handleDecreaseQuantity}
                        aria-label="Diminuer la quantité"
                    >
                        <RiSubtractFill size={18} />
                    </button>
                    <div
                        className="bg-white px-4 py-2 h-10 flex items-center justify-center font-semibold text-gray-800 text-md border-x border-gray-300 min-w-[40px]"
                    >
                        {quantity}
                    </div>
                    <button
                        type="button"
                        className={`w-10 h-10 flex items-center justify-center transition-colors bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold ${isMaxQuantity || isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        disabled={isMaxQuantity || isOutOfStock}
                        onClick={handleIncreaseQuantity}
                        aria-label="Augmenter la quantité"
                    >
                        <FaPlus size={14} />
                    </button>
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-3">
                <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className={`w-full py-3 px-6 rounded-md shadow-md text-white font-bold text-base flex items-center justify-center gap-2 transition-all ${isOutOfStock
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primaryColor hover:bg-opacity-90 active:transform active:scale-[0.99]"
                        }`}
                >
                    <MdAddShoppingCart size={20} />
                    Acheter maintenant
                </button>

                <button
                    type="button"
                    onClick={() => !isOutOfStock && AddToBasket(productDetails)}
                    disabled={isOutOfStock}
                    className={`w-full py-3 px-6 rounded-md shadow-md text-white font-bold text-base flex items-center justify-center gap-2 transition-all ${isOutOfStock
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 active:transform active:scale-[0.99]"
                        }`}
                >
                    <MdAddShoppingCart size={20} />
                    Ajouter au panier
                </button>

                <div className="grid grid-cols-2 gap-3 mt-1">
                    <button
                        type="button"
                        onClick={handleToggleFavorite}
                        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-3 rounded-md flex items-center justify-center gap-2 transition-colors"
                    >
                        <FaRegHeart className="text-red-500" size={16} />
                        <span className="text-sm font-medium">Favoris</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => !isProductInCompare && addToCompare(productDetails)}
                        disabled={isProductInCompare}
                        className={`bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-3 rounded-md flex items-center justify-center gap-2 transition-colors ${isProductInCompare ? "cursor-not-allowed" : "cursor-pointer"
                            }`}
                    >
                        {isProductInCompare ? (
                            <IoCheckmarkDoneOutline className="text-green-600" size={18} />
                        ) : (
                            <GoGitCompare size={18} />
                        )}
                        <span className="text-sm font-medium">Comparer</span>
                    </button>
                </div>
            </div>

            {isOutOfStock && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600 font-medium text-center">
                        Ce produit est actuellement en rupture de stock
                    </p>
                </div>
            )}
        </div>
    );
});


export default ActionButton;