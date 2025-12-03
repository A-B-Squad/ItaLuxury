// app/hooks/useBundles.ts
import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { GET_ACTIVE_BUNDLES } from '@/graphql/queries';
import { BundleService } from '../services/bundleService';



export type BundleType = 'BUY_X_GET_Y_FREE' | 'PERCENTAGE_OFF' | 'FIXED_AMOUNT_OFF' | 'FREE_DELIVERY' | 'FREE_GIFT';
export type BundleStatus = 'ACTIVE' | 'INACTIVE';

export interface Bundle {
    id: string;
    name: string;
    description: string;
    type: BundleType;
    status: BundleStatus;
    startDate?: string;
    endDate?: string;
    minPurchaseAmount: number;
    minQuantity: number;
    requiredProductRefs: string[];
    anyProductRefs: string[];
    requiredCategoryIds: string[];
    requiredBrandIds: string[];
    requireAllProducts: boolean;
    freeProductQuantity: number;
    freeProductRef?: string;
    discountPercentage: number;
    discountAmount: number;
    applyDiscountTo: string;
    givesFreeDelivery: boolean;
    giftProductRef?: string;
    giftQuantity: number;
    maxUsagePerUser?: number;
    maxUsageTotal?: number;
    currentUsage: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CartItem {
    productRef: string;
    quantity: number;
    price: number;
    name: string;
    isFree?: boolean;
    isFreeGift?: boolean;
}

export interface BundleEvaluation {
    bundle: Bundle;
    isApplicable: boolean;
    discount: number;
 
}

/**
 * Hook to fetch and apply bundles to cart
 */
export const useBundles = (cartItems: CartItem[]) => {
    // Fetch active bundles
    const { data, loading, error } = useQuery(GET_ACTIVE_BUNDLES, {
        fetchPolicy: 'cache-and-network'
    });

    const bundles = data?.getActiveBundles || [];

    // Calculate bundle effects on cart
    const bundleResults = useMemo(() => {
        if (!bundles.length || !cartItems.length) {
            return {
                applicableBundles: [],
                totalDiscount: 0,
                hasFreeDelivery: false,
            };
        }

        return BundleService.applyBundlesToCart(bundles, cartItems);
    }, [bundles, cartItems]);

    return {
        bundles,
        loading,
        error,
        ...bundleResults
    };
};

/**
 * Hook to get bundle suggestions (bundles that are close to being applicable)
 */
export const useBundleSuggestions = (cartItems: CartItem[]) => {
    const { data } = useQuery(GET_ACTIVE_BUNDLES);
    const bundles = data?.getActiveBundles || [];

    const suggestions = useMemo(() => {
        return bundles
            .map((bundle: any) => {
                const evaluation = BundleService.evaluateBundle(bundle, cartItems);

                if (!evaluation.isApplicable && evaluation.message) {
                    return {
                        bundle,
                        message: evaluation.message,
                        requirement: bundle.minPurchaseAmount || bundle.minQuantity
                    };
                }
                return null;
            })
            .filter(Boolean);
    }, [bundles, cartItems]);

    return suggestions;
};