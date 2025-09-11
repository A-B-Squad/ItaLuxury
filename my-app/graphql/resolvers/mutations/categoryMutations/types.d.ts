import { PaymentMethod } from "@prisma/client";

interface CreateCategoryInput {
  name: string;
  parentId: string;
  bigImage: string;
  smallImage: string;
  description: string;
}
interface UpdateCategoryInput {
  name: string;
  parentId: string;
  bigImage: string;
  smallImage: string;
  description: string;
}

interface CreateCheckoutInput {
  userId?: string;
  userName: string;
  phone: string[];
  governorateId: string;
  address: string;
  guestEmail?: string;
  productIds: any;
  total: number;
  couponsId: string | null;
  freeDelivery: boolean;
  isGuest: boolean;
  deliveryComment?: string;
  products?: any[];
  paymentMethod: PaymentMethod;
}
interface CreateCheckoutFromAdminInput {
  userId: string;
  userName: string;
  phone: string[];
  governorateId: string;
  address: string;
  total: number;
  products: [];
  manualDiscount: number;
  freeDelivery: boolean;
  paymentMethod: PaymentMethod;
}

interface CreateCategoryInput {
  name: string;
  parentId: string;
  bigImage: string;
  smallImage: string;
  description: string;
}
