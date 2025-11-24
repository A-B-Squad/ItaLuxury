import Link from "next/link";
import MenuItemContent from "./MenuItemContent";

const ExpandedMenuItem = ({ item, index, isExpanded, openBasketDrawer, closeMenu }: any) => {
    if (item.isBasket) {
        return (
            <button
                key="basket-button"
                onClick={() => {
                    openBasketDrawer();
                    closeMenu();
                }}
            >
                <MenuItemContent item={item} index={index} isExpanded={isExpanded} />
            </button>
        );
    }

    return (
        <Link
            key={item.path}
            href={item.path}
            onClick={closeMenu}
        >
            <MenuItemContent item={item} index={index} isExpanded={isExpanded} />
        </Link>
    );
};

export default ExpandedMenuItem