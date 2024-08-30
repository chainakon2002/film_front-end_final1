import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import provincesData from '../data/json/thai_provinces.json';
import amphuresData from '../data/json/thai_amphures.json';
import tambonsData from '../data/json/thai_tambons.json';

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
  const [filteredAmphures, setFilteredAmphures] = useState([]);
  const [filteredTambons, setFilteredTambons] = useState([]);
  const [zipcode, setZipcode] = useState('');
  const [editAddress, setEditAddress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const handleProvinceChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevState) => ({
      ...prevState,
      [name]: value,
      district: '', // Reset district when province changes
      tambon: '', // Reset tambon when province changes
      zipcode: '' // Reset zipcode when province changes
    }));

    const selectedProvince = provincesData.find(
      (province) => province.name_th === value
    );
    if (selectedProvince) {
      const filteredAmphures = amphuresData.filter(
        (amphur) => amphur.province_id === selectedProvince.id
      );
      setFilteredAmphures(filteredAmphures);
      setFilteredTambons([]); // Clear tambons when province changes
      setZipcode(''); // Clear zipcode when province changes
    } else {
      setFilteredAmphures([]);
      setFilteredTambons([]);
      setZipcode('');
    }
  };

  const handleDistrictChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevState) => ({
      ...prevState,
      [name]: value,
      tambon: '' // Reset tambon when district changes
    }));

    const selectedAmphur = filteredAmphures.find(
      (amphur) => amphur.name_th === value
    );
    if (selectedAmphur) {
      const filteredTambons = tambonsData.filter(
        (tambon) => tambon.amphure_id === selectedAmphur.id
      );
      setFilteredTambons(filteredTambons);
    } else {
      setFilteredTambons([]);
      setZipcode('');
    }
  };

  const handleTambonChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevState) => ({
      ...prevState,
      [name]: value
    }));

    const selectedTambon = tambonsData.find(
      (tambon) => tambon.name_th === value
    );
    if (selectedTambon) {
      setZipcode(selectedTambon.zip_code);
    } else {
      setZipcode('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:8889/auth/addUserAddress`, {
        ...newAddress,
        zipcode
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses((prevAddresses) => [...prevAddresses, response.data]);
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

  const openEditModal = (address) => {
    setEditAddress(address);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditAddress((prevState) => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'tambon') {
      const selectedTambon = tambonsData.find(
        (tambon) => tambon.name_th === value
      );
      if (selectedTambon) {
        setEditAddress((prevState) => ({
          ...prevState,
          zipcode: selectedTambon.zip_code
        }));
      } else {
        setEditAddress((prevState) => ({
          ...prevState,
          zipcode: ''
        }));
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8889/auth/updateUserAddress/${editAddress.id}`, editAddress, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses((prevAddresses) =>
        prevAddresses.map((address) =>
          address.id === editAddress.id ? editAddress : address
        )
      );
      setIsEditModalOpen(false); // Close modal after editing address
    } catch (error) {
      console.error('Error editing address:', error);
    }
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
            <h2 className="text-xl font-semibold text-gray-800 mb-2">ที่อยู่ {index + 1}</h2>
            <p className="text-gray-700"><strong>Name:</strong> {address.name} {address.lastname}</p>
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
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4">Add New Address</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <input
            type="text"
            name="name"
            value={newAddress.name}
            onChange={handleChange}
            placeholder="First Name"
            required
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            name="lastname"
            value={newAddress.lastname}
            onChange={handleChange}
            placeholder="Last Name"
            required
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            name="phone"
            value={newAddress.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            name="province"
            value={newAddress.province}
            onChange={handleProvinceChange}
            required
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Province</option>
            {provincesData.map((province) => (
              <option key={province.id} value={province.name_th}>
                {province.name_th}
              </option>
            ))}
          </select>
          <select
            name="district"
            value={newAddress.district}
            onChange={handleDistrictChange}
            required
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select District</option>
            {filteredAmphures.map((amphur) => (
              <option key={amphur.id} value={amphur.name_th}>
                {amphur.name_th}
              </option>
            ))}
          </select>
          <select
            name="tambon"
            value={newAddress.tambon}
            onChange={handleTambonChange}
            required
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Subdistrict</option>
            {filteredTambons.map((tambon) => (
              <option key={tambon.id} value={tambon.name_th}>
                {tambon.name_th}
              </option>
            ))}
          </select>
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
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            name="zipcode"
            value={zipcode}
            readOnly
            placeholder="Zipcode"
            required
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100"
          />
          <textarea
            name="other"
            value={newAddress.other}
            onChange={handleChange}
            placeholder="Other Details"
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full p-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
        >
          Save Address
        </button>
        <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="mt-4 w-full p-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300"
        >
          Cancel
        </button>
      </form>
    </div>
  </div>
)}


{/* Edit Address Modal */}
{isEditModalOpen && editAddress && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 overflow-auto">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-4 sm:mx-0">
      <h2 className="text-2xl font-semibold mb-4">Edit Address</h2>
      <div className="max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleEditSubmit}>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <input
              type="text"
              name="name"
              value={editAddress.name}
              onChange={handleEditChange}
              placeholder="First Name"
              required
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="lastname"
              value={editAddress.lastname}
              onChange={handleEditChange}
              placeholder="Last Name"
              required
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="phone"
              value={editAddress.phone}
              onChange={handleEditChange}
              placeholder="Phone Number"
              required
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              name="province"
              value={editAddress.province}
              onChange={handleEditChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Province</option>
              {provincesData.map((province) => (
                <option key={province.id} value={province.name_th}>
                  {province.name_th}
                </option>
              ))}
            </select>
            <select
              name="district"
              value={editAddress.district}
              onChange={handleEditChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select District</option>
              {filteredAmphures.map((amphur) => (
                <option key={amphur.id} value={amphur.name_th}>
                  {amphur.name_th}
                </option>
              ))}
            </select>
            <select
              name="tambon"
              value={editAddress.tambon}
              onChange={handleEditChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Subdistrict</option>
              {filteredTambons.map((tambon) => (
                <option key={tambon.id} value={tambon.name_th}>
                  {tambon.name_th}
                </option>
              ))}
            </select>
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
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="zipcode"
              value={editAddress.zipcode}
              readOnly
              placeholder="Zipcode"
              required
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100"
            />
            <textarea
              name="other"
              value={editAddress.other}
              onChange={handleEditChange}
              placeholder="Other Details"
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full p-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => setIsEditModalOpen(false)}
            className="mt-4 w-full p-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default UserProfile;
