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
        <div className="container mx-auto px-4 lg:px-8 py-8">
            <div className="grid lg:grid-cols-3 grid-cols-1 gap-5">
                {/* Product list */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center border-b p-6">
                        <h2 className="text-2xl font-bold text-gray-800">Panier</h2>
                        <h3 className="text-xl font-semibold text-gray-600">
                            {products.length} article{products.length > 1 ? "s" : ""}
                        </h3>
                    </div>

                    {products.length === 0 ? (
                        <EmptyBasket />
                    ) : (
                        <>
                            <BasketTable
                                products={products}
                                onIncreaseQuantity={handleIncreaseQuantity}
                                onDecreaseQuantity={handleDecreaseQuantity}
                                onRemoveProduct={handleRemoveProduct}
                            />

                            <BundleDisplay
                                applicableBundles={applicableBundles}
                                totalDiscount={totalDiscount}
                            />
                        </>
                    )}
                </div>

                {/* Order summary */}
                {products.length > 0 && (
                    <OrderSummary
                        productsCount={products.length}
                        subtotal={subtotal}
                        totalDiscount={totalDiscount}
                        deliveryFee={deliveryFee}
                        hasFreeDelivery={hasFreeDelivery}
                        totalPrice={totalPrice}
                        onProceedToCheckout={handleProceedToCheckout}
                    />
                )}
            </div>
        </div>
    );
};

export default Basket;