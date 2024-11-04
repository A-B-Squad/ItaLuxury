import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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

type BasketStore = {
  isUpdated: boolean;
  toggleIsUpdated: () => void;
};

interface ProductDetailsData {
  id: string;
  name: string;
  price: number;
  isVisible: boolean;
  images: string[];
  reference: string;
  description: string;
  inventory: number;
  productDiscounts: {
    newPrice: number;
  }[];
  Colors: {
    color: string;
    Hex: string;
  };
  brand: Brand;
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

export const useCheckoutStore = create<CheckoutState>((set) => ({
  checkoutProducts: [],
  checkoutTotal: 0,
  setCheckoutProducts: (products) => set({ checkoutProducts: products }),
  setCheckoutTotal: (total) => set({ checkoutTotal: total }),
  clearCheckout: () => set({ checkoutProducts: [], checkoutTotal: 0 }),
}));


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

export const useDrawerMobileStore = create<DrawerMobileCategoryStore>(
  (set) => ({
    isOpen: false,
    openCategoryDrawer: () => set({ isOpen: true }),
    closeCategoryDrawer: () => set({ isOpen: false }),
  })
);

export const useDrawerBasketStore = create<DrawerBasketStore>((set) => ({
  isOpen: false,
  openBasketDrawer: () => set({ isOpen: true }),
  closeBasketDrawer: () => set({ isOpen: false }),
}));

export const useBasketStore = create<BasketStore>((set) => ({
  isUpdated: false,
  toggleIsUpdated: () => set((state) => ({ isUpdated: !state.isUpdated })),
}));

const comparedProductsStore = <ComparedProductsStore>(set: any, get: any) => ({
  products: [],
  addProductToCompare: (product: any) => {
    const currentProducts = get().products;
    // Check if the product already exists in the products array
    const isProductInStore = currentProducts.some(
      (p: any) => p.id === product.id
    );
    if (!isProductInStore) {
      set((state: any) => ({ products: [...state.products, product] }));
    }
  },
  removeProductFromCompare: (productId: any) =>
    set((state: any) => ({
      products: state.products.filter(
        (product: any) => product.id !== productId
      ),
    })),
});

interface ProductData {
  id: string;
  name: string;
  price: number;
  isVisible: boolean;
  images: string[];
  reference: string;
  description: string;
  inventory: number;
  quantity: number;
  basketId: string;
  productDiscounts: {
    newPrice: number;
  }[];
  Colors: {
    color: string;
    Hex: string;
  };
  brand: Brand;
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
// Define the ProductsInBasketStore type
interface ProductsInBasketStore {
  products: ProductData[];
  quantityInBasket: number;
  setQuantityInBasket: (quantity: number) => void;
  addProductToBasket: (product: ProductData) => void;
  removeProductFromBasket: (productId: string) => void;
  increaseProductInQtBasket: (productId: string, quantity: number) => void;
  decreaseProductInQtBasket: (productId: string) => void;
  clearBasket: () => void;
}

// Define the set type
type SetState = (
  update: (state: ProductsInBasketStore) => Partial<ProductsInBasketStore>
) => void;

// Define the store creation function
const productsInBasketStore = (set: SetState): ProductsInBasketStore => ({
  products: [],
  quantityInBasket: 0,
  setQuantityInBasket: (quantity: number) => {
    set((state) => ({
      quantityInBasket: quantity,
    }));
  },
  addProductToBasket: (product: ProductData) => {
    set((state) => ({
      products: [...state.products, product],
      quantityInBasket: state.products.length + 1,
    }));
  },
  increaseProductInQtBasket: (productId: string, quantity: number) => {
    set((state) => {
      const updatedProducts = state.products.map((product) =>
        product.id === productId
          ? { ...product, actualQuantity: (product.actualQuantity || 0) + quantity }
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
          product.id === productId && product.actualQuantity > 0
            ? { ...product, actualQuantity: product.actualQuantity - 1 }
            : product
        )
        .filter((product) => product.actualQuantity > 0);

      const updatedQuantityInBasket = updatedProducts.reduce(
        (sum, product) => sum + product.actualQuantity,
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
      return {
        products: updatedProducts,
        quantityInBasket: updatedProducts.length,
      };
    });
  },
  clearBasket: () => {
    set(() => ({
      products: [],
      quantityInBasket: 0,
    }));
  },
});

export const useProductsInBasketStore = create(
  persist<ProductsInBasketStore>(productsInBasketStore, {
    name: "productsInBasket",
    storage: createJSONStorage(() => sessionStorage),
  })
);

export const useComparedProductsStore = create(
  persist(comparedProductsStore, {
    name: "comparedProducts",
    storage: createJSONStorage(() => sessionStorage),
  })
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
