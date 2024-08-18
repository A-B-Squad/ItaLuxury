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

interface ProductData {
  id: string;
  name: string;
  price: number;
  reference: string;
  description: string;
  createdAt: Date;
  inventory: number;
  images: string[];
  categories: {
    name: string;
  }[];
  Colors: {
    color: string;
    Hex: string;
  };
  productDiscounts: {
    price: number;
    newPrice: number;
    Discount: {
      percentage: number;
    };
  }[];
}
type UseProductDetails = {
  isOpen: boolean;
  productData: ProductData | any;
  openProductDetails: (productData: ProductData) => void;
  closeProductDetails: () => void;
};

export const useProductDetails = create<UseProductDetails>((set) => ({
  isOpen: false,
  productData: null,
  openProductDetails: (productData) => set({ isOpen: true, productData }),
  closeProductDetails: () => set({ isOpen: false, productData: null }),
}));

export const useDrawerMobileStore = create<DrawerMobileCategoryStore>(
  (set) => ({
    isOpen: false,
    openCategoryDrawer: () => set({ isOpen: true }),
    closeCategoryDrawer: () => set({ isOpen: false }),
  }),
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
      (p: any) => p.id === product.id,
    );
    if (!isProductInStore) {
      set((state: any) => ({ products: [...state.products, product] }));
    }
  },
  removeProductFromCompare: (productId: any) =>
    set((state: any) => ({
      products: state.products.filter(
        (product: any) => product.id !== productId,
      ),
    })),
});

// Define the Product type
interface Product {
  [x: string]: number;
  id: string;
  name: string;
  price: number;
  // Add other product properties as needed
}

// Define the ProductsInBasketStore type
interface ProductsInBasketStore {
  products: Product[];
  quantityInBasket: number;
  setQuantityInBasket: (quantity: number) => void;
  addProductToBasket: (product: Product) => void;
  removeProductFromBasket: (productId: string) => void;
  clearBasket: () => void;
}

// Define the set type
type SetState = (update: (state: ProductsInBasketStore) => Partial<ProductsInBasketStore>) => void;

// Define the store creation function
const productsInBasketStore = (set: SetState): ProductsInBasketStore => ({
  products: [],
  quantityInBasket: 0,
  setQuantityInBasket: (quantity: number) => {
    set((state) => ({
      quantityInBasket: quantity,
    }));
  },
  addProductToBasket: (product: Product) => {
    set((state) => ({
      products: [...state.products, product],
    }));
  },
  removeProductFromBasket: (productId: string) => {
    set((state) => ({
      products: state.products.filter(
        (product) => product.id !== productId,
      ),
    }));
  },
  clearBasket: () => {
    set((state) => ({
      products: [],
    }));
  },
});


export const useProductsInBasketStore = create(
  persist(productsInBasketStore, {
    name: "productsInBasket",
    storage: createJSONStorage(() => sessionStorage),
  }),
);

export const useComparedProductsStore = create(
  persist(comparedProductsStore, {
    name: "comparedProducts",
    storage: createJSONStorage(() => sessionStorage),
  }),
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
