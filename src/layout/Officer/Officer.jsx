import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { th } from 'date-fns/locale'; // Import locale for Thai

export default function AdminHome() {
  const [payment, setPayment] = useState([]); 
  const [address, setAddress] = useState([]); 
  const [product, setProductData] = useState([]);  // New state for product data
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => { 
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8889/auth/getorder', {
          headers: { Authorization: `Bearer ${token}` } 
        });
        // Sort the data by createdAt in descending order
        const sortedData = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPayment(sortedData);
        console.log('Order Data:', sortedData);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    const fetchAddress = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8889/auth/admingetaddress', {
          headers: { Authorization: `Bearer ${token}` } 
        });
        setAddress(response.data);
        console.log('Address Data:', response.data);
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    };

    const fetchProductData = async () => {  // Fetching product data
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8889/auth/getproduct', {
          headers: { Authorization: `Bearer ${token}` } 
        });
        setProductData(response.data);
        console.log('Product Data:', response.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProduct();
    fetchAddress();
    fetchProductData();  // Call fetchProductData
  }, []); 

  const handleDelete = async (id) => {
    console.log('Delete item with id:', id);
  };

  const openModal = (item) => {
    setSelectedItem(item);
    document.getElementById('my_modal_3').showModal();
  };

  const closeModal = () => {
    setSelectedItem(null);
    document.getElementById('my_modal_3').close();
  };

  const getAddressDetails = (addressId) => {
    const addressDetails = address.find(addr => addr.id === addressId);
    if (addressDetails) {
      return `${addressDetails.housenumber} หมู่ ${addressDetails.village}, ต. ${addressDetails.tambon}, อ. ${addressDetails.district}, จ. ${addressDetails.province}, ${addressDetails.zipcode}`;
    }
    return 'No address found';
  };

  const getProductDetails = (productId) => {
    const productDetails = product.find(prod => prod.id === productId);
    return productDetails ? productDetails : null;
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center items-center py-10 w-full">
        <div className="mb-6">
          <p className="text-4xl font-semibold text-center">รายการสั่งซื้อทั้งหมด</p>
        </div>

        <div className="container mx-auto mt-10 p-4 rounded-lg bg-white shadow-lg w-full max-w-4xl overflow-hidden">
          {payment.map((item) => {
            const productDetails = getProductDetails(item.productId);
            const formattedDate = format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm:ss', { locale: th });
            return (
              <div key={item.id} className="rounded-xl border p-4 mb-4 cursor-pointer" onClick={() => openModal(item)}>
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <div className="flex flex-col">
                    <div className="flex items-center mb-2">
                      {productDetails?.file && (
                        <img src={productDetails.file} alt={productDetails.name} className="w-24 h-24 object-cover mr-4" />
                      )}
                      <p className="font-semibold mr-2">{productDetails?.ItemName}</p>
                      <p className="text-gray-600">({item.username})</p>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <div className="mr-4 mb-2 sm:mb-0">
                        <p className="">จำนวน: {item.amount} ชิ้น</p>
                      </div>
                      <div className="mr-4 mb-2 sm:mb-0">
                        <p className="">ราคารวม: {item.price} บาท</p>
                      </div>
                      <div>
                        <p className="">ที่อยู่: {getAddressDetails(item.addressId)}</p>
                        <div>
                          <p className="">เวลา: {formattedDate} น.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="button-group">
                    <button className="text-red-500 font-semibold" onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}>ยกเลิกคำสั่งซื้อนี้</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>✕</button>
          </form>
          {selectedItem ? (
            <div>
              <h3 className="font-bold text-lg">รายละเอียดคำสั่งซื้อ</h3>
              <p className="py-4">ชื่อผู้ใช้: {selectedItem.username}</p>
              <p className="py-4">ชื่อสินค้า: {getProductDetails(selectedItem.productId)?.ItemName}</p>
              {getProductDetails(selectedItem.productId)?.imageUrl && (
                <img src={getProductDetails(selectedItem.productId)?.imageUrl} alt={getProductDetails(selectedItem.productId)?.name} className="w-32 h-32 object-cover mt-4" />
              )}
              <p className="py-4">ราคา: {selectedItem.price}</p>
              <p className="py-4">จำนวน: {selectedItem.amount}</p>
              <p className="py-4">ที่อยู่: {getAddressDetails(selectedItem.addressId)}</p>
              <p className="py-4">เวลา: {format(new Date(selectedItem.createdAt), 'dd/MM/yyyy HH:mm:ss', { locale: th })} น.</p>
            </div>
          ) : (
            <p className="py-4">กรุณาเลือกคำสั่งซื้อเพื่อดูรายละเอียด</p>
          )}
        </div>
      </dialog>
    </div>
  );
}
