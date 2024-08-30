import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Paymentall.css';

function Paymentcarts() {
    const location = useLocation();
    const carts = location.state.selectedCartItems;
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [slipImage, setSlipImage] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await axios.get('http://localhost:8889/auth/useraddress', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAddresses(response.data);
            } catch (err) {
                console.error('Error fetching addresses:', err);
            }
        };

        fetchAddresses();
    }, [token]);

    const all_total = () => {
        const tl = carts.reduce((e, i) => e + i.total, 0);
        const pr = carts.reduce((e, i) => e + i.price, 0);

        return (
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm mt-4">
                <h1 className="text-lg font-semibold">จำนวนรวม: {tl}</h1>
                <h1 className="text-lg font-semibold">ราคารวม: {pr}</h1>
            </div>
        );
    };

    const orderFn = async () => {
        try {
            const tl = carts.reduce((e, i) => e + i.total, 0);
            const pr = carts.reduce((e, i) => e + i.price, 0);
            const rs = await axios.post('http://localhost:8889/order/order', {
                total_all: tl,
                price_all: pr,
                status: 'รอดำเนินการ',
                shippingCompany: '*',
                trackingNumber: '*',
                cancel: '*',
                cancelstore: '*',
                date: new Date()
            });
            ordercartFn(rs.data.orders.id);
        } catch (err) {
            console.error('Error placing order:', err);
        }
    };

    const ordercartFn = async (id) => {
        try {
            await Promise.all(
                carts.map(async (m) => {
                    await axios.post('http://localhost:8889/order/ordercart', {
                        price: m.price,
                        total: m.total,
                        userId: m.UserId,
                        productId: m.productId,
                        orderId: id
                    });
                })
            );
            deletecartFn();
            updatestockFn();
            PaymentFn(id);
        } catch (err) {
            console.error('Error processing order cart:', err);
        }
    };

    const deletecartFn = async () => {
        try {
            await Promise.all(
                carts.map(async (m) => {
                    await axios.delete(`http://localhost:8889/cart/carts/${m.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                })
            );
        } catch (err) {
            console.error('Error deleting cart:', err);
        }
    };

    const PaymentFn = async (id) => {
        try {
            const userid = localStorage.getItem('userId');
            const paymentData = {
                status: 'ชำระแล้ว',
                userId: userid,
                pay: paymentMethod,
                addressId: selectedAddress.id,
                orderId: id,
            };

            if (slipImage) {
                paymentData.slip = slipImage;
            }

            await axios.post('http://localhost:8889/payment/payments', paymentData);
            Swal.fire({
                title: 'สั่งซื้อสำเร็จ!',
                text: 'สินค้าของคุณได้ถูกสั่งซื้อแล้ว.',
                icon: 'success'
            });
            navigate('/product01');
        } catch (err) {
            console.error('Error processing payment:', err);
            Swal.fire({
                title: 'เกิดข้อผิดพลาด!',
                text: 'ไม่สามารถดำเนินการชำระเงินได้ กรุณาลองใหม่.',
                icon: 'error'
            });
        }
    };

    const updatestockFn = async () => {
        try {
            await Promise.all(
                carts.map(async (m) => {
                    const stocks = m.product.stock - m.total;
                    await axios.put(`http://localhost:8889/auth/products/${m.product.id}`, {
                        stock: stocks
                    });
                })
            );
        } catch (err) {
            console.error('Error updating stock:', err);
        }
    };

    const handleOrderConfirmation = () => {
        if (paymentMethod === 'โอนจ่าย') {
            setShowModal(true);
        } else {
            Swal.fire({
                title: 'คุณแน่ใจหรือไม่?',
                text: "คุณต้องการยืนยันการสั่งซื้อนี้หรือไม่?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
            }).then((result) => {
                if (result.isConfirmed) {
                    orderFn()
                        .catch((error) => {
                            Swal.fire({
                                title: 'เกิดข้อผิดพลาด!',
                                text: 'ไม่สามารถสั่งซื้อได้ กรุณาลองใหม่.',
                                icon: 'error'
                            });
                        });
                }
            });
        }
    };

    const handleSlipUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setSlipImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleConfirmWithSlip = () => {
        setShowModal(false);
        orderFn();
    };
    
    return (
        <div className='mt-[130px] p-6 bg-gray-50'>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {carts.map(m => (
                    <div key={m.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                        <img src={m.product.file} alt="" className="w-36 h-36 rounded-md mb-4" />
                        <p className="text-gray-700">จำนวน: {m.total}</p>
                        <p className="text-gray-700">ราคา: {m.price}</p>
                    </div>
                ))}
            </div>
            <div className='text-center mt-6'>
                {all_total()}
            </div>
            <div className="mt-8">
                <h2 className="text-xl font-medium text-gray-800 mb-2">เลือกที่อยู่ที่ต้องการจัดส่ง</h2>
                <select onChange={(e) => setSelectedAddress(JSON.parse(e.target.value))} className="w-full p-2 border rounded">
                    <option value="">เลือกที่อยู่</option>
                    {addresses.map(address => (
                        <option key={address.id} value={JSON.stringify(address)}>
                            {address.name} - {address.province}
                        </option>
                    ))}
                </select>
                {selectedAddress && (
                    <div className="bg-white p-4 rounded-lg shadow-sm mt-4">
                        <h2 className="text-xl font-medium text-gray-800 mb-2">Address Details</h2>
                        <p className="text-gray-600"><strong>ชื่อ:</strong> {selectedAddress.name}</p>
                        {/* Add more address details here */}
                    </div>
                )}

                <h2 className="text-xl font-medium text-gray-800 mb-2 mt-6">เลือกช่องทางการชำระเงิน</h2>
                <select onChange={(e) => setPaymentMethod(e.target.value)} className="w-full p-2 border rounded">
                    <option value="">เลือกช่องทางการชำระเงิน</option>
                    <option value="จ่ายปลายทาง">จ่ายปลายทาง</option>
                    <option value="โอนจ่าย">โอนจ่าย</option>
                </select>

                <button onClick={handleOrderConfirmation} className="w-full mt-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    สั่งซื้อ
                </button>
            </div>

            {showModal && (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 mt-[90px]">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">อัพโหลดสลิปการโอนเงิน</h2>
            <img src="/src/assets/pay.jpg" alt="Example Slip" className="w-full h-auto mb-4 border border-gray-200 rounded-lg shadow-sm" />
            <input
                type="file"
                accept="image/*"
                onChange={handleSlipUpload}
                className="block w-full mb-4 text-gray-800"
            />
            {slipImage && (
                <div className="mt-4 flex justify-center">
                    <img src={slipImage} alt="Slip" className="max-w-full max-h-60 object-contain border border-gray-300 rounded-lg shadow-sm" />
                </div>
            )}
            <div className="flex justify-between mt-6">
                <button
                    onClick={handleConfirmWithSlip}
                    className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                    ยืนยันการสั่งซื้อ
                </button>
                <button
                    onClick={() => setShowModal(false)}
                    className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                    ยกเลิก
                </button>
            </div>
        </div>
    </div>
)}


        </div>
    );
}

export default Paymentcarts;
