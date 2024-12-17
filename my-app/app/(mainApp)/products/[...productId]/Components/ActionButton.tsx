
import Link from "next/link";
import { memo } from "react";
import { FaPlus, FaRegHeart } from "react-icons/fa";
import { GoGitCompare } from "react-icons/go";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { MdAddShoppingCart, MdSecurity } from "react-icons/md";
import { RiSubtractFill } from "react-icons/ri";




const ActionButton = memo((
    { AddToBasket,
        handleIncreaseQuantity,
        handleDecreaseQuantity
        , productDetails
        , quantity, handleToggleFavorite, isProductInCompare, addToCompare

    }: any) => {





    return (
        <div className="ActionButton p-4 bg-white hidden lg:flex lg:flex-col  w-full shadow-lg rounded-lg col-span-3 sticky top-0 ">
            <div className="flex items-start mb-4">
                <MdSecurity size={50} className="text-gray-600" />
                <p className="ml-3 text-[11px] text-gray-600">
                    Sécurité et vie privée
                    <br />
                    Paiements sûrs: Nous ne partageons pas vos données personnelles avec des tiers sans votre consentement.
                    <br />
                    Informations personnelles sécurisées: Nous protégeons votre vie privée et assurons la sécurité de vos données personnelles.
                </p>
            </div>

            <div className="Quantity flex items-center mt-4 space-x-3">
                <h3 className="tracking-wider font-semibold text-lg text-primaryColor">Quantité:</h3>

                <div className="flex items-center gap-2 divide-x divide-gray-300 rounded border border-gray-300">
                    <button
                        type="button"
                        className="px-3 py-1 text-lg font-semibold cursor-pointer"
                        disabled={quantity === 1}
                        onClick={handleDecreaseQuantity}
                    >
                        <RiSubtractFill className="text-gray-600" />
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 border-l border-gray-300 text-md font-semibold"
                    >
                        {quantity}
                    </button>
                    <button
                        type="button"
                        className={`${quantity === productDetails.inventory ? "opacity-50" : ""} px-3 py-1 text-lg font-semibold cursor-pointer`}
                        disabled={quantity === productDetails.inventory}
                        onClick={handleIncreaseQuantity}
                    >
                        <FaPlus className="text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
                <button
                    type="button"
                    className={`${productDetails?.inventory <= 0 ? "cursor-not-allowed opacity-50" : "cursor-pointer"} w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6  shadow-lg text-lg font-bold flex items-center justify-center gap-2`}
                    onClick={() => AddToBasket(productDetails)}
                >
                    <MdAddShoppingCart size={20} />
                    Ajouter au panier
                </button>

                <Link
                    href="/Basket"
                    className={`${productDetails?.inventory <= 0 ? "cursor-not-allowed opacity-50" : "cursor-pointer"} w-full bg-primaryColor hover:bg-primaryColor hover:opacity-85 text-white py-3 px-6  shadow-lg text-lg font-bold flex items-center justify-center gap-2`}
                >
                    <MdAddShoppingCart size={20} />
                    Acheter maintenant
                </Link>

                <button
                    onClick={handleToggleFavorite}
                    type="button"
                    className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 py-2 px-4 rounded-md flex items-center justify-center gap-2 shadow-sm"
                >
                    <FaRegHeart size={20} />
                    <span className="text-sm font-semibold">Ajouter aux favoris</span>
                </button>

                <button
                    type="button"
                    className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 py-2 px-4 rounded-md flex items-center justify-center gap-2 shadow-sm"
                    onClick={() => addToCompare(productDetails)}

                >
                    {isProductInCompare ? (
                        <IoCheckmarkDoneOutline size={20} />
                    ) : (
                        <GoGitCompare size={20} className="font-bold" />
                    )}
                    <span className="text-sm font-semibold">Comparer</span>
                </button>
            </div>
        </div>)
})

export default ActionButton