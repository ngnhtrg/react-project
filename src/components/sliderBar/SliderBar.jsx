import React, { useEffect, useState } from 'react';
import { products, colors } from '../../data/TestUI';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductElement from '../productElement/ProductElement';
import { Link, useLocation, useParams } from "react-router-dom";

const BASE_URL = 'https://support.mollywlove.ru/api';


const SliderBar = ({cateName}) => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 460,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }
        ]
    };

    const [products, setProduct] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`${BASE_URL}/products/`);
            const data = await response.json();
            if (data && Array.isArray(data)) {
                const tempPr = data.map((item) => ({
                id: item.id,
                sku_id: item.id_sku,
                productName: item.name,
                image: item.img_base,
                image_hover: item.img_hover,
                price: item.price,
                cateName: item.category,
                color: item.color,
                tag: item.tag,
              }));
              console.log("NEw___LOG____________:", tempPr);
              setProduct(tempPr);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchData();
      }, []);


    return (
        <div>
            <div className='product-card-slider__container'>
                <Slider {...settings}>
                    {products.map((product, index) => (
                        <ProductElement
                            key={product.id}
                            id={product.id}
                            sku_id={product.sku_id}
                            productName={product.productName}
                            cateName={product.cateName}
                            price={product.price}
                            image={product.image}
                            image_hover={product.image_hover}
                            colors={product.color.map(colorObj => colorObj)}
                            tag={product.tag}
                        />
                    ))}
                </Slider>
            </div>
        </div>
    )
}

export default SliderBar
