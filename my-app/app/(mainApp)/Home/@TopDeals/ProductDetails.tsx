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
    setIsFavorite: (value: boolean) => void;
    basketData: any;
    userData: any;
}

const ProductDetails: React.FC<ProductProps> = ({
    product,
    basketData,
    userData,
    setIsFavorite,
    isFavorite,
}) => {
    const { toast } = useToast();
    const { toggleIsUpdated } = useBasketStore();
    const { openProductDetails } = useProductDetails();
    const [addToBasket] = useMutation(ADD_TO_BASKET_MUTATION);
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
        return storedProducts.find((product: any) => product.id === product.id);
    }, [isAuthenticated, basketData, storedProducts]);

    const AddToBasket = async (product: any, quantity: number = 1) => {
        openPruchaseOptions(product);

        const price =
            product.productDiscounts.length > 0
                ? product.productDiscounts[0].newPrice
                : product.price;
        const addToCartData = {
            user_data: {
                em: [userData?.fetchUsersById.email.toLowerCase()],
                fn: [userData?.fetchUsersById.fullName],
                ph: [userData?.fetchUsersById?.number],
                country: ["tn"],
                external_id: userData?.fetchUsersById.id,
            },
            custom_data: {
                content_name: product.name,
                content_type: "product",
                content_ids: [product.id],
                value: price * quantity,
                currency: "TND",
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
            // User data for both events
            user_data: {
              em: [userData?.fetchUsersById.email.toLowerCase()],
              fn: [userData?.fetchUsersById.fullName],
              ph: [userData?.fetchUsersById?.number],
              country: ["tn"],
              external_id: userData?.fetchUsersById.id
            },
            // Facebook specific data
            facebook_data: {
              content_name: product.name,
              content_type: "product",
              content_ids: [product.id],
              value: price * quantity,
              currency: "TND"
            }
          };
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
            const isProductAlreadyInBasket = storedProducts.some(
                (p: any) => p.id === product?.id
            );
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

            if (isProductAlreadyInBasket) {
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
                className: "bg-green-600 text-white",
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

    return (
        <div
            key={product?.id}
            className="grid lg:grid-cols-3 border group grid-cols-1 bg-white rounded-sm px-2 h-4/5 md:h-full lg:h-80 min-h-80 w-full lg:w-11/12 grid-flow-col grid-rows-2 lg:grid-rows-1 lg:grid-flow-row place-self-center items-center gap-5 relative"
        >
            <ProductImage product={product} />
            <ProductActions
                product={product}
                toast={toast}
                isFavorite={isFavorite}
                setIsFavorite={setIsFavorite}
                openProductDetails={openProductDetails}
                onAddToBasket={AddToBasket}
            />
            <div className="lg:col-span-2 row-span-1 lg:row-span-1 place-self-stretch lg:mt-3 flex flex-col justify-around">
                <Link
                    href={`/Collections/tunisie/?productId=${product?.id}`}
                    onClick={handleCategoryStorage}
                >
                    <h2 className="tracking-wider hover:text-secondaryColor transition-colors">
                        {product?.name}
                    </h2>
                    <div className="prices flex gap-3 items-center lg:mt-3">
                        <span className="line-through text-gray-700 font-semibold text-lg">
                            {product?.price.toFixed(3)}TND
                        </span>
                        <span className="text-primaryColor font-bold text-xl">
                            {product?.productDiscounts[0]?.newPrice.toFixed(3)}TND
                        </span>
                    </div>

                    <ul className="text-xs md:text-sm text-gray-500 tracking-wider mt-2">
                        {product?.attributes
                            ?.slice(0, 2)
                            ?.map((attribute: any, i: number) => (
                                <li key={i}>
                                    <span className="text-sm font-semibold">
                                        {attribute.name}
                                    </span>{" "}
                                    :{" "}
                                    <span className="text-sm font-light capitalize">
                                        {attribute.value}
                                    </span>
                                </li>
                            ))}
                    </ul>

                    <div
                        className="Color relative w-fit cursor-crosshair my-3 lg:my-0"
                        title={product?.Colors?.color}
                    >
                        {product.Colors && (
                            <div
                                className="colors_available items-center lg:mt-2 w-5 h-5 border-black border-2 rounded-sm shadow-gray-400 shadow-sm"
                                style={{
                                    backgroundColor: product?.Colors?.Hex,
                                }}
                            />
                        )}
                    </div>
                </Link>

                <button
                    type="button"
                    className="bg-primaryColor w-3/5 self-center py-2 text-white lg:mt-3 hover:bg-secondaryColor transition-colors"
                    onClick={() => {
                        AddToBasket(product, 1);
                        toast({
                            title: "Notification de Panier",
                            description: `Le produit "${product?.name}" a été ajouté au panier.`,
                            className: "bg-primaryColor text-white",
                        });
                    }}
                >
                    Acheter maintenant
                </button>
            </div>
        </div>
    );
};

export default ProductDetails;
