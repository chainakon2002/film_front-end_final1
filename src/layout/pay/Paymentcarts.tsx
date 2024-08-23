import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Paymentcarts() {
    const location = useLocation();
    const carts = location.state.selectedCartItems;
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    useEffect(() => {
        // Fetch user addresses when the component loads
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
                status: 'กำลังจัดส่ง',
                date: new Date()
            });
            console.log(rs.data);
            ordercartFn(rs.data.orders.id);
        } catch (err) {
            console.error(err);
        }
    };

    const ordercartFn = async (id) => {
        carts.map(async (m) => {
            await axios.post('http://localhost:8889/order/ordercart', {
                price: m.price,
                total: m.total,
                userId: m.UserId,
                productId: m.productId,
                orderId: id
            });
        });
        deletecartFn();
        updatestockFn();
        PaymentFn(id);
    };

    const deletecartFn = async () => {
        carts.map(async (m) => {
            await axios.delete(`http://localhost:8889/cart/carts/${m.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
        });
    };

    const PaymentFn = async (id) => {
        const userid = localStorage.getItem('userId');
        await axios.post('http://localhost:8889/payment/payments', {
            status: 'ชำระแล้ว',
            userId: userid,
            pay: 'จ่ายปลายทาง',
            addressId: selectedAddress.id,  // Use selected address ID
            orderId: id
        });
        navigate('/product01');
    };

    const updatestockFn = async () => {
        carts.map(async (m) => {
            const stocks = m.product.stock - m.total;
            await axios.put(`http://localhost:8889/auth/products/${m.product.id}`, {
                stock: stocks
            });
        });
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
                        <p className="text-gray-600"><strong>เบอร์โทร:</strong> {selectedAddress.phone}</p>
                        <p className="text-gray-600"><strong>จังหวัด:</strong> {selectedAddress.province}</p>
                        <p className="text-gray-600"><strong>อำเภอ:</strong> {selectedAddress.district}</p>
                        <p className="text-gray-600"><strong>ตำบล:</strong> {selectedAddress.tambon}</p>
                        <p className="text-gray-600"><strong>เลขที่:</strong> {selectedAddress.housenumber}</p>
                        <p className="text-gray-600"><strong>หมู่ที่:</strong> {selectedAddress.village}</p>
                        <p className="text-gray-600"><strong>รหัสไปรษณีย์:</strong> {selectedAddress.zipcode}</p>
                        <p className="text-gray-600"><strong>รายละเอียด:</strong> {selectedAddress.other}</p>
                    </div>
                )}
                <button onClick={orderFn} className="w-full mt-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    ชำระ555
                </button>
            </div>
        </div>
    );
}

export default Paymentcarts;
