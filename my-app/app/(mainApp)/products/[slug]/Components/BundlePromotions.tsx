"use client";

import React, { useMemo } from 'react';
import { BiGift, BiTrendingDown, BiPackage, BiSolidTruck } from 'react-icons/bi';
import { BsCheckCircle, BsInfoCircle } from 'react-icons/bs';
import { useBundles } from '@/app/hooks/useBundles';
import type { CartItem } from '@/app/hooks/useBundles';

interface BundlePromotionsProps {
    productRef: string;
    currentQuantity: number;
    price?: number;
    productName?: string;
}

const BundlePromotions: React.FC<BundlePromotionsProps> = ({
    productRef,
    currentQuantity,
    price = 0,
    productName = 'Ce produit'
}) => {
    // Create a mock cart item for evaluation
    const cartItems: CartItem[] = useMemo(() => [{
        productRef,
        quantity: currentQuantity,
        price,
        name: productName
    }], [productRef, currentQuantity, price, productName]);

    const { bundles, applicableBundles, loading } = useBundles(cartItems);

    // Get bundle icon and color
    const getBundleIcon = (type: string) => {
        switch (type) {
            case 'BUY_X_GET_Y_FREE':
                return { icon: <BiPackage size={20} />, color: 'purple' };
            case 'PERCENTAGE_OFF':
                return { icon: <BiTrendingDown size={20} />, color: 'orange' };
            case 'FIXED_AMOUNT_OFF':
                return { icon: <BiTrendingDown size={20} />, color: 'red' };
            case 'FREE_DELIVERY':
                return { icon: <BiSolidTruck size={20} />, color: 'blue' };
            case 'FREE_GIFT':
                return { icon: <BiGift size={20} />, color: 'green' };
            default:
                return { icon: <BiGift size={20} />, color: 'gray' };
        }
    };

    // Filter bundles that apply to this product
    const relevantBundles = useMemo(() => {
        return bundles.filter((bundle: any) => {
            // Check if this product is part of the bundle requirements
            const isInRequired = bundle.requiredProductRefs?.includes(productRef);
            const isInAny = bundle.anyProductRefs?.includes(productRef);
            const hasNoSpecificProducts =
                (!bundle.requiredProductRefs || bundle.requiredProductRefs.length === 0) &&
                (!bundle.anyProductRefs || bundle.anyProductRefs.length === 0);

            return isInRequired || isInAny || hasNoSpecificProducts;
        });
    }, [bundles, productRef]);

    if (loading) {
        return (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
        );
    }

    if (relevantBundles.length === 0) {
        return null;
    }

    return (
        <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                <BiGift className="text-primaryColor" size={20} />
                <span>Promotions Disponibles</span>
            </div>

            <div className="space-y-2">
                {relevantBundles.map((bundle: any) => {
                    const { icon, color } = getBundleIcon(bundle.type);
                    const isApplicable = applicableBundles.some(
                        (ab: any) => ab.bundle.id === bundle.id
                    );

                    return (
                        <div
                            key={bundle.id}
                            className={`p-3 rounded-xl border-2 transition-all ${isApplicable
                                ? 'bg-green-50 border-green-200'
                                : 'bg-white border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className={`p-2 rounded-lg ${isApplicable ? 'bg-green-100' : 'bg-gray-100'
                                        }`}
                                >
                                    <div
                                        className={`${isApplicable
                                            ? 'text-green-600'
                                            : `text-${color}-600`
                                            }`}
                                    >
                                        {icon}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-bold text-sm text-gray-900">
                                            {bundle.name}
                                        </h4>
                                        {isApplicable && (
                                            <BsCheckCircle className="text-green-600 flex-shrink-0" size={16} />
                                        )}
                                    </div>

                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        {bundle.description}
                                    </p>

                                    {/* Bundle conditions */}
                                    <div className="mt-2 space-y-1">
                                        {bundle.minQuantity > 0 && (
                                            <div className="flex items-center gap-1 text-xs">
                                                <BsInfoCircle className="text-blue-500" size={12} />
                                                <span className="text-gray-600">
                                                    Min. {bundle.minQuantity} article{bundle.minQuantity > 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        )}
                                        {bundle.minPurchaseAmount > 0 && (
                                            <div className="flex items-center gap-1 text-xs">
                                                <BsInfoCircle className="text-blue-500" size={12} />
                                                <span className="text-gray-600">
                                                    Min. {bundle.minPurchaseAmount} TND
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Reward information */}
                                    {isApplicable && (
                                        <div className="mt-2 px-2 py-1 bg-green-100 rounded-md">
                                            <p className="text-xs font-semibold text-green-700">
                                                {bundle.type === 'BUY_X_GET_Y_FREE' &&
                                                    `🎁 Obtenez ${bundle.freeProductQuantity} article${bundle.freeProductQuantity > 1 ? 's' : ''} gratuit${bundle.freeProductQuantity > 1 ? 's' : ''}`}
                                                {bundle.type === 'PERCENTAGE_OFF' &&
                                                    `💰 ${bundle.discountPercentage}% de réduction`}
                                                {bundle.type === 'FIXED_AMOUNT_OFF' &&
                                                    `💰 ${bundle.discountAmount} TND de réduction`}
                                                {bundle.type === 'FREE_DELIVERY' &&
                                                    `🚚 Livraison gratuite`}
                                                {bundle.type === 'FREE_GIFT' &&
                                                    `🎁 Cadeau gratuit inclus`}
                                            </p>
                                        </div>
                                    )}

                                    {/* Progress towards bundle (if not yet applicable) */}
                                    {!isApplicable && bundle.minQuantity > 0 && (
                                        <div className="mt-2">
                                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                                <span>Progression</span>
                                                <span className="font-semibold">
                                                    {currentQuantity}/{bundle.minQuantity}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                <div
                                                    className={`bg-${color}-500 h-1.5 rounded-full transition-all`}
                                                    style={{
                                                        width: `${Math.min(
                                                            (currentQuantity / bundle.minQuantity) * 100,
                                                            100
                                                        )}%`,
                                                    }}
                                                ></div>
                                            </div>
                                            {currentQuantity < bundle.minQuantity && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Ajoutez encore {bundle.minQuantity - currentQuantity} article
                                                    {bundle.minQuantity - currentQuantity > 1 ? 's' : ''} pour débloquer
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Summary if bundles are applicable */}
            {applicableBundles.length > 0 && (
                <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                    <div className="flex items-center gap-2">
                        <BsCheckCircle className="text-green-600" size={18} />
                        <div>
                            <p className="text-sm font-bold text-green-700">
                                {applicableBundles.length} promotion{applicableBundles.length > 1 ? 's' : ''} active
                                {applicableBundles.length > 1 ? 's' : ''}
                            </p>
                            <p className="text-xs text-green-600">
                                Ajoutez au panier pour profiter de vos avantages
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BundlePromotions;