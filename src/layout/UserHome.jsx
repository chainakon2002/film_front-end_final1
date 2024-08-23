import axios from 'axios';
import { useEffect, useState } from 'react';
import './css/UserHome.css';
import Promote from "../layout/Promote";
import { Link } from 'react-router-dom';

export default function UserHome() {
  const [product, setProduct] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8889/auth/getproduct', {
          headers: { Authorization: `Bearer ${token}` } 
        });
        setProduct(response.data);

        const rs = await axios.get('http://localhost:8889/cart/carts/', {
          headers: { Authorization: `Bearer ${token}`}
        });
        setCart(rs.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, []);

  const filteredProducts = product.filter(item =>
    item.ItemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cartShow = async () => {
    try {
      const token = localStorage.getItem('token');
      const rscarts = await axios.get('http://localhost:8889/cart/carts/', {
        headers: { Authorization: `Bearer ${token}`}
      });
      setCart(rscarts.data);
    } catch (err) {
      console.error(err);
    }
  };

  const cartfu = async (item) => {
    const userid = localStorage.getItem('userId');
    const cartItimechix = cart.find(c => c.productId === item.id);
    console.log(555, cartItimechix);
    try {
      if (cartItimechix) {
        const totalAll = cartItimechix.total + 1;
        const nextprice = cartItimechix.price + item.price;
        await axios.put(`http://localhost:8889/cart/carts/${cartItimechix.id}/`, {
          total: totalAll,
          price: nextprice
        });
      } else {
        await axios.post('http://localhost:8889/cart/carts', {
          total: 1,
          price: item.price,
          UserId: userid,
          productId: item.id
        });
      }
      cartShow();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="user-home-container">
      <div className='poster'>
        <Promote />
        <h3 className="productfi">รายการสินค้า</h3>
        {/* Updated Search Bar */}
        <div id="search-bar" style={{ width: '550px' }} className="w-120 bg-white rounded-md shadow-lg z-10 mx-auto my-4">
          <form className="flex items-center justify-center p-2">
            <input 
              type="text" 
              placeholder="Search here"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
            />
          </form>
        </div>
      </div>

      {/* Product list */}
      {filteredProducts.map((item) => (
        <div key={item.id} className="product-item flex flex-col justify-between items-center border rounded-lg p-4 shadow-md m-2 relative">
          <Link to={`/product/${item.id}`} className="text-center w-full">
            {/* Stock Information Positioned at the Top Right */}
            <div className="stock-info absolute top-2 right-2 bg-white text-gray-800 rounded-md px-2 py-1 text-sm shadow">
              <p>เหลือสินค้า {item.stock}</p>
            </div>
            <img src={item.file} alt="" className="w-full h-48 object-cover rounded-md mb-4" />
            <hr className="mb-4" />
            <h3 className="font-semibold product-title text-lg mb-2">{item.ItemName}</h3>
            <p className="font-semibold product-price text-md mb-4">ราคา: {item.price.toLocaleString()} บาท</p>
          </Link>
          <div className="button-group w-full flex justify-center">
            <button 
              onClick={() => cartfu(item)} 
              className="cart-button bg-blue-600 text-white py-2 px-4 rounded-[15px] hover:bg-blue-700 transition-colors w-full mt-auto"
            >
              เพิ่มไปยังตะกร้า
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
