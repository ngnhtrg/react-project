import React, { useState } from 'react';
import './showProducts.css';
import ProductElement from '../productElement/ProductElement';


const ShowProducts = ({ products, colors }) => {
  const [isActiveLoad, setIsActiveLoad] = useState(false);

  const handleClickLoad = () => {
    setIsActiveLoad(!isActiveLoad);
  };

  return (
    <>
      <section className='show-products'>
        <div className='products__container grid'>
          {products.map((product) => (
            <ProductElement
              key={product.id}
              id={product.id}
              sku_id={product.sku_id}
              productName={product.productName}
              productShortName={product.productShortName}
              cateName={product.cateName}
              price={product.price}
              image={product.image}
              image_hover={product.image_hover}
              colors={product.color.map(colorObj => colorObj)}
              tag={product.tag}
            />
          ))}
        </div>
        <div className="load-more__container">
          <button className={isActiveLoad ? 'load-more__text load-more__active' : 'load-more__text'} onClick={handleClickLoad}>
            Ещё
          </button>
        </div>
      </section>
    </>
  )
}

export default ShowProducts
