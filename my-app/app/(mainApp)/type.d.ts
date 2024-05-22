interface SellsData {
  getBestSales: any;
  getBestSales: any;
  product: ProductInfo;
  category: CategoryInfo;
}

interface ProductInfo {
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
  attributes: ProductAttribute[];
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
  discount: Discount;
}

interface Discount {
  id: string;
  description: string;
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

interface ProductAttribute {
  name: string;
  value: string;
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
  attributes: ProductAttribute[];
  colorsId?: string;
  discounts?: ProductDiscountInput[];
  brandId?: string;
}

interface ProductDiscountInput {
  discountId: string;
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
