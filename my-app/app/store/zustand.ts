import { create } from 'zustand';

type DrawerMobileCategoryStore = {
    isOpen: boolean,
    openCategoryDrawer: () => void,
    closeCategoryDrawer: () => void,
}

type DrawerBasketStore = {
    isOpen: boolean,
    openBasketDrawer: () => void,
    closeBasketDrawer: () => void,
}

type ComparedProductsStore = {
    products: any[];
    addProductToCompare: (product: any) => void;
}


export const useDrawerMobileStore = create<DrawerMobileCategoryStore>((set) => ({
    isOpen: false,
    openCategoryDrawer: () => set({ isOpen: true }),
    closeCategoryDrawer: () => set({ isOpen: false }),
}));


export const useDrawerBasketStore = create<DrawerBasketStore>((set) => ({
    isOpen: false,
    openBasketDrawer: () => set({ isOpen: true }),
    closeBasketDrawer: () => set({ isOpen: false }),
}));

export const useComparedProductsStore = create<ComparedProductsStore>((set) => ({
    products: [],
    addProductToCompare: (product) => set((state) => ({ products: [...state.products, product] })),
}));
