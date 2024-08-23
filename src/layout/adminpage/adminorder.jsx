import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null); // State for expanded order
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8889/auth/getorderadmin', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, [token]);

    const handleToggleExpand = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">คำสั่งซื้อทั้งหมด</h1>
            {orders.length > 0 ? (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div className="bg-white p-4 rounded-lg shadow-md overflow-hidden" key={order.id}>
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    {order.order.ordercart.map(cartItem => (
                                        <img
                                            key={cartItem.id}
                                            src={cartItem.product.file}
                                            alt={cartItem.product.ItemName}
                                            className="w-32 h-32 object-cover rounded-lg mr-4"
                                        />
                                    ))}
                                </div>
                                <div className="flex-1 ml-4">
                                    <h2 className="text-xl font-semibold mb-2">Order ID: {order.orderId}</h2>
                                    <p><strong>Status:</strong> {order.status}</p>
                                    <p><strong>User ID:</strong> {order.userId}</p>
                                    <p><strong>Payment Method:</strong> {order.pay}</p>
                                    <p><strong>Total Price:</strong> {order.order.price_all} บาท</p>
                                    <p><strong>Date:</strong> {new Date(order.order.date).toLocaleDateString()}</p>
                                    {expandedOrderId === order.orderId && (
                                        <div className="mt-4">
                                            <div className="mt-2">
                                                <h3 className="text-lg font-semibold mb-1">Address:</h3>
                                                <p><strong>House Number:</strong> {order.address.housenumber}</p>
                                                <p><strong>Tambon:</strong> {order.address.tambon}</p>
                                                <p><strong>District:</strong> {order.address.district}</p>
                                                <p><strong>Province:</strong> {order.address.province}</p>
                                                <p><strong>Zip Code:</strong> {order.address.zipcode}</p>
                                            </div>
                                            <div className="mt-4">
                                                <h3 className="text-lg font-semibold mb-2">สินค้า:</h3>
                                                {order.order.ordercart.map(cartItem => (
                                                    <div className="flex items-center mb-4" key={cartItem.id}>
                                                        <div className="flex-1">
                                                            <h4 className="text-md font-medium">{cartItem.product.ItemName}</h4>
                                                            <p><strong>Quantity:</strong> {cartItem.total}</p>
                                                            <p><strong>Price:</strong> {cartItem.price} บาท</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => handleToggleExpand(order.orderId)}
                                        className="mt-4 text-blue-500 hover:text-blue-700 focus:outline-none"
                                    >
                                        {expandedOrderId === order.orderId ? 'ย่อ' : 'ดูข้อมูลทั้งหมด'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-700">ไม่มีคำสั่งซื้อในขณะนี้</p>
            )}
        </div>
    );
};

export default OrdersPage;
