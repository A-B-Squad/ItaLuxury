"use client"
import { BASKET_QUERY, COMPANY_INFO_QUERY } from '@/graphql/queries';
import { useQuery } from '@apollo/client';
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import Image from 'next/legacy/image';
import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useProductsInBasketStore, usePruchaseOptions } from '../store/zustand';

interface DecodedToken extends JwtPayload {
    userId: string;
}

const PurchaseOptions: React.FC = () => {
    const [deliveryPrice, setDeliveryPrice] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const { quantityInBasket } = useProductsInBasketStore();
    const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
    const { productData, closePruchaseOptions, isOpen } = usePruchaseOptions();

    // Remove mounted state and adjust conditional rendering
    const { loading: companyInfoLoading } = useQuery(COMPANY_INFO_QUERY, {
        onCompleted: (companyData) => {
            setDeliveryPrice(companyData.companyInfo.deliveringPrice);
        },
        // Add skip condition to prevent unnecessary queries
        skip: !isOpen
    });

    const { data: basketData, loading: basketLoading } = useQuery(BASKET_QUERY, {
        variables: { userId: decodedToken?.userId },
        skip: !decodedToken?.userId || !isOpen,
    });

    const { products: storedProducts } = useProductsInBasketStore();

    useEffect(() => {
        // Move token decoding to useEffect to ensure it runs after mount
        const token = Cookies.get("Token");
        if (token) {
            try {
                const decoded = jwt.decode(token) as DecodedToken;
                setDecodedToken(decoded);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    const productsInBasket = useMemo(() => {
        if (decodedToken?.userId && basketData?.basketByUserId) {
            return basketData.basketByUserId;
        }
        return storedProducts;
    }, [decodedToken, basketData, storedProducts]);

    const calculateTotalPrice = useCallback(() => {
        return productsInBasket.reduce((acc: number, product: any) => {
            const productPrice =
                product.productDiscounts?.length > 0
                    ? product.productDiscounts[0].newPrice
                    : product.price;
            const quantity = product.quantity || product.actualQuantity || 0;
            return acc + Number(productPrice) * quantity;
        }, 0);
    }, [productsInBasket]);

    useEffect(() => {
        const updatedTotalPrice = calculateTotalPrice();
        setTotalPrice(updatedTotalPrice);
    }, [productsInBasket, calculateTotalPrice]);

    const calculateTotal = (): string => {
        const subtotal = Number(totalPrice || 0);
        if (isNaN(subtotal)) {
            throw new Error("Total must be a valid number");
        }
        const shippingCost = subtotal >= 499 ? 0 : deliveryPrice || 0;
        const finalTotal = subtotal + shippingCost;
        return finalTotal.toFixed(3);
    };

    const handleClose = () => {
        closePruchaseOptions();
    };

    if (!isOpen) return null;

    // Prevent rendering if critical data is still loading
    if (companyInfoLoading || basketLoading) return null;

    return (
        <div
            className="fixed inset-0 z-[11111111] transition-all duration-300"
            style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        >
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-300 
                    ${isOpen ? 'opacity-50' : 'opacity-0'}`}
                onClick={handleClose}
                style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
            />

            <div className="flex items-center justify-center h-full p-4 overflow-y-auto">
                <div
                    className={`w-full max-w-4xl transform transition-all duration-300 
                        ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                    style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
                >
                    <div className="bg-primaryColor relative flex items-center justify-center p-3 text-white rounded-t">
                        <p className="text-base sm:text-xl text-center px-8">
                            Produit ajouté au panier avec succès
                        </p>
                        <button
                            onClick={handleClose}
                            className="absolute right-2 sm:right-4 hover:rotate-90 transition-transform duration-300"
                        >
                            <IoCloseOutline size={24} />
                        </button>
                    </div>

                    <div className="bg-white p-4 sm:p-6 rounded-b shadow-xl">
                        <div className="flex flex-col gap-6">
                            {/* Product Info Section */}
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                {productData?.images[0] && (
                                    <div className="relative w-full hidden md:block sm:w-48 h-48 sm:h-48 mx-auto sm:mx-0">
                                        <Image
                                            layout="fill"
                                            src={productData.images[0]}
                                            alt={productData?.name || "Product"}
                                            className="object-cover rounded"
                                        />
                                    </div>
                                )}

                                <div className="flex flex-col gap-3 text-center sm:text-left">
                                    <h1 className="font-semibold text-lg">{productData?.name}</h1>
                                    <div className="flex items-center justify-center sm:justify-start gap-3 text-primaryColor">
                                        {productData?.productDiscounts?.[0] ? (
                                            <>
                                                <p className="text-gray-400 line-through">
                                                    {productData?.price?.toFixed(3)} TND
                                                </p>
                                                <p className="text-red-500 font-bold">
                                                    {productData?.productDiscounts[0].newPrice.toFixed(3)} TND
                                                </p>
                                            </>
                                        ) : (
                                            <p className="font-bold text-xl">
                                                {productData?.price?.toFixed(3)} TND
                                                <span className="text-sm text-gray-400 ml-2">TTC</span>
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-gray-600">
                                        <span className="font-semibold">Quantité : </span>
                                        {1}
                                    </p>
                                </div>
                            </div>

                            {/* Order Summary Section */}
                            <div className="border-t pt-4 space-y-4">
                                <h2 className="text-lg sm:text-xl font-bold text-center sm:text-left">
                                    Il y a {quantityInBasket} articles dans votre panier
                                </h2>
                                <div className="space-y-3 text-gray-600">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Total des produits :</span>
                                        <span>{totalPrice.toFixed(3)} TND</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Expédition totale :</span>
                                        <span>
                                            {Number(totalPrice) >= 499
                                                ? "Gratuit"
                                                : `${deliveryPrice.toFixed(3)} TND`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-lg text-black border-t pt-2">
                                        <span className="font-semibold">Total :</span>
                                        <span>{calculateTotal()} TND (TTC)</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                    <button
                                        onClick={handleClose}
                                        className="w-full sm:w-auto px-6 py-3 bg-secondaryColor text-white text-sm font-semibold uppercase tracking-wider rounded hover:bg-opacity-90 transition-colors duration-300">
                                        Continuer mes achats
                                    </button>
                                    <Link
                                        href="/Basket"
                                        onClick={closePruchaseOptions}
                                        className="w-full sm:w-auto px-6 py-3 text-center bg-primaryColor text-white text-sm font-semibold uppercase tracking-wider rounded hover:bg-opacity-90 transition-colors duration-300">
                                        Commander
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseOptions;