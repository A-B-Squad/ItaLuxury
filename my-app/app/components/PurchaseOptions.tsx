"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BASKET_QUERY } from '@/graphql/queries';
import { useQuery } from '@apollo/client';
import Image from 'next/image'

import Link from 'next/link';
import { IoCloseOutline } from 'react-icons/io5';
import { FaShoppingCart, FaCheck } from 'react-icons/fa';
import { useProductsInBasketStore, usePruchaseOptions } from '../store/zustand';
import { useAuth } from '../hooks/useAuth';

const PurchaseOptions = ({ companyData }: any) => {
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const { products: storedProducts, quantityInBasket } = useProductsInBasketStore();
    const { decodedToken, isAuthenticated } = useAuth();
    const { productData, closePruchaseOptions, isOpen } = usePruchaseOptions();
    const deliveryPrice: number = companyData?.deliveringPrice ?? 8;



    const { data: basketData, loading: basketLoading } = useQuery(BASKET_QUERY, {
        variables: { userId: decodedToken?.userId },
        skip: !isAuthenticated || !isOpen,
    });

    const productsInBasket = useMemo(() => {
        if (decodedToken?.userId && basketData?.basketByUserId) {
            return basketData.basketByUserId;
        }
        return storedProducts;
    }, [decodedToken, basketData, storedProducts]);

    const calculateTotalPrice = useCallback(() => {
        return productsInBasket.reduce((acc: number, product: any) => {
            const productDiscounts = product.productDiscounts ?? product?.Product?.productDiscounts ?? [];

            const productPrice = productDiscounts.length > 0
                ? (productDiscounts[0].newPrice)
                : (product.price ?? product?.Product?.price ?? 0);

            const quantity = product.quantity ?? product.actualQuantity ?? 0;

            return acc + Number(productPrice) * quantity;
        }, 0);
    }, [productsInBasket]);

    useEffect(() => {
        const updatedTotalPrice = calculateTotalPrice();
        setTotalPrice(updatedTotalPrice);
    }, [productsInBasket, calculateTotalPrice]);

    const calculateTotal = (): string => {
        const subtotal = Number(totalPrice || 0);
        if (Number.isNaN(subtotal)) {
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
    if (basketLoading) return null;

    const freeShippingThreshold = 499;
    const freeShippingRemaining = freeShippingThreshold - totalPrice;

    return (
        <div
            className="fixed inset-0 z-[11111111] transition-all duration-300 flex items-center justify-center"
            style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        >
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-300 
                    ${isOpen ? 'opacity-50' : 'opacity-0'}`}
                onClick={handleClose}
                style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
            />

            <div className="flex items-center justify-center h-full p-2 sm:p-4">
                <div
                    className={`w-full max-w-4xl max-h-[95vh] overflow-y-auto transform transition-all duration-300 
                        ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                    style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
                >
                    <div className="bg-primaryColor relative flex items-center justify-center p-2 sm:p-4 text-white rounded-t">
                        <div className="flex items-center gap-2">
                            <FaCheck className="text-white" size={16} />
                            <p className="text-sm sm:text-xl text-center">
                                Produit ajouté au panier avec succès
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="absolute right-2 sm:right-4 hover:rotate-90 transition-transform duration-300"
                            aria-label="Fermer"
                        >
                            <IoCloseOutline size={20} className="sm:w-6 sm:h-6" />
                        </button>
                    </div>

                    <div className="bg-white p-3 sm:p-6 rounded-b shadow-xl">
                        <div className="flex flex-col gap-3 sm:gap-6">
                            {/* Product Info Section */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 border-b pb-3 sm:pb-6">
                                {productData?.images[0] && (
                                    <div className="relative w-24 h-24 sm:w-48 sm:h-48 mx-auto sm:mx-0 border rounded overflow-hidden flex-shrink-0">
                                        <Image
                                            fill={true}
                                            src={productData.images[0]}
                                            alt={productData?.name || "Product"}
                                            style={{ objectFit: "contain" }}
                                            loading="eager"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            priority={true}
                                        />
                                    </div>
                                )}

                                <div className="flex flex-col gap-1.5 sm:gap-3 text-center sm:text-left flex-1">
                                    <h1 className="font-semibold text-sm sm:text-lg text-gray-800 line-clamp-2">{productData?.name}</h1>
                                    <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                                        {productData?.productDiscounts?.[0] ? (
                                            <>
                                                <p className="text-gray-400 line-through text-xs sm:text-base">
                                                    {productData?.price?.toFixed(3)} TND
                                                </p>
                                                <p className="text-red-500 font-bold text-sm sm:text-lg">
                                                    {productData?.productDiscounts[0].newPrice.toFixed(3)} TND
                                                </p>
                                            </>
                                        ) : (
                                            <p className="font-bold text-sm sm:text-lg text-primaryColor">
                                                {productData?.price?.toFixed(3)} TND
                                                <span className="text-xs sm:text-sm text-gray-400 ml-1 sm:ml-2">TTC</span>
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-xs sm:text-base">
                                        <span className="font-semibold">Quantité : </span>
                                        {1}
                                    </p>

                                    <div className="mt-auto pt-1 sm:pt-3">
                                        <Link
                                            href={`/products/${productData?.slug}`}
                                            className="text-primaryColor hover:underline text-xs sm:text-sm"
                                            onClick={handleClose}
                                        >
                                            Voir les détails du produit
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary Section */}
                            <div className="space-y-2 sm:space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm sm:text-lg font-bold text-gray-800 flex items-center gap-1.5 sm:gap-2">
                                        <FaShoppingCart className="text-primaryColor" size={14} />
                                        <span>Résumé du panier</span>
                                    </h2>
                                    <span className="bg-primaryColor text-white text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                        {quantityInBasket} {quantityInBasket > 1 ? 'articles' : 'article'}
                                    </span>
                                </div>

                                {freeShippingRemaining > 0 && (
                                    <div className="bg-blue-50 text-blue-700 p-2 sm:p-3 rounded-md text-xs sm:text-sm">
                                        Ajoutez {freeShippingRemaining.toFixed(3)} TND d'articles pour bénéficier de la livraison gratuite !
                                    </div>
                                )}

                                <div className="space-y-2 sm:space-y-3 text-gray-600 bg-gray-50 p-2.5 sm:p-4 rounded-md text-xs sm:text-base">
                                    <div className="flex justify-between">
                                        <span>Sous-total :</span>
                                        <span className="font-medium">{totalPrice.toFixed(3)} TND</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Frais de livraison :</span>
                                        <span className={Number(totalPrice) >= 499 ? "text-green-500 font-medium" : ""}>
                                            {Number(totalPrice) >= 499
                                                ? "Gratuit"
                                                : `${deliveryPrice.toFixed(3)} TND`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm sm:text-lg text-black border-t pt-1.5 sm:pt-2 mt-1.5 sm:mt-2">
                                        <span className="font-bold">Total :</span>
                                        <span className="font-bold">{calculateTotal()} TND</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-6">
                                    <button
                                        onClick={handleClose}
                                        className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 text-xs sm:text-sm font-medium rounded hover:bg-gray-50 transition-colors duration-300">
                                        Continuer mes achats
                                    </button>
                                    <Link
                                        href="/Basket"
                                        onClick={closePruchaseOptions}
                                        className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-center bg-primaryColor text-white text-xs sm:text-sm font-medium rounded hover:bg-opacity-90 transition-colors duration-300 flex items-center justify-center gap-2">
                                        <FaShoppingCart size={14} />
                                        Voir mon panier
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