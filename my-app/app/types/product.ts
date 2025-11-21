
export type SearchParamsProductSearch = {
    choice?: string;
    category?: string;
    color?: string;
    price?: string;
    brand?: string;
    page?: string;
    sort?: string;
    query?: string;
};
export interface ProductData {
    id: string;
    name: string;
    slug: string;
    price: number;
    isVisible: boolean;
    images: string[];
    reference: string;
    description: string;
    inventory: number;
    quantity: number;
    basketId: string;
    productDiscounts: {
        id:string
        newPrice: number;
        price: number;
        dateOfEnd: string;
        dateOfStart: string
    }[];
    Colors: {
        id:string
        color: string;
        Hex: string;
    } | null;
    Brand: Brand;
    categories: {
        id: string;
        name: string;
        description: string;
        subcategories: {
            id: string;
            name: string;
            description: string;
            subcategories: {
                id: string;
                name: string;
                description: string;
            }[];
        }[];
    }[];
    [key: string]: any;
}






