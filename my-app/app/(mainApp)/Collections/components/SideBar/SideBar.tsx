"use client";

import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useSidebarStore } from '@/app/store/zustand';
// Lightweight debounce to avoid bundling lodash in this client chunk

// Hooks
import { useMediaQuery } from './hooks/useMediaQuery';
import { useUrlSync } from './hooks/useUrlSync';
import { useFilterState } from './hooks/useFilterState';

// Components
import { FilterHeader } from './components/FilterHeader';
import { ChoiceFilters } from './components/ChoiceFilters';
import { CategoryFilters } from './components/CategoryFilters';
import { PriceFilter } from './components/PriceFilter';
import { ColorFilters } from './components/ColorFilters';
import { BrandFilters } from './components/BrandFilters';

// Layouts
import { MobileDrawer } from './layouts/MobileDrawer';
import { DesktopSidebar } from './layouts/DesktopSidebar';

// Utils
import {
  MOBILE_BREAKPOINT,
  PRICE_DEBOUNCE_DELAY,
  DEFAULT_PRICE,
  MIN_PRICE,
  MAX_PRICE
} from './utils/constants';
import {
  updateFilterQueries,
  filterBrandsByCategory,
  filterColorsWithProducts
} from './utils/filterHelpers';
import { buildFilterUrl, buildPriceUrl } from './utils/queryHelpers';

// Types
import { SideBarProps } from './types';

const SideBar: React.FC<SideBarProps> = ({ colors, brands, categories }) => {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const { isOpenSideBard, toggleOpenSidebar } = useSidebarStore();
  const { updateUrl, replaceUrl } = useUrlSync();

  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

  const {
    selectedFilterQueries,
    localPrice,
    isOptionChecked,
    hasActiveFilters,
    setSelectedFilterQueries,
    setLocalPrice
  } = useFilterState() as any;

  // Memoized values
  const currentCategoryId = searchParams?.get("category");

  const filteredColors = useMemo(
    () => filterColorsWithProducts(colors),
    [colors]
  );

  const filteredBrands = useMemo(() =>
    filterBrandsByCategory(brands, selectedFilterQueries.category),
    [brands, selectedFilterQueries.category]
  );

  // Debounced URL update for price
  const debouncedPriceUpdate = useRef<(((price: number) => void) & { cancel: () => void }) | null>(null);
  if (!debouncedPriceUpdate.current) {
    let timer: any;
    const fn = ((price: number) => {
      clearTimeout(timer);
      timer = setTimeout(() => updateUrl(buildPriceUrl(price), { scroll: false }), PRICE_DEBOUNCE_DELAY);
    }) as any;
    fn.cancel = () => clearTimeout(timer);
    debouncedPriceUpdate.current = fn;
  }
  
  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedPriceUpdate.current?.cancel();
    };
  }, []);

  // Event handlers
  const handleBrandSelection = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, checked } = e.target;
      const isSingleSelect = name === "brand";

      const updatedQueries = updateFilterQueries(
        selectedFilterQueries,
        name,
        value,
        checked,
        isSingleSelect
      );

      setSelectedFilterQueries(updatedQueries);
      updateUrl(buildFilterUrl(updatedQueries), { scroll: true });
    },
    [selectedFilterQueries, setSelectedFilterQueries, updateUrl]
  );

  const handleChoiceSelection = useCallback(
    (value: string) => {
      const updatedQueries = {
        ...selectedFilterQueries,
        choice: [value],
      };
      delete updatedQueries.page;

      setSelectedFilterQueries(updatedQueries);
      updateUrl(buildFilterUrl(updatedQueries), { scroll: true });
      toggleOpenSidebar();
    },
    [selectedFilterQueries, setSelectedFilterQueries, updateUrl, toggleOpenSidebar]
  );

  const handleColorSelection = useCallback(
    (colorName: string) => {
      const updatedQueries = { ...selectedFilterQueries, color: [colorName] };
      setSelectedFilterQueries(updatedQueries);
      updateUrl(buildFilterUrl(updatedQueries), { scroll: true });
      toggleOpenSidebar();
    },
    [selectedFilterQueries, setSelectedFilterQueries, updateUrl, toggleOpenSidebar]
  );

  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = Math.min(Math.max(Number(e.target.value), MIN_PRICE), MAX_PRICE);
    setLocalPrice(newPrice);
  }, [setLocalPrice]);

  const handlePriceChangeEnd = useCallback(() => {
    debouncedPriceUpdate.current?.(localPrice);
  }, [localPrice]);

  const handleCategorySelection = useCallback(
    (categoryId: string) => {
      const updatedQueries = {
        ...selectedFilterQueries,
        category: [categoryId],
      };

      setSelectedFilterQueries(updatedQueries);
      updateUrl(buildFilterUrl(updatedQueries), { scroll: false });
      toggleOpenSidebar();
    },
    [selectedFilterQueries, setSelectedFilterQueries, updateUrl, toggleOpenSidebar]
  );

  const handleClearFilters = useCallback(() => {
    setSelectedFilterQueries({});
    setLocalPrice(DEFAULT_PRICE);
    replaceUrl("/Collections/tunisie?page=1", { scroll: true });
    toggleOpenSidebar();
    toast({
      title: "Filtres réinitialisés",
      description: "Les filtres ont été réinitialisés avec succès.",
      className: "bg-primaryColor text-white",
    });
  }, [setSelectedFilterQueries, setLocalPrice, replaceUrl, toggleOpenSidebar, toast]);

  // Render filter content
  const renderFilterContent = () => (
    <>
      <FilterHeader
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
        showTitle={!isMobile}
      />
      <ChoiceFilters
        isOptionChecked={isOptionChecked}
        onChoiceSelect={handleChoiceSelection}
      />
      <CategoryFilters
        categories={categories}
        currentCategoryId={currentCategoryId}
        onCategorySelect={handleCategorySelection}
      />
      <PriceFilter
        localPrice={localPrice}
        onPriceChange={handlePriceChange}
        onPriceChangeEnd={handlePriceChangeEnd}
      />
      <ColorFilters
        colors={filteredColors}
        isOptionChecked={isOptionChecked}
        onColorSelect={handleColorSelection}
      />
      <BrandFilters
        brands={filteredBrands}
        isOptionChecked={isOptionChecked}
        onBrandSelect={handleBrandSelection}
      />
    </>
  );

  // Main render
  return isMobile ? (
    <MobileDrawer
      isOpen={isOpenSideBard}
      onClose={toggleOpenSidebar}
    >
      {renderFilterContent()}
    </MobileDrawer>
  ) : (
    <DesktopSidebar>
      {renderFilterContent()}
    </DesktopSidebar>
  );
};

export default memo(SideBar);