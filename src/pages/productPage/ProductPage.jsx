// import React, { useState } from 'react';
import React, { useEffect, useState } from 'react';
import './productPage.css';
import { Link, useLocation, useParams } from "react-router-dom";
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import { BASE_URL, CART_URL } from '../../data/Urls';
import { breadCrumbsDisplay } from '../../data/Categories';
import SizeSelector from '../../components/sizeSelector/SizeSelector';
import Order from '../../data/Order';
import ShowProducts from '../../components/showProducts/ShowProducts';
import SliderBar from '../../components/sliderBar/SliderBar';
import Page404 from '../page404/Page404';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';



const sizes = [
    {
        size: "S",
    },
    {
        size: "M",

    },
    {
        size: "L",
    }
]

const ProductPage = () => {
    const location = useLocation();

    console.log(useParams())
    let currentLink = '';
    // Get current link and id.
    const pathSegments = location.pathname.split('/').filter(segment => segment !== '');
    const currentId = pathSegments.pop();
    const url = '/' + pathSegments.join('/');

    
    // ------------------------------------------
    // const productskuId = '1000S';
    const productId = currentId;
    const [productskuId, setProductSkuId] = useState('');
    const [productData, setProductData] = useState('');
    const [currentSize, setCurrentSize] = useState('');
    const [productSkus, setProductSkus] = useState([]);
    const [colorList, setColorList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`${BASE_URL}/product_details/${productId}/`);
            const data = await response.json();
            setProductData(data);
            setCurrentSize(data.size);
            setProductSkuId(data.id)
            // Extract all_product_skus and convert to list of dictionaries
            if (data && data.all_product_skus) {
              const skusList = data.all_product_skus.map((sku) => ({
                id: sku.id,
                productId: sku.product_id,
                ru_color: sku.ru_color,
                color: sku.color,
                size: sku.size,
                status: sku.status
              }));
              setProductSkus(skusList);
              console.log("sku", productSkus);
            }
            if (data && data.all_colors) {
                const colors = data.all_colors.map((color) => ({
                  color: color.en_color,
                  colorName: color.ru_color,
                }));
                setColorList(colors);
              }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);

    const crumbs = location.pathname.split('/')
        .filter(crumb => crumb !== '')
        .map((crumb, index, array) => {
            currentLink += `/${crumb}`;
            const breadcrumbInfo = breadCrumbsDisplay.find(item => item.crumb === crumb);
            const display = breadcrumbInfo ? breadcrumbInfo.display : crumb;
            const productName = index === array.length - 1 ? productData.name : display;
            // If it's the last crumb, set it to productName
            return (
                <div className="crumb" key={crumb}>
                    <Link className="crumb-link" to={currentLink}>{productName}</Link>
                </div>
            );
        });


    const handleSmallImageClick = (event) => {
        const clickedImageContainer = event.target.closest('.small-product-image');
        const largeImage = document.querySelector('.product-image__large');

        if (clickedImageContainer) {
            const clickedImage = clickedImageContainer.querySelector('img');
            largeImage.src = clickedImage.src;

            document.querySelectorAll('.small-product-image').forEach(container => container.classList.remove('selected'));
            clickedImageContainer.classList.add('selected');
        }
    };

    
    const currentColorName = productData.ru_color;
    const currentColor = productData.en_color;
    const currentStatus = productData.status;

    let defaultSize;

    if (currentSize) {
        defaultSize = currentSize.size;
    } else {
        defaultSize = sizes[0].size;
    }

    // Quantity Button: 
    const [productQuantity, setProductQuantity] = useState(0);

    const [quantity, setQuantity] = useState(0);

    const increase = () => {
        const newQuantity = productQuantity + 1;
        setProductQuantity(newQuantity);
        setQuantity(newQuantity);
    }

    const decrease = () => {
        const newQuantity = productQuantity - 1;
        setProductQuantity(newQuantity);
        setQuantity(newQuantity);
    }

    // Add to cart button:
    

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'React POST Request Example' }),
        credentials: 'include'
    };

    const addToCart = async () => {
        try {
            const session_id = Cookies.get('name');
            const res = await fetch(`${CART_URL}/add_to_cart/${productskuId}/${session_id}/${quantity}`, requestOptions);
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            
            const data = await res.json();
            console.log('Response:', data);
            // Cookies.set('name', data.session_key);
            if (typeof session_id === 'undefined') {
                Cookies.set('name', data.session_key);
            }

            // setCurrentSize(Cookies.get('name'));

            // Handle response data as needed
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
      };
    const status = 200;

    const navigate = useNavigate()
    const getIDWithFixSize = (color) => {
        const clickId = productSkus.find(item => item.size === currentSize && item.color === color).productId;
        navigate(`${url}/${clickId}`);
        navigate(0);
    }

    const getIDWithFixColor = (size) => {
        const sku_id = productSkus.find(item => item.color === currentColor && item.size === size).id;
        setCurrentSize(size);
        setProductSkuId(sku_id);
    }

    return (
        <> {status === 200 ?
            <section className='product-page'>
                <Header />
                <div className='product__breadcrumbs'>
                    {crumbs}
                </div>

                <div className='product-page__container container'>
                    {/* Images displace */}
                    <div className='product-image__container'>
                        <div className='small-images' onClick={handleSmallImageClick}>
                            <div className='small-product-image selected'>
                                <img alt="" src={productData.img_base}></img>
                            </div>
                            <div className='small-product-image'>
                                <img alt="" src={productData.img_hover}></img>
                            </div>
                            <div className='small-product-image'>
                                <img alt="" src={productData.img_details_1}></img>
                            </div>
                            <div className='small-product-image'>
                                <img alt="" src={productData.img_details_2}></img>
                            </div>
                        </div>
                        <div className='product-image-large__container'>
                            <img className='product-image__large' alt="" src={productData.img_base}></img>
                        </div>
                    </div>

                    {/* Information */}
                    <div className='product-information__container'>
                        <div className='page-product-name-price'>
                            <h3 className='page-product-name'> {productData.name}</h3>
                            <p className='page-product-price'>{productData.price} RUB</p>
                        </div>
                        <div className='page-product-code'>
                            <p className='page-product-code'>Артикул: {productData.product_id}</p>
                        </div>
                        <div className='page-product-short-description'>
                            <p className='page-product-short-description'>Описание: {productData.description}</p>
                        </div>


                        {/* <div className='product-information__text'>
                    <div className='product-availability grid'>
                        <p className='product-availability__subtitle'>Доступность:</p>
                        {testProduct.quantity > 0 ? <p className='product-availability'>Да</p>
                            : <p className='product-availability'>Нет</p>}
                    </div>
                    <div className='product-availability grid'>
                        <p className='product-category__subtitle'>Категория:</p>
                        <p className='product-category'>{testProduct.cateNameRussian}</p>
                    </div>
                    <p className='product-delivery'>Бесплатная доставка</p>
                </div> */}

                        {/* Select colors */}
                         <div className='select-color grid'>
                            <div className="select-color-name">
                                <p className='select-color__subtitle'>Цвет:</p>
                                <p className='selected-color-name'>{currentColorName}</p>
                            </div>
                            <div className="color-dots-container">
                                {colorList.map((item) => (
                                    <div
                                        key={item.color}
                                        className="color-link"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div onClick={() => getIDWithFixSize(item.color)}>
                                            <div className={`${item.color === currentColor ? 'color-dot-container selected-dot' : 'color-dot-container'}`} >
                                                <span style={{ backgroundColor: item.color }} ></span>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Select size */}
                        <div className='select-size grid'>
                            <div className="select-color-name">
                                <p className='select-color__subtitle'>Размер:</p>
                                <p className='selected-color-name'>{currentSize}</p>
                            </div>

                            {/* <SizeSelector className="select-size__form" sizeList={sizes}
                                availableSize={availableSize}
                                parentLink={url}
                                defaultSize={defaultSize}
                            /> */}
                            <div className='sizes-container'>
                                {sizes.map((item) => (
                                    <div
                                        key={item.size}
                                        className='size-link'
                                        style={{ cursor: 'pointer' }}>
                                        <div onClick={() => getIDWithFixColor(item.size)}>
                                            <div className={`${item.size === currentSize ? 'size-dot-container selected-size' : 'size-dot-container'}`} >
                                                <span>{item.size}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Select quantity and add to cart */}
                        {currentStatus === "ok" ? <div className='quantity-and-cart'>

                            <div className='quantity-btn'>
                                {productQuantity > 0 ?
                                    <button className='decrease-btn' onClick={decrease}>-</button> :
                                    <button className='decrease-btn'>-</button>}

                                <p className='quantity-display'>{productQuantity}</p>

                                {productQuantity < productData.quantity ?
                                    <button className='increase-btn' onClick={increase}>+</button> :
                                    <button className='increase-btn'>+</button>}
                            </div>
                            {(quantity <= productData.quantity && quantity > 0) ?
                                <div className='add-to-cart' onClick={addToCart} style={{ cursor: 'pointer' }}>
                                    {/* <i className='uil uil-shopping-cart-alt page-cart__icon'></i> */}
                                    <p className='cart__text'>В Корзину</p>
                                </div> :
                                <div className='add-to-cart' style={{ cursor: 'default' }}>
                                    {/* <i className='uil uil-shopping-cart-alt page-cart__icon'></i> */}
                                    <p className='cart__text'>В Корзину</p>
                                </div>}
                        </div> :
                            <div className='quantity-and-cart'> <div className='out-of-stock-btn add-to-cart' style={{ cursor: "default" }}>Сейчас нет в наличии</div></div>

                        }

                        <div className='product-availability_delivery grid'>
                            <p className='product-category__truck uil uil-truck'></p>
                            <p className='product-category__subtitle'>Бесплатная доставка при заказе на сумму более 3000₽.</p>
                        </div>

                        <div className='product-availability_delivery grid'>
                            <p className='product-category__truck uil-clock-five'></p>
                            <p className='product-category__subtitle'>Доставка в течение: 3-7 рабочих дней.</p>
                        </div>


                        {/* 
                        <div className='product-availability grid'>
                            <p className='product-category__subtitle'>Категория:</p>
                            <p className='product-category'>{testProduct.cateNameRussian}</p>
                        </div>

                        <div className='product-availability grid'>
                            <p className='product-category__subtitle'>Модель:</p>
                            <p className='product-category'>{testProduct.model}</p>
                        </div> */}
                    </div>
                </div>
                {/* Description */}
                {/* <div className='product-description__container container'>
                    <h3 className='product-description__title'>Описание</h3>
                    <p>Красивое платье, выполненное из качественного материала, подчеркнет вашу женственность и стиль. Его изящный дизайн и удобная посадка сделают его вашим любимым выбором как для повседневного образа, так и для особых случаев.</p>
                </div> */}
                {/* Related Products */}
                <div className='related-products container'>
                    <h2 className='recommend__title'>РЕКОМЕНДУЕМ ТАКЖЕ</h2>
                    {/* <ShowProducts catName={testProduct.cateName}></ShowProducts> */}
                    <SliderBar cateName="All" />
                </div>
                <Footer />
            </section> :
            <Page404 />}

        </>
    )
}

export default ProductPage
