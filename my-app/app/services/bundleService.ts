// app/services/bundleService.ts

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
    freeItems: CartItem[];
    message: string;
}

export class BundleService {
    /**
     * Vérifie si les conditions d'un pack sont remplies par le panier
     */
    static evaluateBundle(bundle: Bundle, cartItems: CartItem[]): BundleEvaluation {
        const result: BundleEvaluation = {
            bundle,
            isApplicable: false,
            discount: 0,
            freeItems: [],
            message: ''
        };

        // Vérifier si le pack est actif
        if (bundle.status !== 'ACTIVE') {
            result.message = 'Le pack n\'est pas actif';
            return result;
        }

        // Vérifier la validité des dates
        const today = new Date().toISOString().split('T')[0];

        if (bundle.startDate && bundle.startDate > today) {
            result.message = 'Le pack n\'a pas encore commencé';
            return result;
        }

        if (bundle.endDate && bundle.endDate < today) {
            result.message = 'Le pack a expiré';
            return result;
        }

        // Vérifier l'utilisation maximale
        if (bundle.maxUsageTotal && bundle.currentUsage >= bundle.maxUsageTotal) {
            result.message = 'Limite d\'utilisation du pack atteinte';
            return result;
        }

        // Calculer les totaux du panier
        const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

        // Vérifier le montant minimum d'achat
        if (bundle.minPurchaseAmount > 0 && cartTotal < bundle.minPurchaseAmount) {
            result.message = `Achat minimum de ${bundle.minPurchaseAmount} TND requis`;
            return result;
        }

        // Vérifier la quantité minimale
        if (bundle.minQuantity > 0 && cartQuantity < bundle.minQuantity) {
            result.message = `Minimum de ${bundle.minQuantity} article${bundle.minQuantity > 1 ? 's' : ''} requis`;
            return result;
        }

        // Vérifier les produits requis (TOUS doivent être dans le panier)
        if (bundle.requiredProductRefs.length > 0) {
            const hasAllRequired = bundle.requiredProductRefs.every(ref =>
                cartItems.some(item => item.productRef === ref)
            );
            if (!hasAllRequired) {
                result.message = 'Produits requis non présents dans le panier';
                return result;
            }
        }

        // Vérifier la condition "n'importe quel produit"
        if (bundle.anyProductRefs.length > 0) {
            const matchingItems = cartItems.filter(item =>
                bundle.anyProductRefs.includes(item.productRef)
            );
            const matchingQty = matchingItems.reduce((sum, item) => sum + item.quantity, 0);

            if (bundle.requireAllProducts) {
                // Si requireAllProducts est true, TOUS les produits de la liste doivent être présents
                const hasAllProducts = bundle.anyProductRefs.every(ref =>
                    cartItems.some(item => item.productRef === ref)
                );
                if (!hasAllProducts) {
                    result.message = 'Tous les produits de la liste sont requis';
                    return result;
                }
            } else {
                // Sinon, juste la quantité minimale de n'importe quels produits de la liste
                if (matchingQty < bundle.minQuantity) {
                    result.message = `${bundle.minQuantity} article${bundle.minQuantity > 1 ? 's' : ''} requis parmi les produits spécifiés`;
                    return result;
                }
            }
        }

        // Les conditions du pack sont remplies
        result.isApplicable = true;

        // Calculer les récompenses selon le type de pack
        switch (bundle.type) {
            case 'BUY_X_GET_Y_FREE':
                result.freeItems = this.calculateFreeItems(bundle, cartItems);
                result.discount = result.freeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                result.message = `Obtenez ${bundle.freeProductQuantity} article${bundle.freeProductQuantity > 1 ? 's' : ''} gratuit${bundle.freeProductQuantity > 1 ? 's' : ''} !`;
                break;

            case 'PERCENTAGE_OFF':
                result.discount = this.calculatePercentageDiscount(bundle, cartItems);
                result.message = `${bundle.discountPercentage}% de réduction appliqués !`;
                break;

            case 'FIXED_AMOUNT_OFF':
                result.discount = Math.min(bundle.discountAmount, cartTotal);
                result.message = `${bundle.discountAmount} TND de réduction appliqués !`;
                break;

            case 'FREE_DELIVERY':
                result.message = 'Livraison gratuite appliquée !';
                break;

            case 'FREE_GIFT':
                if (bundle.giftProductRef) {
                    result.freeItems = [{
                        productRef: bundle.giftProductRef,
                        quantity: bundle.giftQuantity,
                        price: 0,
                        name: 'Cadeau Gratuit',
                        isFreeGift: true
                    }];
                    result.message = `Cadeau gratuit inclus !`;
                }
                break;
        }

        return result;
    }

    /**
     * Calculer les articles gratuits pour les packs BUY_X_GET_Y_FREE
     */
    private static calculateFreeItems(bundle: Bundle, cartItems: CartItem[]): CartItem[] {
        const freeItems: CartItem[] = [];

        if (bundle.freeProductRef) {
            // Un produit spécifique est gratuit
            const freeProduct = cartItems.find(item => item.productRef === bundle.freeProductRef);
            if (freeProduct) {
                freeItems.push({
                    ...freeProduct,
                    quantity: Math.min(bundle.freeProductQuantity, freeProduct.quantity),
                    isFree: true
                });
            }
        } else {
            // Le produit éligible le moins cher est gratuit
            const qualifyingItems = bundle.anyProductRefs.length > 0
                ? cartItems.filter(item => bundle.anyProductRefs.includes(item.productRef))
                : cartItems;

            const sortedItems = [...qualifyingItems].sort((a, b) => a.price - b.price);

            if (sortedItems.length > 0) {
                const cheapest = sortedItems[0];
                freeItems.push({
                    ...cheapest,
                    quantity: Math.min(bundle.freeProductQuantity, cheapest.quantity),
                    isFree: true
                });
            }
        }

        return freeItems;
    }

    /**
     * Calculer la réduction en pourcentage
     */
    private static calculatePercentageDiscount(bundle: Bundle, cartItems: CartItem[]): number {
        const qualifyingItems = bundle.anyProductRefs.length > 0
            ? cartItems.filter(item => bundle.anyProductRefs.includes(item.productRef))
            : cartItems;

        let itemsToDiscount: CartItem[] = [];

        switch (bundle.applyDiscountTo) {
            case 'CHEAPEST':
                itemsToDiscount = [qualifyingItems.sort((a, b) => a.price - b.price)[0]];
                break;
            case 'MOST_EXPENSIVE':
                itemsToDiscount = [qualifyingItems.sort((a, b) => b.price - a.price)[0]];
                break;
            case 'ALL':
            default:
                itemsToDiscount = qualifyingItems;
                break;
        }

        const totalToDiscount = itemsToDiscount.reduce(
            (sum, item) => sum + (item.price * item.quantity),
            0
        );

        return (totalToDiscount * bundle.discountPercentage) / 100;
    }

    /**
     * Appliquer tous les packs applicables au panier
     */
    static applyBundlesToCart(bundles: Bundle[], cartItems: CartItem[]) {
        const evaluations = bundles.map(bundle => this.evaluateBundle(bundle, cartItems));
        const applicableBundles = evaluations.filter(e => e.isApplicable);

        const totalDiscount = applicableBundles.reduce((sum, e) => sum + e.discount, 0);
        const allFreeItems = applicableBundles.flatMap(e => e.freeItems);
        const hasFreeDelivery = applicableBundles.some(e => e.bundle.type === 'FREE_DELIVERY');

        return {
            applicableBundles,
            totalDiscount,
            freeItems: allFreeItems,
            hasFreeDelivery,
            messages: applicableBundles.map(e => e.message)
        };
    }

    /**
     * Obtenir des suggestions de packs (packs proches d'être applicables)
     */
    static getBundleSuggestions(bundles: Bundle[], cartItems: CartItem[]) {
        return bundles
            .map(bundle => {
                const evaluation = this.evaluateBundle(bundle, cartItems);

                if (!evaluation.isApplicable && evaluation.message) {
                    // Calculer ce qui manque
                    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    const cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

                    let suggestion = '';

                    if (bundle.minPurchaseAmount > 0 && cartTotal < bundle.minPurchaseAmount) {
                        const remaining = bundle.minPurchaseAmount - cartTotal;
                        suggestion = `Ajoutez ${remaining.toFixed(2)} TND pour débloquer cette promotion`;
                    } else if (bundle.minQuantity > 0 && cartQuantity < bundle.minQuantity) {
                        const remaining = bundle.minQuantity - cartQuantity;
                        suggestion = `Ajoutez ${remaining} article${remaining > 1 ? 's' : ''} pour débloquer cette promotion`;
                    }

                    return {
                        bundle,
                        message: evaluation.message,
                        suggestion,
                        progress: bundle.minPurchaseAmount > 0
                            ? (cartTotal / bundle.minPurchaseAmount) * 100
                            : (cartQuantity / bundle.minQuantity) * 100
                    };
                }
                return null;
            })
            .filter(Boolean);
    }
}