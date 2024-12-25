import PopHover from "@/app/components/PopHover";
import { useToast } from "@/components/ui/use-toast";
import { memo, useMemo, useState } from "react";
import { FaPlus, FaRegHeart } from "react-icons/fa";
import { GoAlertFill, GoGitCompare } from "react-icons/go";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { MdAddShoppingCart } from "react-icons/md";
import { RiSubtractFill } from "react-icons/ri";
import DiscountCountDown from "./DiscountCountDown";
import OrderNow from "./OrderNow/OrderNowForm";
import ProductAttrMobile from "./ProductAttrMobile";
import RatingStarsMobile from "./RatingStarsMobile";
// Separate component for hover functionality
const HoverButton = memo(({ title, icon, onClick }: any) => {
  const [showPopover, setShowPopover] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowPopover(true)}
      onMouseLeave={() => setShowPopover(false)}
    >
      {showPopover && <PopHover title={title} />}
      <button
        type="button"
        className="transition-colors bg-transparent text-primaryColor text-xl hover:text-black font-bold rounded"
        onClick={onClick}
      >
        {icon}
      </button>
    </div>
  );
});

const ProductInfo = memo(({
  productDetails,
  attributes,
  userId,
  discount,
  productId,
  AddToBasket,
  quantity,
  handleIncreaseQuantity,
  handleDecreaseQuantity, handleToggleFavorite, isProductInCompare, addToCompare
}: any) => {
  const { toast } = useToast();



  const formattedPrice = useMemo(() =>
    productDetails?.price?.toFixed(3),
    [productDetails?.price]
  );

  const productDescription = useMemo(() => ({
    __html: productDetails?.description || ''
  }), [productDetails?.description]);

  return (
    <div className="productInfo lg:col-span-4 col-span-12 p-3 w-full">
      <h2 className="product_name tracking-wider text-lg lg:text-2xl w-fit font-semibold">
        {productDetails?.name}
      </h2>

      <div className="prices discount flex flex-col gap-3 mt-2">
        <div className="text-primaryColor flex items-center gap-3 tracking-wide text-2xl font-bold">
          {discount ? (
            <>
              <p className="text-gray-400 line-through font-semibold text-lg">
                {formattedPrice} TND
              </p>
              <p className="text-red-500 font-bold">
                {discount.newPrice.toFixed(3)} TND
              </p>
            </>
          ) : (
            <>
              <p className="font-bold">{formattedPrice} TND</p>
              <span className="text-sm text-gray-400 ml-2 font-medium">TTC</span>
            </>
          )}
        </div>

        {discount && <DiscountCountDown discount={discount} />}
      </div>

      <div className="Infomation_Details">
        <div className="Reference mt-1 flex items-center gap-1">
          <h3 className="text-sm tracking-wider font-semibold capitalize">
            Reference :
          </h3>
          <p className="text-gray-600">{productDetails?.reference}</p>
        </div>

        <div className="Description">
          <h3 className="text-lg tracking-wider font-bold capitalize text-primaryColor mt-3">
            Description
          </h3>
          <div
            className="product-description text-base text-[#000] tracking-wide  border-b-2 border-dashed pb-6"
            dangerouslySetInnerHTML={productDescription}
          />
        </div>
      </div>

      <div className="user_interaction flex flex-col gap-2 mt-4">
        {quantity === productDetails?.inventory && (
          <div className="flex items-center text-sm gap-3">
            <GoAlertFill color="red" size={20} />
            <p className="text-red-600 font-semibold tracking-wider">
              La quantité maximale de produits est de {quantity}.
            </p>
          </div>
        )}

        {productDetails?.inventory === 1 && (
          <div className="flex text-sm items-center gap-3">
            <HiOutlineBellAlert color="orange" size={20} />
            <p className="text-red-600 font-semibold tracking-wider">
              Attention: Il ne reste qu'un 1 article en stock.
            </p>
          </div>
        )}

        <div className="Quantity flex lg:hidden items-center mt-3 space-x-2">
          <h3 className="tracking-wider font-normal text-base capitalize text-primaryColor">
            Quantité:{" "}
          </h3>

          <div className="flex items-center gap-2 divide-x-0 overflow-hidden">
            <button
              type="button"
              className="bg-secondaryColor opacity-80 hover:opacity-75 transition-opacity text-white w-fit h-fit p-2 text-sm font-semibold cursor-pointer"
              disabled={quantity === 1}
              onClick={handleDecreaseQuantity}
            >
              <RiSubtractFill />
            </button>
            <button
              type="button"
              className="bg-transparent px-4 py-2 h-full border shadow-md font-semibold text-[#333] text-md"
            >
              {quantity}
            </button>
            <button
              type="button"
              className={`${quantity === productDetails.inventory ? "opacity-45" : ""
                } w-fit transition-opacity h-fit bg-secondaryColor text-white p-2 text-sm hover:opacity-75 font-semibold cursor-pointer`}
              disabled={quantity === productDetails.inventory}
              onClick={handleIncreaseQuantity}
            >
              <FaPlus />
            </button>
          </div>
        </div>

        <ProductAttrMobile attributes={attributes} />
        <RatingStarsMobile productId={productId} userId={userId} toast={toast} />

        <OrderNow ActualQuantity={quantity} productDetails={productDetails} />

        <div className="addToBasket flex lg:hidden items-center mt-4 gap-2 md:gap-4">
          <button
            type="button"
            disabled={productDetails.inventory <= 0}
            className={`${productDetails?.inventory <= 0 ? "cursor-not-allowed" : "cursor-pointer"
              } min-w-[250px] w-4/5 transition-opacity py-4 shadow-lg flex  items-center justify-center gap-2 bg-secondaryColor hover:opacity-80 text-white text-sm font-bold`}
            onClick={() => AddToBasket(productDetails)}
          >
            <MdAddShoppingCart size={20} />
            Ajouter au panier
          </button>

          <HoverButton
            title="Ajouter au favoris"
            icon={<FaRegHeart />}
            onClick={handleToggleFavorite}
          />

          <HoverButton
            title="Ajouter au comparatif"
            icon={
              isProductInCompare ? (
                <IoCheckmarkDoneOutline size={25} />
              ) : (
                <GoGitCompare className="font-bold" />
              )
            }
            onClick={() => addToCompare(productDetails)}
          />
        </div>
      </div>
    </div>
  );
});

export default ProductInfo;