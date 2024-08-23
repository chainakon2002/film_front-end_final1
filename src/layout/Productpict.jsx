import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Productpict = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:8889/payment/paymentuser', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching orders.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="py-24 relative">
      <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
        <h2 className="font-manrope font-bold text-3xl sm:text-4xl leading-10 text-black mb-11">รายการสั่งซื้อ</h2>

        {orders.length === 0 && <p>No orders found.</p>}

        {orders.map((order) => (
          <motion.div
            key={order.id}
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8 py-6 border-y border-gray-100 mb-6">
              <div className="box">
                <p className="font-normal text-base leading-7 text-gray-500 mb-3">วัน/เดือน/ปี</p>
                <h6 className="font-semibold font-manrope text-2xl leading-9 text-black">{new Date(order.order.date).toLocaleDateString()}</h6>
              </div>
              <div className="box">
                <p className="font-normal text-base leading-7 text-gray-500 mb-3">Order</p>
                <h6 className="font-semibold font-manrope text-2xl leading-9 text-black">#{order.orderId}</h6>
              </div>
              <div className="box">
                <p className="font-normal text-base leading-7 text-gray-500 mb-3">ประเภทชำระเงิน</p>
                <h6 className="font-semibold font-manrope text-2xl leading-9 text-black">{order.pay}</h6>
              </div>
              <div className="box cursor-pointer" onClick={() => handleOpenDetails(order.address)}>
                <p className="font-normal text-base leading-7 text-gray-500 mb-3">ผู้รับและที่อยู่</p>
                <h6 className="font-semibold font-manrope text-[30px] leading-9 text-black">
                  {order.address.name} {order.address.lastname}
                </h6>
                <h6 className="font-semibold font-manrope text-[22px] leading-9 text-black-500">
                  {order.address.phone}
                </h6>
              </div>
            </div>

            <div className="grid grid-cols-7 w-full pb-6 border-b border-gray-100 gap-4">
              {order.order.ordercart.map((cartItem) => (
                <motion.div
                  key={cartItem.id}
                  className="col-span-7 min-[500px]:col-span-2 md:col-span-1 border border-gray-200 rounded-[15px] p-4 flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <img
                    src={cartItem.product.file}
                    alt={cartItem.product.ItemName}
                    className="w-full rounded-lg object-cover mb-2"
                  />
                  <p className="text-sm font-semibold text-gray-700">{cartItem.product.ItemName}</p>
                </motion.div>
              ))}
            </div>
           
           
            <motion.div
  className="flex items-center justify-between py-6 border-y border-gray-100"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
<p className="font-manrope font-semibold text-2xl leading-9 text-gray-900">
    <span className="text-gray-900">สถานะ :</span> 
    <span className="text-red-600"> {order.order.status}</span>
  </p>
  <div className="flex items-center">
    <p className="font-manrope font-semibold text-2xl leading-9 text-gray-900 mr-4">
      ราคารวม
    </p>
    <p className="font-manrope font-bold text-2xl leading-9 text-indigo-700">
      {order.order.price_all} บาท
    </p>
  </div>
</motion.div>





          </motion.div>
        ))}

{/* Conditional rendering for order details */}
{selectedOrder && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div
      className="fixed inset-0 bg-black opacity-50"
      onClick={handleCloseDetails}
    />
    <div
      className="bg-white p-12 rounded-lg shadow-lg z-10 relative max-w-3xl w-full"
      style={{ maxHeight: '80vh', overflowY: 'auto' }}
    >
      <button
        className="absolute top-4 right-4 text-gray-600 text-2xl"
        onClick={handleCloseDetails}
      >
        ×
      </button>
      <h2 className="text-2xl font-bold mb-6">รายละเอียดที่อยู่</h2>
      <p className="mb-2"><strong>ชื่อ:</strong> {selectedOrder.name}</p>
      <p className="mb-2"><strong>นามสกุล:</strong> {selectedOrder.lastname}</p>
      <p className="mb-2"><strong>โทรศัพท์:</strong> {selectedOrder.phone}</p>
      <p className="mb-2"><strong>จังหวัด:</strong> {selectedOrder.province}</p>
      <p className="mb-2"><strong>อำเภอ:</strong> {selectedOrder.district}</p>
      <p className="mb-2"><strong>ตำบล:</strong> {selectedOrder.tambon}</p>
      <p className="mb-2"><strong>บ้านเลขที่:</strong> {selectedOrder.housenumber}</p>
      <p className="mb-2"><strong>หมู่บ้าน:</strong> {selectedOrder.village}</p>
      <p className="mb-2"><strong>รหัสไปรษณีย์:</strong> {selectedOrder.zipcode}</p>
      <p className="mb-2"><strong>อื่นๆ:</strong> {selectedOrder.other}</p>
    </div>
  </div>
)}

      </div>
    </section>
  );
};

export default Productpict;
