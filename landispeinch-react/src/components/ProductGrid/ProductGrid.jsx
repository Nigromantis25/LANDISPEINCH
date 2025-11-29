import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductGrid.css';
import { products } from '../../data/products';

const ProductGrid = ({ onAddToCart }) => {
  return (
    <section id="productos" className="products-section">
      <h2>Nuestros Productos</h2>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;