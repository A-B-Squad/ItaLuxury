import { Table, TableBody, TableCaption, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { BasketTableRow } from "./BasketTableRow";

interface Product {
    id: string;
    name: string;
    price: number;
    images: string[];
    quantity: number;
    basketId: string;
    reference?: string;
    slug?: string;
    actualQuantity?: number;
    inventory?: number;
    productDiscounts: any[];
    categories: any[];
    [key: string]: any;
}

interface BasketTableProps {
    products: Product[];
    onIncreaseQuantity: (productId: string, basketId?: string) => void;
    onDecreaseQuantity: (productId: string, basketId?: string) => void;
    onRemoveProduct: (productId: string, basketId?: string) => void;
}

export const BasketTable = ({
    products,
    onIncreaseQuantity,
    onDecreaseQuantity,
    onRemoveProduct
}: BasketTableProps) => {
    return (
        <Table>
            <TableCaption>Bienvenue sur notre site.</TableCaption>
            <TableHeader>
                <TableRow className="w-full">
                    <TableHead className="text-base">Description</TableHead>
                    <TableHead className="text-base">Quantité</TableHead>
                    <TableHead className="text-base">Prix</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product) => (
                    <BasketTableRow
                        key={product.id}
                        product={product}
                        onIncrease={() => onIncreaseQuantity(product.id, product.basketId)}
                        onDecrease={() => onDecreaseQuantity(product.id, product.basketId)}
                        onRemove={() => onRemoveProduct(product.id, product.basketId)}
                    />
                ))}
            </TableBody>
        </Table>
    );
};