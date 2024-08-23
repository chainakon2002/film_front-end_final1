import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './getProduct.css';

export default function ProductDetail() {
  const [product, setProduct] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8889/auth/getproduct/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProduct(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleOrder = () => {
    console.log(`Ordering product with ID ${product.id}`);
  };

  const handleAddToCart = () => {
    console.log(`Adding product with ID ${product.id} to cart`);
  };

  return (
    <div className="product-container">
      <div className="product-image-container">
        <img src={product.file || 'default-image.jpg'} alt={product.ItemName || 'Product Image'} className='product-image' />
      </div>
      <div className='product-details-container'>
        <h2 className='name'>{product.ItemName}</h2>
        <div className='product-details'>
          <p className='det'>{product.description}</p>
          <p className='price'>ราคา: {product.price ? product.price.toLocaleString() : 'N/A'}</p>
          <p className='stock'> จำนวนสินค้า{product.stock}</p>

          <button className='btn-hover color-9' onClick={handleAddToCart}>Add To Cart</button>
          <Link to={`/payment/${product.id}/Fs2224SbaRel2Ncvn123444Bncceddd101Mx12Z01`}>
            <button className='button2'>ซื้อเลย</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
