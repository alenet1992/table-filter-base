import React from 'react';
import { Product, Property } from '../types';

interface ProductListProps {
  products: Product[];
  properties: Property[];
}

const ProductList: React.FC<ProductListProps> = ({ products, properties }) => {
  const getPropertyName = (propertyId: number): string => {
    return properties.find(p => p.id === propertyId)?.name || `Property ${propertyId}` ;
  };

  const getProductName = (product: Product): string => {
    return product.property_values.find(pv => pv.property_id === 0)?.value.toString() ?? `Product ${product.id}`;
  };

  if (products.length === 0) {
    return (
      <div className="products-section">
        <div className="products-header">
          <h2 className="products-title">Products</h2>
          <span className="products-count">0 products</span>
        </div>
        <div className="no-products">
          <p>No products match the current filter.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-section">
      <div className="products-header">
        <h2 className="products-title">Products</h2>
        <span className="products-count">{products.length} products</span>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div>{getProductName(product)}</div>
            <div >
              {product.property_values.map(propertyValue => (
                <div key={propertyValue.property_id}>
                  <span>
                    {getPropertyName(propertyValue.property_id)}:
                  </span>
                  <span>
                    {propertyValue.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;