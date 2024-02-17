interface Product {
  id: number;
  name: string;
  price: number;
  isVisible: boolean;
  reference: string;
  description?: string | null;
  inventory?: number | null;
  images: string[];
  createdAt: Date;
  categories: Category[];
  productDiscounts: ProductDiscount[];
  baskets: Basket[];
  reviews: Review[];
  favoriteProducts: FavoriteProducts[];
  variants: Variant[];
  attributes: ProductAttribute[];
  colorsId?: number | null;
}

interface ProductInput {
  name: string;
  price: number;
  isVisible: boolean;
  reference: string;
  description?: string | null;
  inventory?: number | null;
  images: string[];
  createdAt: Date;
  categoryIds: number[];
  productDiscountIds: number[];
  variantInputs: VariantInput[];
  attributeInputs: ProductAttributeInput[];
  colorsId?: number | null;
}

interface ProductUpdateInput {
  name?: string;
  price?: number;
  isVisible?: boolean;
  reference?: string;
  description?: string | null;
  inventory?: number | null;
  images?: string[];
  createdAt?: Date;
  categoryIds?: number[];
  productDiscountIds?: number[];
  variantInputs?: VariantInput[];
  attributeInputs?: ProductAttributeInput[];
  colorsId?: number | null;
}

interface VariantInput {
  name: string;
}

interface ProductAttributeInput {
  name: string;
  value: string;
}

interface ProductDiscountInput {
  discountPercentage: number;
  startDate: Date;
  endDate: Date;
}

interface ProductDiscountUpdateInput {
  discountPercentage?: number;
  startDate?: Date;
  endDate?: Date;
}
