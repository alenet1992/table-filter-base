import { useState, useMemo } from 'react';
import { Product, Filter, FilterOperators } from '../types';
import { needsNoValue } from '../utils/filterUtils';

interface UseProductFilterReturn {
  filteredProducts: Product[];
  filter: Filter | null;
  setFilter: (filter: Filter | null) => void;
  clearFilter: () => void;
}

/**
 * Define type of filters
 */
export const filterOperators: FilterOperators = {
  equals: (value: any, filterValue: any): boolean => value === filterValue,
  greater_than: (value: any, filterValue: any): boolean => parseFloat(value) > parseFloat(filterValue),
  less_than: (value: any, filterValue: any): boolean => parseFloat(value) < parseFloat(filterValue),
  any: (value: any): boolean => value !== undefined && value !== null && value !== '',
  none: (value: any): boolean => value === undefined || value === null || value === '',
  in: (value: any, filterValues: any[]): boolean => filterValues.includes(value),
  contains: (value: any, filterValue: string): boolean => 
    value && value.toString().toLowerCase().includes(filterValue.toLowerCase())
};

export const useProductFilter = (products: Product[]): UseProductFilterReturn => {
  const [filter, setFilter] = useState<Filter | null>(null);

  // UseMemo to cache the calc (re-render)
  const filteredProducts = useMemo(() => {
    if (!filter) {
      return products;
    }
    
    return products.filter(product => {
      const propertyValue = product.property_values.find(
        pv => pv.property_id === filter.propertyId
      );
      const value = propertyValue ? propertyValue.value : null;

      const filterFunction = filterOperators[filter.operator];
      if (!filterFunction) return false;

      if (filter.operator === 'in') {
        return filterFunction(value, filter.value as string[]);
      } else if (needsNoValue(filter.operator)) {
        return filterFunction(value);
      } else {
        return filterFunction(value, filter.value);
      }
    });
  }, [products, filter]);

  const clearFilter = (): void => {
    setFilter(null);
  };

  return {
    filteredProducts,
    filter,
    setFilter,
    clearFilter
  };
};