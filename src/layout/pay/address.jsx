import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';

const UserProfile = ({ id }) => {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    name: '',
    lastname: '',
    phone: '',
    province: '',
    district: '',
    tambon: '',
    housenumber: '',
    village: '',
    zipcode: '',
    other: ''
  });
  const [editAddress, setEditAddress] = useState(null); // State for managing address being edited
  const [isModalOpen, setIsModalOpen] = useState(false); // State for controlling new address modal visibility
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for controlling edit address modal visibility

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8889/auth/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);

        const addressResponse = await axios.get(`http://localhost:8889/auth/useraddress`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAddresses(addressResponse.data);
      } catch (error) {
        console.error('Error fetching user or address:', error);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditAddress(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:8889/auth/addUserAddress`, newAddress, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(prevAddresses => [...prevAddresses, response.data]);
      setNewAddress({
        name: '',
        lastname: '',
        phone: '',
        province: '',
        district: '',
        tambon: '',
        housenumber: '',
        village: '',
        zipcode: '',
        other: ''
      });
      setIsModalOpen(false); // Close modal after adding address
    } catch (error) {
      console.error('Error adding new address:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:8889/auth/updateUserAddress/${editAddress.id}`, editAddress, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(prevAddresses =>
        prevAddresses.map(addr => addr.id === response.data.id ? response.data : addr)
      );
      setEditAddress(null);
      setIsEditModalOpen(false); // Close edit modal after updating address
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const openEditModal = (address) => {
    setEditAddress(address);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg mt-16">
      {user && (
        <div className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">User Profile</h1>
          <p className="text-gray-600 text-lg"><strong>Name:</strong> {user.name}</p>
          <p className="text-gray-600 text-lg"><strong>Email:</strong> {user.email}</p>
        </div>
      )}

      {addresses.length > 0 ? (
        addresses.map((address, index) => (
          <div key={index} className="mb-6 p-6 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Address {index + 1}</h2>
            <p className="text-gray-700"><strong>Name:</strong> {address.name}</p>
            <p className="text-gray-700"><strong>Phone:</strong> {address.phone}</p>
            <p className="text-gray-700"><strong>Province:</strong> {address.province}</p>
            <p className="text-gray-700"><strong>District:</strong> {address.district}</p>
            <p className="text-gray-700"><strong>Tambon:</strong> {address.tambon}</p>
            <p className="text-gray-700"><strong>House Number:</strong> {address.housenumber}</p>
            <p className="text-gray-700"><strong>Village:</strong> {address.village}</p>
            <p className="text-gray-700"><strong>Zipcode:</strong> {address.zipcode}</p>
            <p className="text-gray-700"><strong>Other Details:</strong> {address.other}</p>
            <button
              onClick={() => openEditModal(address)}
              className="mt-4 text-blue-500 hover:text-blue-700 flex items-center space-x-2"
            >
              <FaEdit />
              <span>Edit</span>
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No addresses found</p>
      )}

      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full mt-6 p-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
      >
        Add New Address
      </button>

      {/* New Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg overflow-y-auto max-h-[80vh]">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Address</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={newAddress.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="lastname"
                value={newAddress.lastname}
                onChange={handleChange}
                placeholder="Lastname"
                required
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="phone"
                value={newAddress.phone}
                onChange={handleChange}
                placeholder="Phone"
                required
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="province"
                value={newAddress.province}
                onChange={handleChange}
                placeholder="Province"
                required
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="district"
                value={newAddress.district}
                onChange={handleChange}
                placeholder="District"
                required
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="tambon"
                value={newAddress.tambon}
                onChange={handleChange}
                placeholder="Tambon"
                required
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="housenumber"
                value={newAddress.housenumber}
                onChange={handleChange}
                placeholder="House Number"
                required
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="village"
                value={newAddress.village}
                onChange={handleChange}
                placeholder="Village"
                required
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="zipcode"
                value={newAddress.zipcode}
                onChange={handleChange}
                placeholder="Zipcode"
                required
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="other"
                value={newAddress.other}
                onChange={handleChange}
                placeholder="Other Details"
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Address Modal */}
      {isEditModalOpen && editAddress && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg overflow-y-auto max-h-[80vh]">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Address</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={editAddress.name}
                onChange={handleEditChange}
                placeholder="Name"
                required
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="lastname"
                value={editAddress.lastname}
                onChange={handleEditChange}
                placeholder="Lastname"
                required
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="phone"
                value={editAddress.phone}
                onChange={handleEditChange}
                placeholder="Phone"
                required
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="province"
                value={editAddress.province}
                onChange={handleEditChange}
                placeholder="Province"
                required
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="district"
                value={editAddress.district}
                onChange={handleEditChange}
                placeholder="District"
                required
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="tambon"
                value={editAddress.tambon}
                onChange={handleEditChange}
                placeholder="Tambon"
                required
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="housenumber"
                value={editAddress.housenumber}
                onChange={handleEditChange}
                placeholder="House Number"
                required
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="village"
                value={editAddress.village}
                onChange={handleEditChange}
                placeholder="Village"
                required
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="zipcode"
                value={editAddress.zipcode}
                onChange={handleEditChange}
                placeholder="Zipcode"
                required
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="other"
                value={editAddress.other}
                onChange={handleEditChange}
                placeholder="Other Details"
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
