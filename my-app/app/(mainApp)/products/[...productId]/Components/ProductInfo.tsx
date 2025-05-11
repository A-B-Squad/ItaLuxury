import HoverButton from '@/app/components/HoverButton';
import { useToast } from "@/components/ui/use-toast";
import { memo, useEffect, useMemo, useState } from "react";
import { FaPlus, FaRegHeart, FaShareAlt } from "react-icons/fa";
import { GoAlertFill, GoGitCompare } from "react-icons/go";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { MdAddShoppingCart, MdOutlineInfo } from "react-icons/md";
import { RiSubtractFill } from "react-icons/ri";
import DiscountCountDown from "./DiscountCountDown";
import OrderNow from "./OrderNow/OrderNowForm";
import ProductAttrMobile from "./ProductAttrMobile";

const ProductInfo = memo(({
  productDetails,
  technicalDetails,
  discount,
  AddToBasket,
  quantity,
  handleIncreaseQuantity,
  handleDecreaseQuantity,
  handleToggleFavorite,
  isProductInCompare,
  addToCompare
}: any) => {
  const { toast } = useToast();
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    setLastUpdate(Date.now());
  }, [productDetails?.price, productDetails?.productDiscounts]);

  const formattedPrice = useMemo(() =>
    productDetails?.price?.toFixed(3),
    [productDetails?.price, lastUpdate]
  );

  const productDescription = useMemo(() => ({
    __html: productDetails?.description || ''
  }), [productDetails?.description]);

  const isOutOfStock = useMemo(() =>
    productDetails?.inventory <= 0,
    [productDetails?.inventory]
  );

  const isMaxQuantity = useMemo(() =>
    quantity === productDetails?.inventory,
    [quantity, productDetails?.inventory]
  );

  const isLowStock = useMemo(() =>
    productDetails?.inventory === 1,
    [productDetails?.inventory]
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: productDetails?.name,
        text: `Découvrez ${productDetails?.name} sur Ita Luxury`,
        url: window.location.href,
      })
        .then(() => toast({
          title: "Partagé avec succès",
          description: "Merci d'avoir partagé ce produit",
          className: "bg-primaryColor text-white",
        }))
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié",
        description: "Le lien du produit a été copié dans le presse-papier",
        className: "bg-primaryColor text-white",
      });
    }
  };

  return (
    <div className="productInfo lg:col-span-4 col-span-12 p-3 md:p-5 w-full bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="product_name tracking-wide text-lg lg:text-2xl w-fit font-semibold text-gray-800 border-b border-gray-200 pb-2">
          {productDetails?.name}
        </h2>

        {/* Product action buttons at top */}
        <div className="flex items-center gap-1">
          <HoverButton
            title="Partager le produit"
            icon={<FaShareAlt />}
            onClick={handleShare}
          />

          <HoverButton
            title={isProductInCompare ? "Déjà dans le comparateur" : "Ajouter au comparateur"}
            icon={
              isProductInCompare ? (
                <IoCheckmarkDoneOutline size={22} className="text-green-600" />
              ) : (
                <GoGitCompare className="font-bold" />
              )
            }
            onClick={() => addToCompare(productDetails)}
            disabled={isProductInCompare}
          />

          <HoverButton
            title="Ajouter aux favoris"
            icon={<FaRegHeart />}
            onClick={handleToggleFavorite}
          />
        </div>
      </div>

      <div className="prices discount flex flex-col gap-3 mt-4" key={`price-${lastUpdate}`}>
        <div className="flex flex-wrap items-center gap-2 tracking-wide">
          {discount ? (
            <div className="w-full flex flex-wrap items-center gap-2">
              <p className="line-through font-semibold tracking-wider text-gray-500 text-sm sm:text-lg transition-all duration-300">
                {formattedPrice} TND
              </p>
              <p className="text-red-500 font-bold text-lg sm:text-2xl transition-all duration-300">
                {discount.newPrice.toFixed(3)} TND
              </p>
              <span className="text-xs sm:text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium transition-all duration-300">
                -{Math.round((1 - discount.newPrice / productDetails.price) * 100)}%
              </span>
            </div>
          ) : (
            <>
              <p className="font-bold text-primaryColor text-lg sm:text-2xl transition-all duration-300">{formattedPrice} TND</p>
              <span className="text-xs sm:text-sm text-gray-400 font-medium transition-all duration-300">TTC</span>
            </>
          )}
        </div>

        {discount && <DiscountCountDown discount={discount} />}
      </div>

      <div className="Infomation_Details mt-4">
        <div className="Reference mt-1 flex items-center gap-1">
          <h3 className="text-sm tracking-wider font-semibold capitalize text-gray-700">
            Reference :
          </h3>
          <p className="text-gray-600">{productDetails?.reference}</p>
        </div>

        <div className="stock-status mt-2">
          {isOutOfStock ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              <span className="mr-1.5 flex-shrink-0 relative">•</span>
              Rupture de stock
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <span className="mr-1.5 flex-shrink-0 relative">•</span>
              En stock
            </span>
          )}
        </div>

        <div className="Description mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg tracking-wider font-bold capitalize text-primaryColor border-b border-gray-200 pb-2">
              Description
            </h3>
            <HoverButton
              title="Informations produit"
              icon={<MdOutlineInfo />}
              onClick={() => {
                toast({
                  title: "Informations produit",
                  description: "Consultez la description pour plus de détails sur ce produit.",
                  className: "bg-gray-800 text-white",
                });
              }}
            />
          </div>
          <div
            className="product-description text-base text-gray-700 tracking-wide py-4 leading-relaxed"
            dangerouslySetInnerHTML={productDescription}
          />
        </div>
      </div>

      <div className="user_interaction flex flex-col gap- mt-6 border-t border-gray-200 pt-4">
        {isMaxQuantity && (
          <div className="flex items-center text-sm gap-3 bg-red-50 p-3 rounded-md">
            <GoAlertFill color="red" size={20} />
            <p className="text-red-600 font-semibold tracking-wider">
              La quantité maximale de produits est de {quantity}.
            </p>
          </div>
        )}

        {isLowStock && (
          <div className="flex text-sm items-center gap-3 bg-amber-50 p-3 rounded-md">
            <HiOutlineBellAlert color="orange" size={20} />
            <p className="text-amber-600 font-semibold tracking-wider">
              Attention: Il ne reste qu'un 1 article en stock.
            </p>
          </div>
        )}

        {/* Enhanced quantity selector with HoverButton */}
        <div className="Quantity flex lg:hidden items-center mt-3 space-x-2">
          <h3 className="tracking-wider font-medium text-base capitalize text-gray-700">
            Quantité:{" "}
          </h3>

          <div className="flex items-center gap-0 overflow-hidden rounded-md border border-gray-300">
            <HoverButton
              title="Diminuer la quantité"
              icon={<RiSubtractFill size={18} />}
              onClick={handleDecreaseQuantity}
              disabled={quantity === 1 || isOutOfStock}
              className="bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 rounded-none"
            />
            <div
              className="bg-white px-4 py-2 h-10 flex items-center justify-center font-semibold text-gray-800 text-md border-x border-gray-300 min-w-[40px]"
            >
              {quantity}
            </div>
            <HoverButton
              title="Augmenter la quantité"
              icon={<FaPlus size={14} />}
              onClick={handleIncreaseQuantity}
              disabled={isMaxQuantity || isOutOfStock}
              className="bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 rounded-none"
            />
          </div>
        </div>

        <ProductAttrMobile technicalDetails={technicalDetails} />
        {/* <RatingStarsMobile productId={productId} userId={userId} toast={toast} /> */}

        <OrderNow ActualQuantity={quantity} productDetails={productDetails} />

        <div className="addToBasket flex lg:hidden items-center  gap-3 md:gap-4">
          <button
            type="button"
            disabled={isOutOfStock}
            className={`min-w-[250px] w-4/5 transition-all py-4 rounded-md shadow-md flex items-center justify-center gap-2 ${isOutOfStock
              ? "bg-gray-300 cursor-not-allowed text-gray-500"
              : "bg-secondaryColor hover:bg-opacity-90 text-white"
              } text-sm font-bold`}
            onClick={() => !isOutOfStock && AddToBasket(productDetails)}
          >
            <MdAddShoppingCart size={20} />
            {isOutOfStock ? "Indisponible" : "Ajouter au panier"}
          </button>

          <div className="flex items-center gap-1">
            <HoverButton
              title="Ajouter aux favoris"
              icon={<FaRegHeart />}
              onClick={handleToggleFavorite}
            />

            <HoverButton
              title={isProductInCompare ? "Déjà dans le comparateur" : "Ajouter au comparateur"}
              icon={
                isProductInCompare ? (
                  <IoCheckmarkDoneOutline size={22} className="text-green-600" />
                ) : (
                  <GoGitCompare className="font-bold" />
                )
              }
              onClick={() => addToCompare(productDetails)}
              disabled={isProductInCompare}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductInfo;