"use client";
import { useAuth } from "@/app/hooks/useAuth";
import {
    useBasketStore,
    useCheckoutStore,
    useProductsInBasketStore,
} from "@/app/store/zustand";
import { useMemo, useCallback } from "react";
import { useBundles } from "@/app/hooks/useBundles";
import EmptyBasket from "./components/EmptyBasket";
import { BasketTable } from "./components/BasketTable";
import { BundleDisplay } from "./components/BundleDisplay";
import { OrderSummary } from "./components/OrderSummary";
import { useBasketData } from "./hooks/useBasketData";
import { useBasketMutations } from "./hooks/useBasketMutations";
import { useBasketTracking } from "./hooks/useBasketTracking";

const Basket = ({ userData, companyData }: any) => {
    const { decodedToken, isAuthenticated } = useAuth();
    const deliveryPrice: number = companyData?.deliveringPrice ?? 8;

    const {
        products: storedProducts,
        removeProductFromBasket,
        setQuantityInBasket,
        increaseProductInQtBasket,
        decreaseProductInQtBasket,
    } = useProductsInBasketStore();

    const { setCheckoutProducts, setCheckoutTotal } = useCheckoutStore();
    const { toggleIsUpdated } = useBasketStore();

    // Custom hooks
    const { products, setProducts, refetch } = useBasketData(
        decodedToken?.userId,
        isAuthenticated,
        storedProducts
    );

    const {
        handleIncreaseQuantity,
        handleDecreaseQuantity,
        handleRemoveProduct
    } = useBasketMutations(
        decodedToken?.userId,
        setProducts,
        toggleIsUpdated,
        refetch,
        increaseProductInQtBasket,
        decreaseProductInQtBasket,
        removeProductFromBasket
    );

    // Bundle integration
    const cartItemsForBundles = useMemo(() => {
        return products.map(product => ({
            productRef: product.reference || product.id,
            quantity: product.quantity || product.actualQuantity || 0,
            price: product.productDiscounts?.length > 0
                ? product.productDiscounts[0].newPrice
                : product.price,
            name: product.name
        }));
    }, [products]);

    const {
        applicableBundles,
        totalDiscount,
        hasFreeDelivery,
    } = useBundles(cartItemsForBundles);

    // Calculate prices
    const subtotal = useMemo(() => {
        return products.reduce((acc, product) => {
            const productPrice = product.productDiscounts?.length > 0
                ? product.productDiscounts[0].newPrice
                : product.price;
            const quantity = product.quantity || product.actualQuantity || 0;
            return acc + Number(productPrice) * quantity;
        }, 0);
    }, [products]);

    const totalPrice = useMemo(() => subtotal - totalDiscount, [subtotal, totalDiscount]);
    const deliveryFee = hasFreeDelivery ? 0 : (totalPrice >= 499 ? 0 : deliveryPrice);

    // Tracking
    useBasketTracking(products, totalPrice, userData);

    const handleProceedToCheckout = useCallback(() => {
        setCheckoutProducts(products);
        setCheckoutTotal(Number(totalPrice));
    }, [products, totalPrice, setCheckoutProducts, setCheckoutTotal]);

    return (
        <div className="min-h-screen bg-gray-50 py-4 md:py-8">
            <div className="container mx-auto px-3 sm:px-4 lg:px-8">
                {/* Page Header */}
                <div className="mb-4 md:mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mon Panier</h1>
                    <p className="text-sm md:text-base text-gray-600 mt-1">
                        {products.length > 0
                            ? `${products.length} article${products.length > 1 ? 's' : ''} dans votre panier`
                            : 'Votre panier est vide'}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    {/* Products Section */}
                    <div className="lg:col-span-2 space-y-4 md:space-y-5">
                        {/* Product List Card */}
                        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-lg overflow-hidden">
                            {/* Card Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-200 p-4 md:p-6 bg-gradient-to-r from-gray-50 to-white">
                                <div>
                                    <h2 className="text-lg md:text-2xl font-bold text-gray-800">
                                        Articles
                                    </h2>
                                    <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                                        Gérez les produits de votre panier
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 bg-primaryColor/10 px-3 py-1.5 rounded-full">
                                    <span className="text-xs md:text-sm font-semibold text-primaryColor">
                                        {products.length} article{products.length > 1 ? "s" : ""}
                                    </span>
                                </div>
                            </div>

                            {/* Products or Empty State */}
                            <div className="p-3 md:p-6">
                                {products.length === 0 ? (
                                    <EmptyBasket />
                                ) : (
                                    <BasketTable
                                        products={products}
                                        onIncreaseQuantity={handleIncreaseQuantity}
                                        onDecreaseQuantity={handleDecreaseQuantity}
                                        onRemoveProduct={handleRemoveProduct}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Bundle Display - Only show when products exist */}
                        {products.length > 0 && (
                            <BundleDisplay
                                applicableBundles={applicableBundles}
                                totalDiscount={totalDiscount}
                            />
                        )}
                    </div>

                    {/* Order Summary - Sticky on desktop */}
                    {products.length > 0 && (
                        <div className="lg:col-span-1">
                            <div className="lg:sticky lg:top-4">
                                <OrderSummary
                                    productsCount={products.length}
                                    subtotal={subtotal}
                                    totalDiscount={totalDiscount}
                                    deliveryFee={deliveryFee}
                                    hasFreeDelivery={hasFreeDelivery}
                                    totalPrice={totalPrice}
                                    onProceedToCheckout={handleProceedToCheckout}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Basket;