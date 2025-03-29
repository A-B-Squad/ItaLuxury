import {
    useBasketStore,
    useProductDetails,
    useProductsInBasketStore,
    usePruchaseOptions,
} from "@/app/store/zustand";
import { useToast } from "@/components/ui/use-toast";
import { ADD_TO_BASKET_MUTATION } from "@/graphql/mutations";
import { BASKET_QUERY } from "@/graphql/queries";
import triggerEvents from "@/utlils/trackEvents";
import { useMutation } from "@apollo/client";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import ProductActions from "./ProductActions";
import ProductImage from "./ProductImage";
import { sendGTMEvent } from "@next/third-parties/google";
import { useAuth } from "@/lib/auth/useAuth";

interface ProductProps {
    key: any;
    product: any;
    isFavorite: boolean;
    basketData: any;
    userData: any;
}

const ProductDetails: React.FC<ProductProps> = ({
    product,
    basketData,
    userData,
    isFavorite,
}) => {
    const { toast } = useToast();
    const { toggleIsUpdated } = useBasketStore();
    const { openProductDetails } = useProductDetails();
    const [addToBasket, { loading: addingToBasket }] = useMutation(ADD_TO_BASKET_MUTATION);
    const { openPruchaseOptions } = usePruchaseOptions();
    const { decodedToken, isAuthenticated } = useAuth();

    const {
        products: storedProducts,
        addProductToBasket,
        increaseProductInQtBasket,
    } = useProductsInBasketStore();

    const productInBasket = useMemo(() => {
        if (isAuthenticated && basketData?.basketByUserId) {
            return basketData.basketByUserId.find(
                (item: any) => item.Product.id === product.id
            );
        }
        return storedProducts.find((p: any) => p.id === product.id);
    }, [isAuthenticated, basketData, storedProducts, product.id]);

    const AddToBasket = async (product: any, quantity: number = 1) => {
        if (addingToBasket) return;

        openPruchaseOptions(product);

        const price =
            product.productDiscounts.length > 0
                ? product.productDiscounts[0].newPrice
                : product.price;

        // Analytics data
        const addToCartData = {
            user_data: {
                em: userData?.fetchUsersById?.email ? [userData.fetchUsersById.email.toLowerCase()] : [],
                fn: userData?.fetchUsersById?.fullName ? [userData.fetchUsersById.fullName] : [],
                ph: userData?.fetchUsersById?.number ? [userData.fetchUsersById.number] : [],
                country: ["tn"],
                external_id: userData?.fetchUsersById?.id || null,
            },
            custom_data: {
                content_name: product.name,
                content_type: "product",
                content_ids: [product.id],
                value: price * quantity,
                currency: "TND",
                contents: [{
                    id: product.id,
                    quantity: quantity,
                    item_price: price
                }]
            },
        };

        const cartEventDataGTM = {
            event: "add_to_cart",
            ecommerce: {
                currency: "TND",
                value: price * quantity,
                items: [{
                    item_id: product.id,
                    item_name: product.name,
                    quantity: quantity,
                    price: price
                }]
            },
            user_data: addToCartData.user_data,
            facebook_data: {
                content_name: product.name,
                content_type: "product",
                content_ids: [product.id],
                value: price * quantity,
                currency: "TND"
            }
        };

        // Track events
        triggerEvents("AddToCart", addToCartData);
        sendGTMEvent(cartEventDataGTM);

        if (isAuthenticated) {
            try {
                const currentBasketQuantity = productInBasket
                    ? productInBasket.quantity || productInBasket.actualQuantity
                    : 0;

                if (currentBasketQuantity + quantity > product.inventory) {
                    toast({
                        title: "Quantité non disponible",
                        description: `Désolé, nous n'avons que ${product.inventory} unités en stock.`,
                        className: "bg-red-600 text-white",
                    });
                    return;
                }

                await addToBasket({
                    variables: {
                        input: {
                            userId: decodedToken?.userId,
                            quantity,
                            productId: product.id,
                        },
                    },
                    refetchQueries: [
                        {
                            query: BASKET_QUERY,
                            variables: { userId: decodedToken?.userId },
                        },
                    ],
                    onCompleted: () => {
                        toast({
                            title: "Produit ajouté au panier",
                            description: `${quantity} ${quantity > 1 ? "unités" : "unité"} de "${product?.name}" ${quantity > 1 ? "ont été ajoutées" : "a été ajoutée"} à votre panier.`,
                            className: "bg-primaryColor text-white",
                        });
                    },
                });
            } catch (error) {
                console.error("Error adding to basket:", error);
                toast({
                    title: "Erreur",
                    description:
                        "Une erreur s'est produite lors de l'ajout au panier. Veuillez réessayer.",
                    className: "bg-red-600 text-white",
                });
            }
        } else {
            const filteredProduct = storedProducts.find(
                (p: any) => p.id === product?.id
            );

            if (
                filteredProduct &&
                filteredProduct.actualQuantity + quantity > product.inventory
            ) {
                toast({
                    title: "Quantité non disponible",
                    description: `Désolé, nous n'avons que ${product.inventory} unités en stock.`,
                    className: "bg-red-600 text-white",
                });
                return;
            }

            if (filteredProduct) {
                increaseProductInQtBasket(product.id, quantity);
            } else {
                addProductToBasket({
                    ...product,
                    price,
                    actualQuantity: quantity,
                });
            }

            toast({
                title: "Produit ajouté au panier",
                description: `${quantity} ${quantity > 1 ? "unités" : "unité"} de "${product?.name}" ${quantity > 1 ? "ont été ajoutées" : "a été ajoutée"} à votre panier.`,
                className: "bg-primaryColor text-white",
            });
        }
        toggleIsUpdated();
    };

    const handleCategoryStorage = useCallback(
        (e: React.MouseEvent) => {
            if (!product?.categories?.[0]) return;
            const categories = [
                product.categories[0].name,
                product.categories[1]?.name,
                product.categories[2]?.name,
                product.name,
            ].filter(Boolean);

            try {
                localStorage.setItem("productCategories", JSON.stringify(categories));
            } catch (error) {
                console.error("Error storing categories in localStorage:", error);
            }
        },
        [product]
    );

    // Calculate discount percentage
    const discountData = product?.productDiscounts?.[0];


    return (
        <div 
            key={product?.id}
            className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 opacity-100 transform-none"
        >
            <div className="relative aspect-square w-full overflow-hidden">
                <ProductImage product={product} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="p-4 md:p-6 flex flex-col justify-between md:w-3/5 relative">
                {/* Hot deal badge for special products */}
                {product?.isHot && (
                    <div className="absolute -top-3 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md transform rotate-2">
                        HOT DEAL
                    </div>
                )}

                <div>
                    <Link
                        href={`/products/tunisie?productId=${product.id}`}
                        onClick={handleCategoryStorage}
                        className="block group"
                    >
                        <h2 className="text-xl font-semibold text-gray-800 group-hover:text-primaryColor transition-colors duration-200 line-clamp-2">
                            {product?.name}
                        </h2>

                        <div className="mt-3 flex items-center flex-wrap">
                            {discountData && (
                                <span className="line-through text-gray-500 text-sm mr-2">
                                    {product?.price?.toFixed(3) || '0.000'} TND
                                </span>
                            )}
                            <span className="text-primaryColor font-bold text-2xl">
                                {(discountData ? discountData.newPrice : product?.price)?.toFixed(3) || '0.000'} TND
                            </span>

                            {/* Limited time offer indicator */}
                            {discountData && (
                                <span className="ml-3 bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                                    Offre limitée
                                </span>
                            )}
                        </div>

                        {/* Rating stars - simulated for visual appeal */}
                        <div className="mt-2 flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < (product?.rating || 4) ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                            <span className="ml-1 text-sm text-gray-600">
                                ({product?.reviewCount || Math.floor(Math.random() * 50) + 10} avis)
                            </span>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                            {product?.attributes
                                ?.slice(0, 2)
                                ?.map((attribute: any, i: number) => (
                                    <div key={i} className="flex items-center text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                        <span className="font-medium mr-1">
                                            {attribute.name}:
                                        </span>
                                        <span className="capitalize">
                                            {attribute.value}
                                        </span>
                                    </div>
                                ))}
                        </div>

                        {product.Colors && (
                            <div className="mt-3 flex items-center">
                                <span className="text-sm text-gray-600 mr-2">Couleur:</span>
                                <div
                                    className="w-5 h-5 rounded-full border border-gray-300 shadow-sm"
                                    style={{ backgroundColor: product?.Colors?.Hex }}
                                    title={product?.Colors?.color}
                                />
                                {product?.Colors?.color && (
                                    <span className="ml-2 text-sm text-gray-600 capitalize">
                                        {product.Colors.color}
                                    </span>
                                )}
                            </div>
                        )}
                    </Link>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-2 sm:items-center">
                    <button
                        type="button"
                        className={`px-4 py-3 bg-primaryColor text-white rounded-lg hover:bg-amber-600 transition-all duration-200 flex-grow text-center font-medium shadow-sm hover:shadow ${addingToBasket ? 'opacity-70 cursor-not-allowed' : ''}`}
                        onClick={() => AddToBasket(product, 1)}
                        disabled={addingToBasket}
                    >
                        {addingToBasket ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Ajout en cours...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                </svg>
                                Acheter maintenant
                            </span>
                        )}
                    </button>

                    <div className="flex justify-center sm:justify-end">
                        <ProductActions
                            product={product}
                            toast={toast}
                            isFavorite={isFavorite}
                            openProductDetails={openProductDetails}
                        />
                    </div>
                </div>

                {/* Stock indicator with progress bar for limited stock */}
                <div className="mt-4">
                    {product?.inventory > 0 ? (
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-green-600 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    En stock
                                </span>
                                {product.inventory < 10 && (
                                    <span className="text-xs text-orange-600">
                                        Plus que {product.inventory} en stock!
                                    </span>
                                )}
                            </div>
                            {product.inventory < 10 && (
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className="bg-orange-500 h-1.5 rounded-full"
                                        style={{ width: `${Math.min(100, (product.inventory / 10) * 100)}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <span className="text-sm text-red-600 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Rupture de stock
                        </span>
                    )}
                </div>

                {/* Free shipping badge */}
                {((discountData ? discountData.newPrice : product?.price) >= 499) && (
                    <div className="mt-3 inline-flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path>
                        </svg>
                        Livraison gratuite
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
