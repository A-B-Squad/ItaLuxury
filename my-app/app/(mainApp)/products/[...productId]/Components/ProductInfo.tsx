"use client"
import HoverButton from '@/app/components/HoverButton';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { GET_REVIEW_QUERY } from '@/graphql/queries';
import { useAuth } from '@/lib/auth/useAuth';
import { getUserIpAddress } from '@/utlils/getUserIpAddress';
import triggerEvents from '@/utlils/trackEvents';
import { useLazyQuery } from '@apollo/client';
import { sendGTMEvent } from '@next/third-parties/google';
import { memo, useEffect, useMemo, useState } from "react";
import { FaBolt, FaPlus, FaRegHeart, FaRegStar, FaShareAlt, FaStar, FaStarHalfAlt, FaWhatsapp } from "react-icons/fa";
import { GoAlertFill, GoGitCompare } from "react-icons/go";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { MdAddShoppingCart, MdOutlineInfo } from "react-icons/md";
import { RiSubtractFill } from "react-icons/ri";
import DiscountCountDown from "./DiscountCountDown";
import OrderNow from "./OrderNow/OrderNowForm";
import ProductAttrMobile from "./ProductAttrMobile";

interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  productId: string;
  createdAt: string;
}

interface RatingCounts {
  one: number;
  two: number;
  three: number;
  four: number;
  five: number;
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
  addToCompare
}: any) => {
  const { toast } = useToast();
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [getReviews] = useLazyQuery(GET_REVIEW_QUERY);
  const [reviews, setReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const { decodedToken } = useAuth();
  const [whatsappButtonDisabled, setWhatsappButtonDisabled] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  useEffect(() => {
    setLastUpdate(Date.now());
  }, [productDetails?.price, productDetails?.productDiscounts]);

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


  // Function to track WhatsApp purchase
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

  // Function to track WhatsApp purchase with IP-based cooldown
  const trackWhatsAppPurchase = async () => {
    try {
      // Disable button immediately
      setWhatsappButtonDisabled(true);

      // Get user IP address
      const userIp = await getUserIpAddress();

      // Check if this IP has a cooldown in localStorage
      if (userIp) {
        const cooldownKey = `wa_cooldown_${userIp}_${productDetails.id}`;
        const cooldownUntil = localStorage.getItem(cooldownKey);

        if (cooldownUntil && parseInt(cooldownUntil) > Date.now()) {
          // IP is in cooldown period
          toast({
            title: "Veuillez patienter",
            description: "Vous pourrez commander à nouveau dans quelques secondes",
            className: "bg-amber-500 text-white",
          });

          // Keep button disabled for remaining time
          const timeRemaining = parseInt(cooldownUntil) - Date.now();
          setTimeout(() => {
            setWhatsappButtonDisabled(false);
          }, timeRemaining);

          return false; // Exit early - don't process the order
        }

        // Set cooldown in localStorage with IP+product specific key
        const newCooldownUntil = Date.now() + 10000; // 10 seconds
        localStorage.setItem(cooldownKey, newCooldownUntil.toString());

        // Set timeout to re-enable button
        setTimeout(() => {
          setWhatsappButtonDisabled(false);
          localStorage.removeItem(cooldownKey);
        }, 10000);
      } else {
        // If IP can't be determined, allow the order but still disable button briefly
        setTimeout(() => setWhatsappButtonDisabled(false), 3000);
      }

      // Get user data from localStorage or use default values
      const userName = localStorage.getItem('userName') || 'Unknown';
      const userEmail = localStorage.getItem('userEmail') || 'unknown@example.com';
      const userPhone = localStorage.getItem('userPhone') || '';
      const governorate = localStorage.getItem('userGovernorate') || 'Tunis';

      // Calculate total price
      const totalPrice = discount ? discount.newPrice : productDetails.price;

      // Generate a simple order ID for tracking
      const orderId = `WA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Track purchase event for Facebook Pixel
      triggerEvents("Purchase", {
        user_data: {
          em: [userEmail.toLowerCase()],
          fn: [userName],
          ph: [userPhone],
          country: ["tn"],
          ct: governorate,
          external_id: decodedToken?.userId,
        },
        custom_data: {
          content_name: "WhatsAppOrder",
          content_type: "product_group",
          content_category: "Checkout",
          currency: "TND",
          value: parseFloat(totalPrice),
          contents: [{
            id: productDetails.id,
            quantity: quantity
          }],
          num_items: quantity,
        },
      });

      // Track purchase event for Google Tag Manager
      sendGTMEvent({
        event: "purchase",
        ecommerce: {
          currency: "TND",
          value: parseFloat(totalPrice),
          items: [
            { id: productDetails.id, quantity: quantity }
          ],
          transaction_id: orderId,
        },
        user_data: {
          em: [userEmail.toLowerCase()],
          fn: [userName],
          ph: [userPhone],
          country: ["tn"],
          ct: governorate,
          external_id: decodedToken?.userId
        },
        facebook_data: {
          content_name: "WhatsAppOrder",
          content_type: "product_group",
          content_category: "Checkout",
          currency: "TND",
          value: parseFloat(totalPrice),
          contents: [{
            id: productDetails.id,
            quantity: quantity
          }],
          num_items: quantity,
        }
      });

      // Show success toast
      toast({
        title: "Commande initiée",
        description: "Votre commande WhatsApp a été enregistrée",
        className: "bg-green-500 text-white",
      });

      return true; // Return true to indicate success
    } catch (error) {
      console.error('Error in WhatsApp purchase tracking:', error);
      setWhatsappButtonDisabled(false);
      return false; // Return false to indicate failure
    }
  };

  // Get WhatsApp URL
  const getWhatsAppUrl = () => {
    if (typeof window !== 'undefined') {
      return `https://wa.me/+21623212892?text=Je veux commander cet article: ${productDetails?.name} - ${window.location.href}`;
    }
    return `https://wa.me/+21623212892?text=Je veux commander cet article: ${productDetails?.name}`;
  };

  // Handle WhatsApp button click
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior

    if (whatsappButtonDisabled) {
      toast({
        title: "Veuillez patienter",
        description: "Vous pourrez commander à nouveau dans quelques secondes",
        className: "bg-amber-500 text-white",
      });
      return;
    }

    const success = await trackWhatsAppPurchase();

    if (success && typeof window !== 'undefined') {
      // For iOS, we need to use window.location.href instead of window.open
      // This is more reliable on mobile Safari
      window.location.href = getWhatsAppUrl();
    }
  };

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
      <div className="flex flex-col justify-betwee border-b border-gray-200 pb-2">
        <h2 className="product_name tracking-wide text-lg w-fit font-semibold text-gray-800">
          {productDetails?.name}
        </h2>

        {/* Star Rating Display - only show if there are reviews */}
        {reviews > 0 && (
          <div className="mt-1 mb-2">
            <StarRating rating={averageRating} reviewCount={reviews} />
          </div>
        )}

        {/* Product action buttons at top */}
        <div className="flex items-center gap-2">
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

        <div className="Description mt-8">
          <div className="flex items-center justify-between ">
            <h3 className="text-xl md:text-2xl font-semibold text-slate-800 capitalize border-b-2 border-slate-200  tracking-wide">
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
            className="product-description text-base md:text-lg text-slate-700 tracking-wide py-3 md:py-6 leading-loose md:leading-relaxed max-w-none"
            style={{
              fontSize: '16px',
              lineHeight: '1.8',
              fontWeight: '400',
              letterSpacing: '0.025em'
            }}
            dangerouslySetInnerHTML={productDescription}
          />
        </div>
      </div>

      <div className="user_interaction flex flex-col gap- mt-6 border-t border-gray-200 pt-4">
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


        {/* WhatsApp Order Button at the top */}
        <div className="lg:hidden whatsapp-order mt-4 mb-2">
          <a
            href={getWhatsAppUrl()}
            onClick={handleClick}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-base transition-all duration-200 shadow-sm ${whatsappButtonDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none border border-gray-200"
              : "bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
          >
            <FaWhatsapp size={20} />
            {whatsappButtonDisabled ? "Patientez..." : "Commander via WhatsApp"}
          </a>
        </div>


        <div className="lg:hidden action-buttons bg-white flex flex-col gap-3 mt-2">
          <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                disabled={isOutOfStock}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${isOutOfStock
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  }`}
              >
                {!isOutOfStock && <FaBolt size={18} />}
                {isOutOfStock ? "Indisponible" : "Acheter Rapidement"}
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] bg-white overflow-y-auto">
              <OrderNow
                ActualQuantity={quantity}
                productDetails={productDetails}
              />
            </DialogContent>
          </Dialog>

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
        </div>

        <ProductAttrMobile technicalDetails={technicalDetails} />
      </div>
    </div>
  );
});

export default ProductInfo;