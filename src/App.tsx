import React from 'react';
import FilterEditor from './components/FilterEditor';
import ProductList from './components/ProductList';
import { useProductFilter } from './hooks/useProductFilter';
import { Datastore, Filter } from './types';

import './styles/App.css';

// define global variavel for the typescript 
declare global {
  interface Window {
    datastore: Datastore;
  }
}

const App: React.FC = () => {
  const allProducts = window.datastore.getProducts();
  const properties = window.datastore.getProperties();
  const operators = window.datastore.getOperators();

  const {
    filteredProducts,
    filter,
    setFilter,
    clearFilter
  } = useProductFilter(allProducts);

  const handleFilterChange = (newFilter: Filter): void => {
    setFilter(newFilter);
  };

  const handleClearFilter = (): void => {
    clearFilter();
  };

  return (
    <div className="container">
      <FilterEditor
        properties={properties}
        operators={operators}
        onFilterChange={handleFilterChange}
        currentFilter={filter}
        onClearFilter={handleClearFilter}
      />

      <ProductList
        products={filteredProducts}
        properties={properties}
      />
    </div>
  );
};

export default App;