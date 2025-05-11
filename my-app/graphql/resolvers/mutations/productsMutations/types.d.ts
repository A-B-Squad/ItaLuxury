interface Product {
  id: string;
  name: string;
  price: Float;
  isVisible: boolean;
  reference: string;
  description: string;
  inventory: number;
  images: string[];
  createdAt: Date;
  categories: categories[];
  productDiscounts: ProductDiscount[];
  baskets: Basket[];
  reviews: Review[];
  favoriteProducts: FavoriteProducts[];
  technicalDetails: string;
  Colors: {
    color
    Hex
  }
  brand: Brand
}

interface ProductInput {
  name: string;
  price: number;
  purchasePrice: number;
  isVisible: boolean;
  reference: string;
  description: string;
  inventory: number;
  images: string[];
  categories: string[];
  technicalDetails: string;
  colorsId?: string;
  discount?: ProductDiscountInput[];
  brandId?: string;
}



interface ProductDiscountInput {
  discountId: string;
  productId: string;
  dateOfStart: string;
  dateOfEnd: string;
  newPrice: Float;
}

interface AddDeleteProductToFavorite{
  userId: string;
  productId: string;
}

interface Brand {
  id: string;
  name: string;
  logo: string;
}
