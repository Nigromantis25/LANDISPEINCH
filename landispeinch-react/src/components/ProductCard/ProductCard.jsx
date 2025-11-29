import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const { name, price, image, description } = product;

  return (
    <div className="product-card">
      <img src={image} alt={name} className="product-image" />
      <div className="product-info">
        <h3 className="product-title">{name}</h3>
        <p className="product-description">{description}</p>
        <p className="product-price">${price.toFixed(2)}</p>
        <button onClick={() => onAddToCart(product)} className="cta-button">
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;