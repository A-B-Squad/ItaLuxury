"use client";

import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useSidebarStore } from '@/app/store/zustand';

import { useMediaQuery } from './hooks/useMediaQuery';
import { useUrlSync } from './hooks/useUrlSync';
import { useFilterState } from './hooks/useFilterState';

import { FilterHeader } from './components/FilterHeader';
import { ChoiceFilters } from './components/ChoiceFilters';
import { CategoryFilters } from './components/CategoryFilters';
import { PriceFilter } from './components/PriceFilter';
import { ColorFilters } from './components/ColorFilters';
import { BrandFilters } from './components/BrandFilters';

import { MobileDrawer } from './layouts/MobileDrawer';
import { DesktopSidebar } from './layouts/DesktopSidebar';

import {
  MOBILE_BREAKPOINT,
  PRICE_DEBOUNCE_DELAY,
  DEFAULT_PRICE,
  MIN_PRICE,
  MAX_PRICE
} from './utils/constants';
import {
  updateFilterQueries,
  getAvailableColors,
  getAvailableBrands,
} from './utils/filterHelpers';
import { buildFilterUrl } from './utils/queryHelpers';

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

  const currentCategoryId = searchParams?.get("category");

  // Dynamic filtering
  const availableColors = useMemo(
    () => getAvailableColors(colors, brands, selectedFilterQueries),
    [colors, brands, selectedFilterQueries]
  );

  const availableBrands = useMemo(
    () => getAvailableBrands(brands, selectedFilterQueries),
    [brands, selectedFilterQueries]
  );

  // Check if sections should be shown
  const showColors = availableColors.length > 0;
  const showBrands = availableBrands.length > 0;

  // FIXED: Debounced price update that preserves all query parameters
  const debouncedPriceUpdate = useRef<(((price: number) => void) & { cancel: () => void }) | null>(null);
  if (!debouncedPriceUpdate.current) {
    let timer: any;
    const fn = ((price: number) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        // Get all current URL parameters
        const currentParams = new URLSearchParams(searchParams?.toString() || '');
        
        // Update only the price parameter
        currentParams.set('price', price.toString());
        currentParams.delete('page'); 
        
        // Build URL with all existing parameters
        const baseUrl = '/Collections';
        updateUrl(`${baseUrl}?${currentParams.toString()}`, { scroll: false });
      }, PRICE_DEBOUNCE_DELAY);
    }) as any;
    fn.cancel = () => clearTimeout(timer);
    debouncedPriceUpdate.current = fn;
  }

  useEffect(() => {
    return () => {
      debouncedPriceUpdate.current?.cancel();
    };
  }, []);

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

      if (localPrice !== DEFAULT_PRICE) {
        updatedQueries.price = [localPrice.toString()];
      }

      setSelectedFilterQueries(updatedQueries);
      updateUrl(buildFilterUrl(updatedQueries), { scroll: true });
    },
    [selectedFilterQueries, localPrice, setSelectedFilterQueries, updateUrl]
  );

  const handleChoiceSelection = useCallback(
    (value: string) => {
      const updatedQueries = {
        ...selectedFilterQueries,
        choice: [value],
      };
      delete updatedQueries.page;

      if (localPrice !== DEFAULT_PRICE) {
        updatedQueries.price = [localPrice.toString()];
      }

      setSelectedFilterQueries(updatedQueries);
      updateUrl(buildFilterUrl(updatedQueries), { scroll: true });
      toggleOpenSidebar();
    },
    [selectedFilterQueries, localPrice, setSelectedFilterQueries, updateUrl, toggleOpenSidebar]
  );

  const handleColorSelection = useCallback(
    (colorName: string) => {
      const updatedQueries = { ...selectedFilterQueries, color: [colorName] };

      if (localPrice !== DEFAULT_PRICE) {
        updatedQueries.price = [localPrice.toString()];
      }

      setSelectedFilterQueries(updatedQueries);
      updateUrl(buildFilterUrl(updatedQueries), { scroll: true });
      toggleOpenSidebar();
    },
    [selectedFilterQueries, localPrice, setSelectedFilterQueries, updateUrl, toggleOpenSidebar]
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

      if (localPrice !== DEFAULT_PRICE) {
        updatedQueries.price = [localPrice.toString()];
      }

      setSelectedFilterQueries(updatedQueries);
      updateUrl(buildFilterUrl(updatedQueries), { scroll: false });
      toggleOpenSidebar();
    },
    [selectedFilterQueries, localPrice, setSelectedFilterQueries, updateUrl, toggleOpenSidebar]
  );

  const handleClearFilters = useCallback(() => {
    setSelectedFilterQueries({});
    setLocalPrice(DEFAULT_PRICE);
    replaceUrl("/Collections?page=1", { scroll: true });
    toggleOpenSidebar();
    toast({
      title: "Filtres réinitialisés",
      description: "Les filtres ont été réinitialisés avec succès.",
      className: "bg-primaryColor text-white",
    });
  }, [setSelectedFilterQueries, setLocalPrice, replaceUrl, toggleOpenSidebar, toast]);

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
      {showColors && (
        <ColorFilters
          colors={availableColors}
          isOptionChecked={isOptionChecked}
          onColorSelect={handleColorSelection}
        />
      )}
      {showBrands && (
        <BrandFilters
          brands={availableBrands}
          isOptionChecked={isOptionChecked}
          onBrandSelect={handleBrandSelection}
        />
      )}
    </>
  );

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