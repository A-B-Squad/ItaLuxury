"use client"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { trackPurchase } from "@/utils/facebookEvents";
import { getUserIpAddress } from '@/utils/getUserIpAddress';
import { sendPurchaseNotifications } from "@/utils/sendPurchaseNotifications";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { MdLocalShipping, MdInfo } from "react-icons/md";

interface WhatsAppFormData {
  name: string;
  phone: string;
  address: string;
  governorate: string;
}

interface WhatsAppOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  productDetails: any;
  quantity: number;
  discount: any;
  isDisabled: boolean;
  decodedToken: any;
}

const DELIVERY_COST = 8;

const TUNISIAN_GOVERNORATES = [
  'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan', 'Bizerte',
  'Béja', 'Jendouba', 'Kef', 'Siliana', 'Kairouan', 'Kasserine', 'Sidi Bouzid',
  'Sousse', 'Monastir', 'Mahdia', 'Sfax', 'Gafsa', 'Tozeur', 'Kebili',
  'Gabès', 'Medenine', 'Tataouine'
];

const WhatsAppOrderForm = ({
  isOpen,
  onClose,
  productDetails,
  quantity,
  discount,
  isDisabled,
  decodedToken
}: WhatsAppOrderFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<WhatsAppFormData>({
    name: '',
    phone: '',
    address: '',
    governorate: 'Tunis'
  });
  const [errors, setErrors] = useState<Partial<WhatsAppFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: localStorage.getItem('userName') || '',
        phone: localStorage.getItem('userPhone') || '',
        address: localStorage.getItem('userAddress') || '',
        governorate: localStorage.getItem('userGovernorate') || 'Tunis'
      });
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Partial<WhatsAppFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    } else if (!/^[0-9\s\-\+\(\)]{8,}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Format de téléphone invalide (minimum 8 chiffres)';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'L\'adresse est requise';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'L\'adresse doit être plus détaillée (minimum 10 caractères)';
    }

    if (!formData.governorate) {
      newErrors.governorate = 'Le gouvernorat est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // Function to track WhatsApp purchase with IP-based cooldown
  const trackWhatsAppPurchase = async () => {
    try {
      setIsSubmitting(true);

      // Get user IP address
      const userIp = await getUserIpAddress();

      // Check if this IP has a cooldown in localStorage
      if (userIp) {
        const cooldownKey = `wa_cooldown_${userIp}_${productDetails.id}`;
        const cooldownUntil = localStorage.getItem(cooldownKey);

        if (cooldownUntil && parseInt(cooldownUntil) > Date.now()) {
          toast({
            title: "Veuillez patienter",
            description: "Vous pourrez commander à nouveau dans quelques secondes",
            className: "bg-amber-500 text-white",
          });
          return false;
        }

        // Set cooldown in localStorage with IP+product specific key
        const newCooldownUntil = Date.now() + 10000; // 10 seconds
        localStorage.setItem(cooldownKey, newCooldownUntil.toString());

        // Clean up cooldown after expiry
        setTimeout(() => {
          localStorage.removeItem(cooldownKey);
        }, 10000);
      }

      // Calculate total price with delivery
      const productPrice = discount ? discount.newPrice : productDetails.price;
      const subtotal = productPrice * quantity;
      const totalPrice = subtotal + DELIVERY_COST;

      // Generate a simple order ID for tracking
      const orderId = `WA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Track purchase with complete product data
      if (productDetails && orderId) {
        // Prepare complete cart item with ALL required fields for Facebook Catalog
        const cartItem = {
          id: productDetails.id,
          name: productDetails.name,
          slug: productDetails.slug,
          price: Number(productDetails.price),
          quantity: quantity,
          description: productDetails.description,
          Brand: productDetails.Brand,
          Colors: productDetails.Colors,
          categories: productDetails.categories,
          productDiscounts: productDetails.productDiscounts,
          inventory: productDetails.inventory,
          isVisible: productDetails.isVisible,
          reference: productDetails.reference,
          images: productDetails.images,
          technicalDetails: productDetails.technicalDetails,
        };

        // Prepare user data for WhatsApp purchase with proper name splitting
        const user = formData.name ? {
          id: decodedToken?.userId || undefined,
          email: `${formData.name.toLowerCase().replace(/\s+/g, '')}@whatsapp.com`,
          firstName: formData.name?.split(' ')[0] || formData.name,
          lastName: formData.name?.split(' ').slice(1).join(' ') || '',
          phone: formData.phone,
          country: "tn",
          city: formData.governorate || "",
        } : undefined;

        // Calculate shipping and tax
        const shippingValue = DELIVERY_COST;

        console.log('🎉 Tracking WhatsApp Purchase event:', {
          order_id: orderId,
          total_value: totalPrice,
          product_name: productDetails.name,
          quantity: quantity,
          shipping_value: shippingValue,
          user: user ? 'whatsapp_user' : 'guest',
          channel: 'whatsapp'
        });

        // Track the WhatsApp purchase
        try {
          await trackPurchase(
            orderId,
            [cartItem],
            totalPrice,
            user,
            shippingValue,
          );

          await sendPurchaseNotifications(
            orderId,
            cartItem.quantity,
            formData.name,
            totalPrice
          );
          console.log('✅ WhatsApp Purchase event tracked successfully');
        } catch (error) {
          console.error("❌ Error tracking WhatsApp purchase:", error);
          // Don't block the WhatsApp flow if tracking fails
        }
      }

      return true;
    } catch (error) {
      console.error('Error in WhatsApp purchase tracking:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        className: "bg-red-500 text-white",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };


  // Get WhatsApp URL with form data
  const getWhatsAppUrl = (formData: WhatsAppFormData) => {
    const productPrice = discount ? discount.newPrice : productDetails?.price;
    const subtotal = productPrice * quantity;
    const totalPrice = subtotal + DELIVERY_COST;

    const message = `🛍️ *NOUVELLE COMMANDE WHATSAPP*

📦 *Détails du Produit:*
• Produit: ${productDetails?.name}
• Prix unitaire: ${productPrice?.toFixed(3)} TND
• Quantité: ${quantity}
• Sous-total: ${subtotal?.toFixed(3)} TND

🚚 *Livraison:*
• Frais de livraison: ${DELIVERY_COST.toFixed(3)} TND
• Gouvernorat: ${formData.governorate}

💵 *TOTAL: ${totalPrice?.toFixed(3)} TND*

👤 *Informations Client:*
• Nom: ${formData.name}
• Téléphone: ${formData.phone}
• Adresse: ${formData.address}
• Gouvernorat: ${formData.governorate}

🔗 *Lien produit:* ${typeof window !== 'undefined' ? window.location.href : ''}

✅ Commande confirmée et prête pour traitement !
Merci pour votre confiance ! 🙏`;

    return `https://wa.me/+21623212892?text=${encodeURIComponent(message)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const success = await trackWhatsAppPurchase();

    if (success) {
      // Save data to localStorage for future use
      localStorage.setItem('userName', formData.name);
      localStorage.setItem('userPhone', formData.phone);
      localStorage.setItem('userAddress', formData.address);
      localStorage.setItem('userGovernorate', formData.governorate);

      // Show success toast
      toast({
        title: "Commande initiée",
        description: "Redirection vers WhatsApp...",
        className: "bg-green-500 text-white",
      });

      // Redirect to WhatsApp
      if (typeof window !== 'undefined') {
        window.location.href = getWhatsAppUrl(formData);
      }

      onClose();
    }
  };

  const handleInputChange = (field: keyof WhatsAppFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const productPrice = discount ? discount.newPrice : productDetails?.price;
  const subtotal = productPrice * quantity;
  const totalPrice = subtotal + DELIVERY_COST;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] z-[9999] bg-white max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-xl font-bold flex items-center text-[#25D366] border-b border-gray-200 pb-3">
          <FaWhatsapp className="mr-2" size={24} />
          Commander via WhatsApp
        </DialogTitle>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-gray-800 text-lg">{productDetails?.name}</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Prix unitaire:</span>
                <span className="font-medium">{productPrice?.toFixed(3)} TND</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantité:</span>
                <span className="font-medium">{quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total:</span>
                <span className="font-medium">{subtotal?.toFixed(3)} TND</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-gray-200">
                <span className="text-gray-600 flex items-center gap-1">
                  <MdLocalShipping className="text-blue-500" />
                  Livraison:
                </span>
                <span className="font-medium text-blue-600">{DELIVERY_COST.toFixed(3)} TND</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                <span className="font-bold text-lg text-gray-800">TOTAL:</span>
                <span className="font-bold text-xl text-[#25D366]">{totalPrice?.toFixed(3)} TND</span>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-md flex items-start gap-2">
              <MdInfo className="text-blue-500 mt-0.5 flex-shrink-0" size={16} />
              <p className="text-blue-700 text-xs">
                Les frais de livraison sont fixes à {DELIVERY_COST} TND pour toute la Tunisie.
                Livraison sous 24-48h ouvrables.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25D366] focus:border-[#25D366] ${errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Votre nom complet"
                disabled={isDisabled || isSubmitting}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de téléphone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25D366] focus:border-[#25D366] ${errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Ex: +216 XX XXX XXX"
                disabled={isDisabled || isSubmitting}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gouvernorat *
              </label>
              <select
                value={formData.governorate}
                onChange={(e) => handleInputChange('governorate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25D366] focus:border-[#25D366] ${errors.governorate ? 'border-red-500' : 'border-gray-300'
                  }`}
                disabled={isDisabled || isSubmitting}
              >
                {TUNISIAN_GOVERNORATES.map((gov) => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
              {errors.governorate && <p className="text-red-500 text-sm mt-1">{errors.governorate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse de livraison complète *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#25D366] focus:border-[#25D366] resize-none ${errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Adresse complète avec détails (rue, avenue, immeuble, étage, etc.)"
                disabled={isDisabled || isSubmitting}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              disabled={isDisabled || isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isDisabled || isSubmitting}
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center gap-2 ${isDisabled || isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#25D366] hover:bg-[#20BA5A] shadow-md hover:shadow-lg'
                }`}
            >
              <FaWhatsapp size={18} />
              {isSubmitting ? 'Traitement...' : 'Commander'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppOrderForm;