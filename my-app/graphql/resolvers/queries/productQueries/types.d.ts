interface ProductSearchInput {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string | null;
  colorId?: string | null;
  choice?: string | null;
  brandId?: string | null;
  page?: number 
  pageSize?: number ;


}
