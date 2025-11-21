import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ProductData } from "../types";

type useDrawerMobileSideBar = {
  isOpen: boolean;
  openDrawerMobileSideBar: () => void;
  closeDrawerMobileSideBar: () => void;
};
type DrawerMobileCategoryStore = {
  isOpen: boolean;
  openCategoryDrawer: () => void;
  closeCategoryDrawer: () => void;
};

type DrawerBasketStore = {
  isOpen: boolean;
  openBasketDrawer: () => void;
  closeBasketDrawer: () => void;
};
type DrawerMobileSearch = {
  isOpen: boolean;
  openDrawerMobileSearch: () => void;
  closeDrawerMobileSearch: () => void;
};

type BasketStore = {
  isUpdated: boolean;
  toggleIsUpdated: () => void;
};

interface ProductDetailsData {
  id: string;
  name: string;
  slug: string;
  price: number;
  isVisible: boolean;
  images: string[];
  reference: string;
  description: string;
  inventory: number;
  productDiscounts: {
    id: string
    newPrice: number;
    price: number;
    dateOfStart: string;
    dateOfEnd: string;
  }[];
  Colors: {
    color: string;
    Hex: string;
  };
  Brand: Brand;
  categories: {
    name: string;
    id: string;
    subcategories: {
      name: string;
      id: string;
      subcategories: {
        name: string;
        id: string;
      }[];
    }[];
  }[];
  [key: string]: any;
}

interface CheckoutState {
  checkoutProducts: ProductDetailsData[];
  checkoutTotal: number;
  setCheckoutProducts: (products: any) => void;
  setCheckoutTotal: (total: number) => void;
  clearCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      checkoutProducts: [],
      checkoutTotal: 0,
      setCheckoutProducts: (products) => set({ checkoutProducts: products }),
      setCheckoutTotal: (total) => set({ checkoutTotal: total }),
      clearCheckout: () => set({ checkoutProducts: [], checkoutTotal: 0 }),
    }),
    {
      name: "checkout-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

type UseProductDetails = {
  isOpen: boolean;
  productData: ProductDetailsData | any;
  openProductDetails: (productData: ProductDetailsData) => void;
  closeProductDetails: () => void;
};

export const useProductDetails = create<UseProductDetails>((set) => ({
  isOpen: false,
  productData: null,
  openProductDetails: (productData) => set({ isOpen: true, productData }),
  closeProductDetails: () => set({ isOpen: false, productData: null }),
}));

type UsePruchaseOptions = {
  isOpen: boolean;
  productData: ProductDetailsData | any;
  openPruchaseOptions: (productData: ProductDetailsData) => void;
  closePruchaseOptions: () => void;
};

export const usePruchaseOptions = create<UsePruchaseOptions>((set) => ({
  isOpen: false,
  productData: null,
  openPruchaseOptions: (productData) => set({ isOpen: true, productData }),
  closePruchaseOptions: () => set({ isOpen: false, productData: null }),
}));

export const useDrawerMobileSideBar = create<useDrawerMobileSideBar>(
  (set) => ({
    isOpen: false,
    openDrawerMobileSideBar: () => set({ isOpen: true }),
    closeDrawerMobileSideBar: () => set({ isOpen: false }),
  })
);

export const useDrawerBasketStore = create<DrawerBasketStore>((set) => ({
  isOpen: false,
  openBasketDrawer: () => set({ isOpen: true }),
  closeBasketDrawer: () => set({ isOpen: false }),
}));

export const useDrawerMobileSearch = create<DrawerMobileSearch>((set) => ({
  isOpen: false,
  openDrawerMobileSearch: () => set({ isOpen: true }),
  closeDrawerMobileSearch: () => set({ isOpen: false }),
}));
export const useDrawerMobileCategory = create<DrawerMobileCategoryStore>((set) => ({
  isOpen: false,
  openCategoryDrawer: () => set({ isOpen: true }),
  closeCategoryDrawer: () => set({ isOpen: false }),
}));

export const useBasketStore = create<BasketStore>((set) => ({
  isUpdated: false,
  toggleIsUpdated: () => set((state) => ({ isUpdated: !state.isUpdated })),
}));



type State = {
  products: ProductData[];
  quantityInBasket: number;
};

type Actions = {
  setQuantityInBasket: (quantity: number) => void;
  addProductToBasket: (product: ProductData) => void;
  addMultipleProducts: (product: ProductData[]) => void;
  removeProductFromBasket: (productId: string) => void;
  increaseProductInQtBasket: (productId: string, quantity: number) => void;
  decreaseProductInQtBasket: (productId: string) => void;
  clearBasket: () => void;
};

type ProductsInBasketStore = State & Actions;

export const useProductsInBasketStore = create<ProductsInBasketStore>()(
  persist(
    (set) => ({
      products: [],
      quantityInBasket: 0,

      setQuantityInBasket: (quantity: number) => {
        set(() => ({
          quantityInBasket: quantity,
        }));
      },

      addProductToBasket: (product: ProductData) => {
        set((state) => ({
          products: [...state.products, product],
          quantityInBasket: state.products.length + 1,
        }));
      },

      addMultipleProducts: (products: ProductData[]) => {
        set(() => ({
          products: products,
        }));
      },

      increaseProductInQtBasket: (productId: string, quantity: number) => {
        set((state) => {
          const updatedProducts = state.products.map((product) =>
            product.id === productId
              ? {
                ...product,
                actualQuantity: (product.actualQuantity || 0) + quantity,
              }
              : product
          );

          const updatedQuantityInBasket = updatedProducts.reduce(
            (sum, product) => sum + (product.actualQuantity || 0),
            0
          );

          return {
            products: updatedProducts,
            quantityInBasket: updatedQuantityInBasket,
          };
        });
      },

      decreaseProductInQtBasket: (productId: string) => {
        set((state) => {
          const updatedProducts = state.products
            .map((product) =>
              product.id === productId && (product.actualQuantity || 0) > 0
                ? {
                  ...product,
                  actualQuantity: (product.actualQuantity || 0) - 1,
                }
                : product
            )
            .filter((product) => (product.actualQuantity || 0) > 0);

          const updatedQuantityInBasket = updatedProducts.reduce(
            (sum, product) => sum + (product.actualQuantity || 0),
            0
          );

          return {
            products: updatedProducts,
            quantityInBasket: updatedQuantityInBasket,
          };
        });
      },

      removeProductFromBasket: (productId: string) => {
        set((state) => {
          const updatedProducts = state.products.filter(
            (product) => product.id !== productId
          );

          const updatedQuantityInBasket = updatedProducts.reduce(
            (sum, product) => sum + (product.actualQuantity || 0),
            0
          );

          return {
            products: updatedProducts,
            quantityInBasket: updatedQuantityInBasket,
          };
        });
      },

      clearBasket: () => {
        set(() => ({
          products: [],
          quantityInBasket: 0,
        }));
      },
    }),
    {
      name: "products-in-basket",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

interface ProductComparisonState {
  comparisonList: Product[];
  addToComparison: (product: Product) => void;
  removeFromComparison: (productId: string | number) => void;
}


export const useProductComparisonStore = create<ProductComparisonState>()(
  persist(
    (set, get) => ({
      comparisonList: [],
      addToComparison: (productToCompare) => {
        const currentItems = get().comparisonList;

        set(() => ({
          comparisonList: [...currentItems, productToCompare]
        }));
      },
      removeFromComparison: (productId) =>
        set((state) => ({
          comparisonList: state.comparisonList.filter(item => item.id !== productId)
        })),
    }),
    {
      name: "productComparison",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
type SidebarStore = {
  isOpenSideBard: boolean;
  toggleOpenSidebar: () => void;
};

export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpenSideBard: false,
  toggleOpenSidebar: () =>
    set((state) => ({ isOpenSideBard: !state.isOpenSideBard })),
}));

interface AllProductViewStore {
  view: number;
  changeProductView: (gridNumber: number) => void;
}

export const useAllProductViewStore = create<AllProductViewStore>((set) => ({
  view: 3,
  changeProductView: (gridNumber) => set({ view: gridNumber }),
}));

interface SideBarFilterStore {
  filter: Record<string, any>;
  setFilter: (key: string, value: any) => void;
  deleteFilter: (key: string) => void;
}

export const useSideBarFilterWithStore = create<SideBarFilterStore>((set) => ({
  filter: {},
  setFilter: (key, value) =>
    set((state) => ({
      filter: {
        ...state.filter,
        [key]: value,
      },
    })),
  deleteFilter: (key) =>
    set((state) => {
      const { [key]: deletedKey, ...rest } = state.filter;
      return { filter: rest };
    }),
}));


