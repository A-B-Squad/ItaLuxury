interface Product {
  id: string;
  name: string;
  price: Float;
  isVisible: boolean;
  reference: string;
  description: string;
  inventory: number;
  images: string[];
  createdAt: string;
  categories: Category[];
  productDiscounts: ProductDiscount[];
  baskets: Basket[];
  reviews: Review[];
  favoriteProducts: FavoriteProducts[];
  attributes: ProductAttribute[];
  colorsId?: string | undefined;
}

interface ProductInput {
  name: string;
  price: Float;
  isVisible: boolean;
  reference: string;
  description: string;
  inventory: number;
  images: string[];
  categories: string[];
  attributeInputs: ProductAttributeInput[];
  colorsId?: string | undefined;
  discount?: ProductDiscountInput[];
}

interface ProductAttributeInput {
  name: string;
  value: string;
}

interface ProductDiscountInput {
  discountId: string;
  productId: string;
  dateOfStart: string;
  dateOfEnd: string;
  newPrice: Float;
}

interface AddProductToFavoriteInput {
  userId: string;
  productId: string;
}
