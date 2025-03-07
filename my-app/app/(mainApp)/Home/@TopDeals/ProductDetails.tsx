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
import { motion } from "framer-motion";

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
    const discountPercentage = discountData
        ? Math.round(((discountData.price - discountData.newPrice) / discountData.price) * 100)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            key={product?.id}
            className="flex flex-col md:flex-row bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        >
            <div className="md:w-2/5 relative">
                <ProductImage product={product} />
            </div>
            
            <div className="p-4 md:p-6 flex flex-col justify-between md:w-3/5">
                <div>
                    <Link
                        href={`/products/tunisie?productId=${product.id}`}
                        onClick={handleCategoryStorage}
                        className="block group"
                    >
                        <h2 className="text-lg font-medium text-gray-800 group-hover:text-primaryColor transition-colors duration-200 line-clamp-2">
                            {product?.name}
                        </h2>
                        
                        <div className="mt-2 flex items-center">
                            {discountData && (
                                <span className="line-through text-gray-500 text-sm mr-2">
                                    {product?.price.toFixed(3)} TND
                                </span>
                            )}
                            <span className="text-primaryColor font-bold text-xl">
                                {(discountData ? discountData.newPrice : product?.price).toFixed(3)} TND
                            </span>
                            
                            {discountPercentage > 0 && (
                                <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                                    -{discountPercentage}%
                                </span>
                            )}
                        </div>

                        <div className="mt-3 space-y-1">
                            {product?.attributes
                                ?.slice(0, 2)
                                ?.map((attribute: any, i: number) => (
                                    <div key={i} className="flex items-center text-sm text-gray-600">
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
                                    className="w-5 h-5 rounded-full border border-gray-300"
                                    style={{ backgroundColor: product?.Colors?.Hex }}
                                    title={product?.Colors?.color}
                                />
                            </div>
                        )}
                    </Link>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                    <button
                        type="button"
                        className={`px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-amber-600 transition-colors duration-200 flex-grow ${addingToBasket ? 'opacity-70 cursor-not-allowed' : ''}`}
                        onClick={() => AddToBasket(product, 1)}
                        disabled={addingToBasket}
                    >
                        {addingToBasket ? 'Ajout en cours...' : 'Acheter maintenant'}
                    </button>
                    
                    <ProductActions
                        product={product}
                        toast={toast}
                        isFavorite={isFavorite}
                        openProductDetails={openProductDetails}
                        onAddToBasket={AddToBasket}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default ProductDetails;
