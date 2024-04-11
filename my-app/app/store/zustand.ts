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

type ComparedProductsStore = {
  products: any[];
  addProductToCompare: (product: any) => void;
};

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

const comparedProductsStore = <ComparedProductsStore>(set: any) => ({
  products: [],
  addProductToCompare: (product: any) =>
    set((state: any) => ({ products: [...state.products, product] })),
  removeProductFromCompare: (productId: any) =>
    set((state: any) => ({
      products: state.products.filter(
        (product: any) => product.id !== productId,
      ),
    })),
});

export const useComparedProductsStore = create(
  persist(comparedProductsStore, {
    name: "comparedProducts",
    storage: createJSONStorage(() => sessionStorage),
  }),
);

interface ProductData {
  id: string;
  name: string;
  price: number;
  reference: string;
  description: string;
  createdAt: Date;
  inventory:number
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
  productData: ProductData | null;
  openProductDetails: (productData: ProductData) => void;
  closeProductDetails: () => void;
};

export const useProductDetails = create<UseProductDetails>((set) => ({
  isOpen: false,
  productData: null,
  openProductDetails: (productData) => set({ isOpen: true, productData }), 
  closeProductDetails: () => set({ isOpen: false }),
}));
