import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './Productpict.css'
const Productpict = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);  // State for status modal
  const [selectedStatusOrder, setSelectedStatusOrder] = useState(null);  // Store order for status modal
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [loadingCancel, setLoadingCancel] = useState(false);

  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:8889/payment/paymentuser', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sortedOrders = response.data.sort((a, b) => new Date(b.order.date) - new Date(a.order.date));
                setOrders(sortedOrders);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching orders.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);


  const handleMarkAsDelivered = async (order) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        'http://localhost:8889/auth/updateorderstatus',
        { 
          orderId: order.orderId, 
          status: 'จัดส่งแล้ว' 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
     
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.orderId === order.orderId
            ? { ...o, order: { ...o.order, status: 'จัดส่งแล้ว' } }
            : o
        )
      );
      window.location.reload();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleCancelOrder = async () => {
    setLoadingCancel(true); // Show the loading spinner
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        'http://localhost:8889/auth/cancel',
        { 
          orderId: orderToCancel.orderId, 
          status: 'ยกเลิกแล้ว', 
          cancel: cancelReason
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.orderId === orderToCancel.orderId
            ? { ...o, order: { ...o.order, status: 'ยกเลิกแล้ว', cancel: cancelReason } }
            : o
        )
      );
      handleCloseCancelModal();
    } catch (error) {
      console.error('Error canceling order:', error);
    } finally {
      setLoadingCancel(false); 
    }
  };
  

  const handleOpenCancelModal = (order) => {
    setOrderToCancel(order);
    setCancelModalOpen(true);
  };
  
  const handleCloseCancelModal = () => {
    setCancelModalOpen(false);
    setCancelReason('');
    setOrderToCancel(null);
  };
  
  

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleOpenSlip = (slip) => {
    setSelectedSlip(slip);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  const handleCloseSlip = () => {
    setSelectedSlip(null);
  };

  const handleOpenStatusModal = (order) => {
    setSelectedStatusOrder(order);
    setStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setStatusModalOpen(false);
    setSelectedStatusOrder(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('th-TH') + ' ' + date.toLocaleTimeString('th-TH');
  };

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
                <p className="font-normal text-base leading-7 text-gray-500 mb-3">วันที่สั่งซื้อ</p>
                <h6 className="font-semibold font-manrope text-2xl leading-9 text-black">{formatDate(order.order.date)}</h6>
              </div>
              <div className="box">
                <p className="font-normal text-base leading-7 text-gray-500 mb-3">Order</p>
                <h6 className="font-semibold font-manrope text-2xl leading-9 text-black">#{order.orderId}</h6>
              </div>
              <div className="box cursor-pointer" onClick={() => handleOpenSlip(order.slip)}>
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
    <span className="text-red-600 cursor-pointer" onClick={() => handleOpenStatusModal(order)}> 
      {order.order.status}
    </span>
  </p>
  {order.order.status === "กำลังจัดส่ง" && (
    <button
      onClick={() => handleMarkAsDelivered(order)}
      className="px-2 py-4 bg-blue-500 text-white text-[20px] font-medium  rounded-[15px]"
    >
      ฉันได้รับสินค้าแล้ว
    </button>
  )}

{order.order.status === "รอดำเนินการ" && (
  <button
    onClick={() => handleOpenCancelModal(order)}
    className="px-2 py-4 bg-red-500 text-white text-[20px] font-medium rounded-[15px]"
  >
    ยกเลิกคำสั่งซื้อ
  </button>
)}
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
              <p className="mb-2"><strong>บ้านเลขที่:</strong> {selectedOrder.housenumber} </p>
              <p className="mb-2"><strong>รหัสรหัสไปรษณีย์:</strong> {selectedOrder.zipcode}</p>
            </div>
          </div>
        )}

{/* Cancel Modal */}
{cancelModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div
      className="fixed inset-0 bg-black opacity-50"
      onClick={handleCloseCancelModal}
    />
    <div
      className="bg-white p-12 rounded-lg shadow-lg z-10 relative max-w-3xl w-full"
      style={{ maxHeight: '80vh', overflowY: 'auto' }}
    >
      <button
        className="absolute top-4 right-4 text-gray-600 text-2xl"
        onClick={handleCloseCancelModal}
      >
        ×
      </button>
      <h2 className="text-2xl font-bold mb-6">เหตุผลการยกเลิกคำสั่งซื้อ</h2>
      <textarea
        value={cancelReason}
        onChange={(e) => setCancelReason(e.target.value)}
        className="w-full h-32 p-2 border border-gray-300 rounded-lg mb-6"
        placeholder="กรุณากรอกเหตุผลการยกเลิก"
      />
      <div className="flex justify-end">
        <button
          onClick={handleCancelOrder}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg"
          disabled={loadingCancel} // Disable the button while loading
        >
          {loadingCancel ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 16 0 8 8 0 0 1-16 0z"></path>
              </svg>
              Loading...
            </div>
          ) : (
            'ยืนยันการยกเลิก'
          )}
        </button>
      </div>
    </div>
  </div>
)}



        {/* Conditional rendering for slip */}
        {selectedSlip && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={handleCloseSlip}
            />
            <div
              className="bg-white p-12 rounded-lg shadow-lg z-10 relative max-w-3xl w-full"
              style={{ maxHeight: '80vh', overflowY: 'auto' }}
            >
              <button
                className="absolute top-4 right-4 text-gray-600 text-2xl"
                onClick={handleCloseSlip}
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-6">ใบเสร็จ</h2>
              <img
                src={selectedSlip}
                alt="Slip"
                className="w-full h-auto"
              />
            </div>
          </div>
        )}

        {/* Status Modal */}
        {statusModalOpen && selectedStatusOrder && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={handleCloseStatusModal}
            />
            <div
              className="bg-white p-12 rounded-lg shadow-lg z-10 relative max-w-3xl w-full"
              style={{ maxHeight: '80vh', overflowY: 'auto' }}
            >
              <button
                className="absolute top-4 right-4 text-gray-600 text-2xl"
                onClick={handleCloseStatusModal}
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-6">สถานะการสั่งซื้อ</h2>
              <p><strong>Order ID:</strong> #{selectedStatusOrder.orderId}</p>
              <p><strong>สถานะ:</strong> {selectedStatusOrder.order.status}</p>
              <p><strong>วันที่สั่งซื้อ:</strong> {formatDate(selectedStatusOrder.order.date)}</p>
              <p><strong>ประเภทการชำระเงิน:</strong> {selectedStatusOrder.pay}</p>
              <p><strong>ชื่อบริษัทขนส่ง:</strong> {selectedStatusOrder.order.shippingCompany}</p>
              <p><strong>รหัสติดตาม:</strong> {selectedStatusOrder.order.trackingNumber}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Productpict;
