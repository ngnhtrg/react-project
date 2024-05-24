import React, { useEffect, useState } from 'react';
import './detailedCategory.css';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import BreadCrumbs from '../../components/breadCrumbs/BreadCrumbs';
import ShowProducts from '../../components/showProducts/ShowProducts';
import Page404 from '../page404/Page404';
import { colors } from '../../data/TestUI';
import { BASE_URL } from '../../data/Urls';
import { Link, useLocation, useParams } from "react-router-dom";

const DetailedCategory = () => {
    const status = 200;
    const location = useLocation();

    console.log(useParams())
    let currentLink = '';
    // Get current link and id.
    const pathSegments = location.pathname.split('/').filter(segment => segment !== '');
    const category = pathSegments.pop();
    const url = '/' + pathSegments.join('/');

    const [products, setProduct] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const url = (category === 'all' || category === 'new') ? `${BASE_URL}/products/`: `${BASE_URL}/products_by_category/${category}/`;
            const response = await fetch(url);
            const data = await response.json();
            if (data && Array.isArray(data)) {
                const tempPr = data.map((item) => ({
                id: item.id,
                sku_id: item.id_sku,
                productName: item.name,
                productShortName: item.short_name,
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
        <> {status === 200 ?
            <section className='detailed-category'>
                <Header />
                <BreadCrumbs />
                {
                    Object.keys(products).length > 0 ?
                        <div className='detailed-category__container container'>
                            <ShowProducts products={products} colors={colors} />
                        </div> :
                        <div className='category-coming-soon container'>
                            <h1>Извините, товары временно недоступны</h1>
        
                            <p>Мы работаем над добавлением новых товаров в наш ассортимент. Пожалуйста, зайдите позже, чтобы увидеть обновленный выбор товаров.</p>
                            <div className="back_btn__container">
                                <button className="back_btn">
                                    <i className='home-icon uil uil-estate'></i>
                                    <a href='/'>Вернуться домой</a>
                                </button>
                            </div>
                        </div>

                }
                <Footer />
            </section> :
            <Page404 />}
        </>
    )
}

export default DetailedCategory
