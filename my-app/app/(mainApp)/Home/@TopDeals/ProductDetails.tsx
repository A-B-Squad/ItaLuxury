import { useBasketStore, useProductDetails, useProductsInBasketStore, usePruchaseOptions } from "@/app/store/zustand";
import { useToast } from "@/components/ui/use-toast";
import { ADD_TO_BASKET_MUTATION } from "@/graphql/mutations";
import { BASKET_QUERY } from "@/graphql/queries";
import { useMutation } from "@apollo/client";
import Link from "next/link";
import ProductActions from "./ProductActions";
import ProductImage from "./ProductImage";
import { useAuth } from "@/app/hooks/useAuth";
import { trackAddToCart } from "@/utils/facebookEvents";

interface ProductProps {
    product: any;
    isFavorite: boolean;
    basketData: any;
    userData: any;
}

const ProductDetails = ({ product, basketData, userData, isFavorite }: ProductProps) => {
    const { toast } = useToast();
    const { toggleIsUpdated } = useBasketStore();
    const { openProductDetails } = useProductDetails();
    const [addToBasket, { loading: addingToBasket }] = useMutation(ADD_TO_BASKET_MUTATION);
    const { openPruchaseOptions } = usePruchaseOptions();
    const { decodedToken, isAuthenticated } = useAuth();
    const { products: storedProducts, addProductToBasket, increaseProductInQtBasket } = useProductsInBasketStore();

    const discountData = product?.productDiscounts?.[0];

    const productInBasket = isAuthenticated && basketData?.basketByUserId
        ? basketData.basketByUserId.find((item: any) => item.Product.id === product.id)
        : storedProducts.find((p: any) => p.id === product.id);

    // Helper function to prepare tracking product data
    const prepareTrackingProduct = (product: any, quantity: number) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        description: product.description,
        Brand: product.Brand,
        Colors: product.Colors,
        categories: product.categories,
        productDiscounts: product.productDiscounts,
        inventory: product.inventory,
        isVisible: product.isVisible,
        reference: product.reference,
        images: product.images,
        quantity: product.actualQuantity || quantity,
        technicalDetails: product.technicalDetails,
    });

    // Helper function to prepare user data
    const prepareUserData = () => {
        if (!userData) return undefined;

        return {
            id: decodedToken?.userId,
            email: userData.email,
            firstName: userData.fullName?.split(' ')[0] || userData.fullName,
            lastName: userData.fullName?.split(' ').slice(1).join(' ') || '',
            phone: userData.number,
            country: "tn",
            city: userData.city || "",
        };
    };

    // Helper function to track add to cart event
    const trackCartEvent = async (trackingProduct: any, user: any) => {
        try {
            console.log('🛒 Tracking AddToCart event:', {
                product_id: trackingProduct.id,
                product_name: trackingProduct.name,
                quantity: trackingProduct.quantity,
                user: user ? 'logged_in' : 'guest'
            });

            await trackAddToCart(trackingProduct, user);
            console.log('✅ AddToCart event tracked successfully');
        } catch (error) {
            console.error("❌ Error tracking add to cart:", error);
        }
    };

    // Helper function to check inventory availability
    const checkInventoryAvailability = (currentQuantity: number, requestedQuantity: number, inventory: number) => {
        return currentQuantity + requestedQuantity <= inventory;
    };

    // Helper function to show inventory error toast
    const showInventoryError = (inventory: number) => {
        toast({
            title: "Quantité non disponible",
            description: `Désolé, nous n'avons que ${inventory} unités en stock.`,
            className: "bg-red-600 text-white",
        });
    };

    // Helper function to show success toast
    const showSuccessToast = (productName: string, quantity: number) => {
        const unit = quantity > 1 ? "unités" : "unité";
        const verb = quantity > 1 ? "ont été ajoutées" : "a été ajoutée";

        toast({
            title: "Produit ajouté au panier",
            description: `${quantity} ${unit} de "${productName}" ${verb} à votre panier.`,
            className: "bg-primaryColor text-white",
        });
    };

    // Helper function to show error toast
    const showErrorToast = () => {
        toast({
            title: "Erreur",
            description: "Une erreur s'est produite lors de l'ajout au panier. Veuillez réessayer.",
            className: "bg-red-600 text-white",
        });
    };

    // Handle authenticated user basket addition
    const handleAuthenticatedBasketAdd = async (product: any, quantity: number) => {
        const currentBasketQuantity = productInBasket
            ? productInBasket.quantity || productInBasket.actualQuantity
            : 0;

        if (!checkInventoryAvailability(currentBasketQuantity, quantity, product.inventory)) {
            showInventoryError(product.inventory);
            return;
        }

        try {
            await addToBasket({
                variables: {
                    input: {
                        userId: decodedToken?.userId,
                        quantity,
                        productId: product.id,
                    },
                },
                refetchQueries: [{ query: BASKET_QUERY, variables: { userId: decodedToken?.userId } }],
                onCompleted: () => showSuccessToast(product.name, quantity),
            });
        } catch (error) {
            console.error("Error adding to basket:", error);
            showErrorToast();
        }
    };

    // Handle guest user basket addition
    const handleGuestBasketAdd = (product: any, quantity: number) => {
        const filteredProduct = storedProducts.find((p: any) => p.id === product?.id);
        const currentQuantity = filteredProduct?.actualQuantity || 0;

        if (!checkInventoryAvailability(currentQuantity, quantity, product.inventory)) {
            showInventoryError(product.inventory);
            return;
        }

        if (filteredProduct) {
            increaseProductInQtBasket(product.id, quantity);
        } else {
            addProductToBasket({
                ...product,
                price: product.price,
                discountedPrice: discountData ? product.productDiscounts : null,
                actualQuantity: quantity,
            });
        }

        showSuccessToast(product.name, quantity);
    };

    const AddToBasket = async (product: any, quantity: number = 1) => {
        if (addingToBasket) return;

        openPruchaseOptions(product);

        const trackingProduct = prepareTrackingProduct(product, quantity);
        const user = prepareUserData();

        await trackCartEvent(trackingProduct, user);

        if (isAuthenticated) {
            await handleAuthenticatedBasketAdd(product, quantity);
        } else {
            handleGuestBasketAdd(product, quantity);
        }

        toggleIsUpdated();
    };

    return (
        <div className="flex flex-col lg:flex-row bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
            <div className="relative w-full bg-white overflow-hidden">
                <ProductImage product={product} />
            </div>

            <div className="p-4 lg:p-6 flex flex-col justify-between lg:w-3/5 relative">
                {/* Hot deal badge */}
                {product?.isHot && (
                    <div className="absolute -top-3 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md transform rotate-2">
                        HOT DEAL
                    </div>
                )}

                <div>
                    <Link href={`/products/${product.slug}`} className="block group">
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

                            {discountData && (
                                <span className="ml-3 bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                                    Offre limitée
                                </span>
                            )}
                        </div>

                        {/* Rating stars */}
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
                        <ProductActions product={product} toast={toast} isFavorite={isFavorite} openProductDetails={openProductDetails} />
                    </div>
                </div>

                {/* Stock indicator */}
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
                                    />
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

export default ProductDetails