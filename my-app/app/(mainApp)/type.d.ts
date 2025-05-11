interface SellsData {
  getBestSales: any;
  getBestSales: any;
  product: ProductInfo;
  category: CategoryInfo;
}

interface ProductQuickView {
  id: string;
  name: string;
  price: number;
  inventory: number;
  createdAt: string;
  isVisible: boolean;
  reference: string;
  description: string;
  images: string[];
  categories: CategoryInfo[];
  discounts: DiscountInfo[];
  baskets: BasketInfo[];
  reviews: ReviewInfo[];
  favoriteProducts: FavoriteProductInfo[];
  technicalDetails: string;
  colors: ColorInfo[];
  brand: BrandInfo;
}

interface ColorInfo {
  id: string;
  name: string;
  hex: string;
}

interface CategoryInfo {
  id: string;
  name: string;
  subcategories: CategoryInfo[];
}

interface DiscountInfo {
  newPrice: number;
  oldPrice: number;
}


interface BasketInfo {
  id: string;
  name: string;
  price: number;
  images: string[];
  basketId: string;
  actualQuantity: number;
  categories: CategoryInfo[];
}



interface ProductInput {
  name: string;
  price: number;
  isVisible: boolean;
  reference: string;
  description: string;
  inventory: number;
  images: string[];
  categories: string[];
  technicalDetails: string;
  colorsId?: string;
  discounts?: ProductDiscountInput[];
  brandId?: string;
}

interface ProductDiscountInput {
  productId: string;
  dateOfStart: string;
  dateOfEnd: string;
  newPrice: number;
}

interface FavoriteProductInput {
  userId: string;
  productId: string;
}

interface TopDealProductInput {
  productId: string;
}

interface BrandInfo {
  id: string;
  name: string;
  logo: string;
}
