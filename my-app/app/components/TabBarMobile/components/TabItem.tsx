import CategoryButton from "./CategoryButton";
import CenterButton from "./CenterButton";
import RegularLinkButton from "./RegularLinkButton";
import SearchButton from "./SearchButton";

const TabItem = ({ item, isExpanded, toggleExpanded, handleItemClick, openCategoryDrawer, isActive }: any) => {
    if (item.isCenter) {
        return <CenterButton isExpanded={isExpanded} toggleExpanded={toggleExpanded} item={item} />;
    }

    if (item.isSearch) {
        return <SearchButton item={item} handleItemClick={handleItemClick} />;
    }

    if (item.isCategory) {
        return <CategoryButton item={item} openCategoryDrawer={openCategoryDrawer} />;
    }

    return <RegularLinkButton item={item} isActive={isActive} />;
};

export default TabItem