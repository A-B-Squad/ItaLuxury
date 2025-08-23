// Helper function example
const sendWhatsAppMessage = (phoneNumber: string, message: string | number | boolean) => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  
