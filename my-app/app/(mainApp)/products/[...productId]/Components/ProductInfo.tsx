"use client"
import HoverButton from '@/app/components/HoverButton';
import { useAuth } from '@/app/hooks/useAuth';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { GET_REVIEW_QUERY } from '@/graphql/queries';
import { getUserIpAddress } from '@/utlils/getUserIpAddress';
import { useLazyQuery } from '@apollo/client';
import { memo, useEffect, useMemo, useState } from "react";
import { FaBolt, FaPlus, FaRegHeart, FaRegStar, FaShareAlt, FaStar, FaStarHalfAlt, FaWhatsapp } from "react-icons/fa";
import { GoAlertFill, GoGitCompare } from "react-icons/go";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { MdAddShoppingCart } from "react-icons/md";
import { RiSubtractFill } from "react-icons/ri";
import DiscountCountDown from "./DiscountCountDown";
import OrderNowForm from './Order/OrderNow/OrderNowForm';
import ProductAttrMobile from "./ProductAttrMobile";
import { GiShoppingBag } from 'react-icons/gi';
import ColorVariants from './ColorVariants';
import WhatsAppOrderForm from './Order/WhatsAppOrder/OrderNow/WhatsAppOrderForm ';
interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  productId: string;
  createdAt: string;
}

// Star rating component with proper typing
const StarRating = ({ rating, reviewCount }: { rating: number; reviewCount: number }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      <span className="text-sm text-gray-500">({reviewCount})</span>
    </div>
  );
};

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
  addToCompare,
  userData,
  companyData
}: any) => {
  const { toast } = useToast();
  const [getReviews] = useLazyQuery(GET_REVIEW_QUERY);
  const [reviews, setReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const { decodedToken } = useAuth();
  const [whatsappButtonDisabled, setWhatsappButtonDisabled] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isWhatsAppFormOpen, setIsWhatsAppFormOpen] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await getReviews({
          variables: { productId: productDetails.id }
        });

        if (data?.productReview) {
          const totalReviews = data.productReview.length;
          setReviews(totalReviews);

          // Calculate average rating
          const totalRating = data.productReview.reduce((sum: number, review: Review) => sum + review.rating, 0);
          const avgRating = totalReviews > 0 ? totalRating / totalReviews : 0;
          setAverageRating(avgRating);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (productDetails?.id) {
      fetchReviews();
    }
  }, [getReviews, productDetails?.id]);

  // Check IP-based cooldown on component mount
  useEffect(() => {
    const checkWhatsAppCooldown = async () => {
      if (!productDetails?.id) return;

      try {
        const userIp = await getUserIpAddress();
        if (!userIp) return;

        const cooldownKey = `wa_cooldown_${userIp}_${productDetails.id}`;
        const cooldownUntil = localStorage.getItem(cooldownKey);

        if (cooldownUntil && parseInt(cooldownUntil) > Date.now()) {
          setWhatsappButtonDisabled(true);

          // Set timeout to re-enable the button when cooldown expires
          const timeRemaining = parseInt(cooldownUntil) - Date.now();
          setTimeout(() => {
            setWhatsappButtonDisabled(false);
          }, timeRemaining);
        }
      } catch (error) {
        console.error('Error checking WhatsApp cooldown:', error);
      }
    };

    checkWhatsAppCooldown();
  }, [productDetails?.id]);

  // Handle WhatsApp button click
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (whatsappButtonDisabled) {
      toast({
        title: "Veuillez patienter",
        description: "Vous pourrez commander à nouveau dans quelques secondes",
        className: "bg-amber-500 text-white",
      });
      return;
    }

    setIsWhatsAppFormOpen(true);
  };

  const formattedPrice = useMemo(() =>
    productDetails?.price?.toFixed(3),
    [productDetails?.price, productDetails?.productDiscounts]
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
    <div className="productInfo relative grid- w-full  p-3 md:p-5 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col  border-b border-gray-200 pb-2">
        <div className="product-header ">
          <h1 className="product_name text-2xl  font-bold text-gray-900 leading-tight tracking-tight mb-2">
            {productDetails?.name}
          </h1>

          {productDetails?.reference && (
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">
              SKU: {productDetails.reference}
            </p>
          )}
        </div>

        {/* Star Rating Display - only show if there are reviews */}
        {reviews > 0 && (
          <div className="mt-1 mb-2">
            <StarRating rating={averageRating} reviewCount={reviews} />
          </div>
        )}

        {/* Product action buttons at top */}
        <div className="flex md:hidden items-center gap-2">
          <HoverButton
            title="Partager le produit"
            icon={<FaShareAlt />}
            onClick={handleShare}
            className="h-9 w-9 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 border border-gray-200 hover:border-blue-200 transition-all duration-200"
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
            className={`h-9 w-9 flex items-center justify-center rounded-lg border transition-all duration-200 ${isProductInCompare
              ? "bg-green-50 text-green-600 border-green-200 cursor-default"
              : "bg-gray-50 hover:bg-purple-50 text-gray-600 hover:text-purple-600 border-gray-200 hover:border-purple-200"
              }`}
          />

          <HoverButton
            title="Ajouter aux favoris"
            icon={<FaRegHeart />}
            onClick={handleToggleFavorite}
            className="h-9 w-9 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-500 border border-gray-200 hover:border-red-200 transition-all duration-200"
          />
        </div>
      </div>

      <div className="prices discount flex flex-col gap-3 mt-4">
        <div className="flex items-center w-max gap-3">
          {discount ? (
            <>
              <span className="text-2xl font-bold text-red-600">
                {discount.newPrice.toFixed(3)} TND
              </span>
              <span className="text-lg text-gray-400 line-through">
                {formattedPrice} TND
              </span>
              <span className="bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded">
                -{Math.round((1 - discount.newPrice / productDetails.price) * 100)}%
              </span>
            </>
          ) : (
            <>
              <span className="text-2xl font-bold text-gray-900">
                {formattedPrice} TND
              </span>
              <span className="text-sm text-gray-500">TTC</span>
            </>
          )}
        </div>

        {discount && <DiscountCountDown discount={discount} />}
      </div>

      <div className="Infomation_Details ">
        <ColorVariants
          slug={productDetails?.slug}
          currentProductId={productDetails?.id}
          groupProductVariant={productDetails?.GroupProductVariant}
          currentColors={productDetails?.Colors}
        />
        <div className="Description">
          <div
            className="product-description text-base md:text-lg text-slate-700 tracking-wide leading-relaxed max-w-none"
            style={{
              fontSize: '14px',
              lineHeight: '1.8',
              fontWeight: '400',
              letterSpacing: '0.025em'
            }}
            dangerouslySetInnerHTML={productDescription}
          />
        </div>
      </div>

      <div className="user_interaction flex flex-col  gap-2 mt-1   pt-1">
        {isMaxQuantity && (
          <div className="flex items-center text-sm gap-3 bg-red-50 border border-red-200 p-3 rounded-lg">
            <GoAlertFill color="#DC2626" size={20} />
            <p className="text-red-700 font-medium tracking-wide">
              La quantité maximale de produits est de {quantity}.
            </p>
          </div>
        )}

        {isLowStock && (
          <div className="flex text-sm items-center gap-3 bg-amber-50 border border-amber-200 p-3 rounded-lg">
            <HiOutlineBellAlert color="#F59E0B" size={20} />
            <p className="text-amber-700 font-medium tracking-wide">
              Attention: Il ne reste qu'un 1 article en stock.
            </p>
          </div>
        )}

        <div className="Quantity flex lg:hidden items-center mt-3 space-x-2">
          <h3 className="tracking-wider font-medium text-base capitalize text-gray-700">
            Quantité:{" "}
          </h3>

          <div className="flex items-center gap-0 overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <HoverButton
              title="Diminuer la quantité"
              icon={<RiSubtractFill size={18} />}
              onClick={handleDecreaseQuantity}
              disabled={quantity === 1 || isOutOfStock}
              className={`h-10 w-10 flex items-center justify-center transition-all duration-200 rounded-none ${quantity === 1 || isOutOfStock
                ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                : "bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800"
                }`}
            />
            <div className="bg-white px-4 py-2 h-10 flex items-center justify-center font-semibold text-gray-800 text-md border-x border-gray-200 min-w-[40px]">
              {quantity}
            </div>
            <HoverButton
              title="Augmenter la quantité"
              icon={<FaPlus size={14} />}
              onClick={handleIncreaseQuantity}
              disabled={isMaxQuantity || isOutOfStock}
              className={`h-10 w-10 flex items-center justify-center transition-all duration-200 rounded-none ${isMaxQuantity || isOutOfStock
                ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                : "bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800"
                }`}
            />
          </div>
        </div>

        <div className="lg:hidden action-buttons w-full bg-white flex flex-col gap-3 mt-2">
          <button
            type="button"
            disabled={isOutOfStock}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
              : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            onClick={() => !isOutOfStock && AddToBasket(productDetails)}
          >
            <MdAddShoppingCart size={20} />
            {isOutOfStock ? "Indisponible" : "Ajouter au panier"}
          </button>

          <Dialog
            open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={() => !isOutOfStock && AddToBasket(productDetails)}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${isOutOfStock
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  : "bg-gradient-to-r from-primaryColor to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  }`}
              >
                {!isOutOfStock && <FaBolt size={18} />}
                {isOutOfStock ? "Indisponible" : "Acheter Rapidement"}
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] z-[9999] max-h-[90vh] bg-white overflow-y-auto">
              <DialogTitle className="p-4 text-xl font-bold flex items-center border-primaryColor border-b-2  ">
                <GiShoppingBag className="mr-2" /> Acheter maintenant
              </DialogTitle>
              <OrderNowForm
                ActualQuantity={quantity}
                productDetails={productDetails}
                userData={userData}
                companyData={companyData}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* WhatsApp Order Button */}
        <div className="lg:hidden whatsapp-order mt-4 mb-2">
          <button
            onClick={handleWhatsAppClick}
            disabled={isOutOfStock || whatsappButtonDisabled}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-base transition-all duration-200 shadow-sm ${whatsappButtonDisabled || isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
              : "bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
          >
            <FaWhatsapp size={20} />
            {whatsappButtonDisabled ? "Patientez..." : isOutOfStock ? "Indisponible" : "Commander via WhatsApp"}
          </button>
        </div>

        {/* WhatsApp Order Form - Using the separated component */}
        <WhatsAppOrderForm
          isOpen={isWhatsAppFormOpen}
          onClose={() => setIsWhatsAppFormOpen(false)}
          productDetails={productDetails}
          quantity={quantity}
          discount={discount}
          isDisabled={whatsappButtonDisabled}
          decodedToken={decodedToken}
        />

        <ProductAttrMobile technicalDetails={technicalDetails} />
      </div>
    </div>
  );
}
  , (prevProps, nextProps) => {

    return (
      prevProps.productDetails?.id === nextProps.productDetails?.id &&
      prevProps.productDetails?.price === nextProps.productDetails?.price &&
      prevProps.productDetails?.inventory === nextProps.productDetails?.inventory &&
      prevProps.productDetails?.description === nextProps.productDetails?.description &&
      prevProps.productDetails?.name === nextProps.productDetails?.name &&
      prevProps.technicalDetails === nextProps.technicalDetails &&
      prevProps.discount?.newPrice === nextProps.discount?.newPrice &&
      prevProps.quantity === nextProps.quantity
    );
  },
);

export default ProductInfo;