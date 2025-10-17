
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { convertStringToQueriesObject } from '@/app/Helpers/_convertStringToQueriesObject';
import { FilterQueries, FilterState } from '../types';
import { DEFAULT_PRICE, MIN_PRICE, MAX_PRICE } from '../utils/constants';
import { isOptionChecked as checkOption, hasActiveFilters as checkActiveFilters } from '../utils/filterHelpers';

export const useFilterState = (): FilterState => {
    const searchParams = useSearchParams();
    const [selectedFilterQueries, setSelectedFilterQueries] = useState<FilterQueries>({});
    const [localPrice, setLocalPrice] = useState<number>(DEFAULT_PRICE);

    // Initialize filters from URL
    useEffect(() => {
        const paramsObj = convertStringToQueriesObject(searchParams);
        setSelectedFilterQueries(paramsObj);

        const priceFromParams = searchParams?.get("price");
        if (priceFromParams) {
            const price = Number(priceFromParams);
            if (price >= MIN_PRICE && price <= MAX_PRICE) {
                setLocalPrice(price);
            }
        }
    }, [searchParams]);

    const isOptionChecked = useCallback(
        (name: string, option: string) => checkOption(selectedFilterQueries, name, option),
        [selectedFilterQueries]
    );

    const hasActiveFilters = checkActiveFilters(selectedFilterQueries);

    return {
        selectedFilterQueries,
        localPrice,
        isOptionChecked,
        hasActiveFilters,
        setSelectedFilterQueries,
        setLocalPrice,
    } as FilterState & {
        setSelectedFilterQueries: (queries: FilterQueries) => void;
        setLocalPrice: (price: number) => void;
    };
};