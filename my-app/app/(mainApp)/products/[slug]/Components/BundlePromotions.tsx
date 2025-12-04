"use client";

import React, { useMemo } from 'react';
import { BiGift, BiTrendingDown, BiPackage, BiSolidTruck } from 'react-icons/bi';
import { BsCheckCircle, BsInfoCircle, BsLightningFill } from 'react-icons/bs';
import { useBundles } from '@/app/hooks/useBundles';
import type { CartItem } from '@/app/hooks/useBundles';

interface BundlePromotionsProps {
    productRef: string;
    price?: number;
    productName?: string;
    cartItems?: CartItem[];
}

const BundlePromotions: React.FC<BundlePromotionsProps> = ({
    productRef,
    price = 0,
    productName = 'Ce produit',
    cartItems = []
}) => {
    // Calculate total quantity for this product reference across entire cart
    const totalQuantityInCart = useMemo(() => {
        return cartItems
            .filter(item => item.productRef === productRef)
            .reduce((sum, item) => sum + item.quantity, 0);
    }, [cartItems, productRef]);

    // Create cart items for bundle evaluation with combined quantity
    const evaluationCartItems: CartItem[] = useMemo(() => {
        const otherItems = cartItems.filter(item => item.productRef !== productRef);
        return [
            ...otherItems,
            {
                productRef,
                quantity: totalQuantityInCart,
                price,
                name: productName
            }
        ];
    }, [cartItems, productRef, totalQuantityInCart, price, productName]);

    const { bundles, applicableBundles, loading } = useBundles(evaluationCartItems);

    // Get bundle styling based on type
    const getBundleStyle = (type: string) => {
        switch (type) {
            case 'BUY_X_GET_Y_FREE':
                return { 
                    icon: <BiPackage size={22} />, 
                    gradient: 'from-purple-500 to-pink-500',
                    bgGradient: 'from-purple-50 to-pink-50',
                    borderColor: 'border-purple-300',
                    textColor: 'text-purple-700',
                    iconBg: 'bg-purple-100',
                    progressBar: 'bg-gradient-to-r from-purple-500 to-pink-500'
                };
            case 'PERCENTAGE_OFF':
                return { 
                    icon: <BiTrendingDown size={22} />, 
                    gradient: 'from-orange-500 to-red-500',
                    bgGradient: 'from-orange-50 to-red-50',
                    borderColor: 'border-orange-300',
                    textColor: 'text-orange-700',
                    iconBg: 'bg-orange-100',
                    progressBar: 'bg-gradient-to-r from-orange-500 to-red-500'
                };
            case 'FIXED_AMOUNT_OFF':
                return { 
                    icon: <BiTrendingDown size={22} />, 
                    gradient: 'from-red-500 to-rose-500',
                    bgGradient: 'from-red-50 to-rose-50',
                    borderColor: 'border-red-300',
                    textColor: 'text-red-700',
                    iconBg: 'bg-red-100',
                    progressBar: 'bg-gradient-to-r from-red-500 to-rose-500'
                };
            case 'FREE_DELIVERY':
                return { 
                    icon: <BiSolidTruck size={22} />, 
                    gradient: 'from-blue-500 to-cyan-500',
                    bgGradient: 'from-blue-50 to-cyan-50',
                    borderColor: 'border-blue-300',
                    textColor: 'text-blue-700',
                    iconBg: 'bg-blue-100',
                    progressBar: 'bg-gradient-to-r from-blue-500 to-cyan-500'
                };
            case 'FREE_GIFT':
                return { 
                    icon: <BiGift size={22} />, 
                    gradient: 'from-green-500 to-emerald-500',
                    bgGradient: 'from-green-50 to-emerald-50',
                    borderColor: 'border-green-300',
                    textColor: 'text-green-700',
                    iconBg: 'bg-green-100',
                    progressBar: 'bg-gradient-to-r from-green-500 to-emerald-500'
                };
            default:
                return { 
                    icon: <BiGift size={22} />, 
                    gradient: 'from-gray-500 to-gray-600',
                    bgGradient: 'from-gray-50 to-gray-100',
                    borderColor: 'border-gray-300',
                    textColor: 'text-gray-700',
                    iconBg: 'bg-gray-100',
                    progressBar: 'bg-gradient-to-r from-gray-500 to-gray-600'
                };
        }
    };

    // Filter bundles that apply to this product
    const relevantBundles = useMemo(() => {
        return bundles.filter((bundle: any) => {
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
            <div className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl animate-pulse">
                <div className="h-5 bg-gray-200 rounded-lg w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
            </div>
        );
    }

    if (relevantBundles.length === 0) {
        return null;
    }

    return (
        <div className="bundleOffre mt-6 space-y-4">
            {/* Header with shimmer effect */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primaryColor to-purple-600 rounded-2xl p-4 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                <div className="relative flex items-center gap-3">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                        <BsLightningFill className="text-white" size={24} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-base">Offres Spéciales</h3>
                        <p className="text-white/90 text-xs">Profitez de nos promotions exclusives</p>
                    </div>
                </div>
            </div>


            {/* Bundle cards */}
            <div className="space-y-3">
                {relevantBundles.map((bundle: any) => {
                    const style = getBundleStyle(bundle.type);
                    const isApplicable = applicableBundles.some(
                        (ab: any) => ab.bundle.id === bundle.id
                    );
                    const progress = Math.min((totalQuantityInCart / bundle.minQuantity) * 100, 100);

                    return (
                        <div
                            key={bundle.id}
                            className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                                isApplicable
                                    ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-green-400 shadow-lg shadow-green-100'
                                    : `bg-gradient-to-br ${style.bgGradient} ${style.borderColor} hover:shadow-lg`
                            }`}
                        >
                            {/* Decorative corner badge for applicable bundles */}
                            {isApplicable && (
                                <div className="absolute top-0 right-0">
                                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow-md flex items-center gap-1">
                                        <BsCheckCircle size={12} />
                                        <span>Actif</span>
                                    </div>
                                </div>
                            )}

                            <div className="p-4">
                                <div className="flex items-start gap-3">
                                    {/* Icon with gradient */}
                                    <div className={`relative p-3 rounded-xl ${
                                        isApplicable 
                                            ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                                            : `bg-gradient-to-br ${style.gradient}`
                                    } shadow-md`}>
                                        <div className="text-white">
                                            {style.icon}
                                        </div>
                                        {/* Pulse animation for applicable bundles */}
                                        {isApplicable && (
                                            <div className="absolute inset-0 rounded-xl bg-green-400 animate-ping opacity-20"></div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h4 className={`font-bold text-sm leading-tight ${
                                                isApplicable ? 'text-green-800' : style.textColor
                                            }`}>
                                                {bundle.name}
                                            </h4>
                                        </div>

                                        <p className="text-xs text-gray-700 leading-relaxed mb-3">
                                            {bundle.description}
                                        </p>

                                        {/* Bundle conditions with icons */}
                                        {(bundle.minQuantity > 0 || bundle.minPurchaseAmount > 0) && (
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {bundle.minQuantity > 0 && (
                                                    <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-gray-200">
                                                        <BiPackage className={style.textColor} size={14} />
                                                        <span className="text-xs font-medium text-gray-700">
                                                            Min. {bundle.minQuantity} article{bundle.minQuantity > 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                )}
                                                {bundle.minPurchaseAmount > 0 && (
                                                    <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-gray-200">
                                                        <BsInfoCircle className={style.textColor} size={14} />
                                                        <span className="text-xs font-medium text-gray-700">
                                                            Min. {bundle.minPurchaseAmount} TND
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Reward badge */}
                                        {isApplicable && (
                                            <div className="relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-3 shadow-md mb-3">
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                                                <div className="relative flex items-center gap-2">
                                                    <div className="text-xl">
                                                        {bundle.type === 'BUY_X_GET_Y_FREE' && '🎁'}
                                                        {bundle.type === 'PERCENTAGE_OFF' && '💰'}
                                                        {bundle.type === 'FIXED_AMOUNT_OFF' && '💰'}
                                                        {bundle.type === 'FREE_DELIVERY' && '🚚'}
                                                        {bundle.type === 'FREE_GIFT' && '🎁'}
                                                    </div>
                                                    <p className="text-white font-bold text-sm">
                                                        {bundle.type === 'BUY_X_GET_Y_FREE' &&
                                                            `Obtenez ${bundle.freeProductQuantity} article${bundle.freeProductQuantity > 1 ? 's' : ''} GRATUIT${bundle.freeProductQuantity > 1 ? 'S' : ''} !`}
                                                        {bundle.type === 'PERCENTAGE_OFF' &&
                                                            `${bundle.discountPercentage}% DE RÉDUCTION !`}
                                                        {bundle.type === 'FIXED_AMOUNT_OFF' &&
                                                            `${bundle.discountAmount} TND DE RÉDUCTION !`}
                                                        {bundle.type === 'FREE_DELIVERY' &&
                                                            `LIVRAISON GRATUITE !`}
                                                        {bundle.type === 'FREE_GIFT' &&
                                                            `CADEAU GRATUIT INCLUS !`}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Progress bar for non-applicable bundles */}
                                        {!isApplicable && bundle.minQuantity > 0 && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-xs font-semibold">
                                                    <span className="text-gray-700 flex items-center gap-1">
                                                        <BsInfoCircle size={12} />
                                                        Progression
                                                    </span>
                                                    <span className={`${style.textColor} flex items-center gap-1`}>
                                                        <span className="text-base">{totalQuantityInCart}</span>
                                                        <span className="text-gray-400">/</span>
                                                        <span>{bundle.minQuantity}</span>
                                                    </span>
                                                </div>
                                                
                                                {/* Animated progress bar */}
                                                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                                    <div
                                                        className={`h-full ${style.progressBar} rounded-full transition-all duration-700 ease-out relative overflow-hidden`}
                                                        style={{ width: `${progress}%` }}
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                                                    </div>
                                                </div>
                                                
                                                {totalQuantityInCart < bundle.minQuantity && (
                                                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-gray-200">
                                                        <p className="text-xs text-gray-600 font-medium text-center">
                                                            ✨ Plus que <span className={`font-bold ${style.textColor}`}>
                                                                {bundle.minQuantity - totalQuantityInCart}
                                                            </span> article{bundle.minQuantity - totalQuantityInCart > 1 ? 's' : ''} pour débloquer cette offre !
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

        

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
                .animate-slideIn {
                    animation: slideIn 0.5s ease-out;
                }
                .delay-100 {
                    animation-delay: 0.1s;
                }
                .delay-200 {
                    animation-delay: 0.2s;
                }
            `}</style>
        </div>
    );
};

export default BundlePromotions;