import ProductItem from "./ProductItem";

const ProductsList = ({
    products,
    closeDrawer
}: {
    products: any[];
    closeDrawer: () => void;
}) => (
    <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Produits ({products.length})
        </h3>
        <div className="space-y-3">
            {products.map((product: any) => (
                <ProductItem
                    key={product.id}
                    product={product}
                    closeDrawer={closeDrawer}
                />
            ))}
        </div>
    </div>
);

export default ProductsList