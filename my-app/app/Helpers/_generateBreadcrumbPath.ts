import { fetchGraphQLData } from "@/utils/graphql";
import { SearchParamsProductSearch } from "../types";
import { CATEGORIES_QUERY_NOGQL } from "@/graphql/queries";

interface BreadcrumbItem {
    href: string;
    label: string;
}
interface CategoryPath {
    name: string;
    id: string;
}


function findCategoryPath(categories: any[], targetCategoryName: string): CategoryPath[] {
    const path: CategoryPath[] = [];

    function searchCategories(cats: any[], target: string, currentPath: CategoryPath[]): boolean {
        for (const cat of cats) {
            const newPath = [...currentPath, { name: cat.name, id: cat.id }];

            if (cat.name === target) {
                path.splice(0, path.length, ...newPath);
                return true;
            }

            if ('subcategories' in cat && cat.subcategories?.length) {
                if (searchCategories(cat.subcategories, target, newPath)) {
                    return true;
                }
            }
        }
        return false;
    }

    searchCategories(categories, targetCategoryName, []);
    return path;
}

export default async function generateBreadcrumbPath(searchParams: SearchParamsProductSearch): Promise<BreadcrumbItem[]> {
    const path: BreadcrumbItem[] = [
        { href: "/", label: "Accueil" },
    ];

    if (searchParams.category) {
        try {
            const { fetchMainCategories } = await fetchGraphQLData(CATEGORIES_QUERY_NOGQL);
            if (!fetchMainCategories || fetchMainCategories.length === 0) {
                throw new Error("fetchMainCategories not found");
            }

            const categoryPath = findCategoryPath(fetchMainCategories, searchParams.category);

            // Only add categories if we found a valid path
            if (categoryPath.length > 0) {
                categoryPath.forEach((category) => {
                    path.push({
                        href: `/Collections/tunisie?category=${encodeURIComponent(category.name)}${searchParams.choice ? `&choice=${encodeURIComponent(searchParams.choice)}` : ""}`,
                        label: category.name,
                    });
                });
            } else {
                // Add just the requested category if path not found
                path.push({
                    href: `/Collections/tunisie?category=${encodeURIComponent(searchParams.category)}${searchParams.choice ? `&choice=${encodeURIComponent(searchParams.choice)}` : ""}`,
                    label: searchParams.category,
                });
            }
        } catch (error) {
            console.error("Error generating breadcrumb path:", error);
            // Add fallback breadcrumb
            path.push({
                href: `/Collections/tunisie?category=${encodeURIComponent(searchParams.category)}${searchParams.choice ? `&choice=${encodeURIComponent(searchParams.choice)}` : ""}`,
                label: searchParams.category,
            });
        }
    }

    return path;
}