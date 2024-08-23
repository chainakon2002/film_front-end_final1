import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function AdminProduct() {
  const navigate = useNavigate();

  const [input, setInput] = useState({
    ItemName: '',
    price: '',
    description: '',
    stock: '',
  });
  const [file, setFile] = useState(null); // Set initial state to null

  const hdlChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const hdlFileChange = (e) => {
    setFile(e.target.files[0]); // Use setFile to set the file directly
  };

  const hdlSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('ItemName', input.ItemName);
    formData.append('description', input.description);
    formData.append('price', input.price);
    formData.append('stock', input.stock);

    if (file) {
      formData.append('image', file); // Append the file object
    }

    try {
      const rs = await axios.post('http://localhost:8889/auth/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(rs);
      if (rs.status === 200) {
        Swal.fire({
          title: 'เพิ่มข้อมูลเรียบร้อย',
          showClass: {
            popup: 'animate__animated animate__fadeInUp animate__faster',
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutDown animate__faster',
          },
        });
        navigate('/adminshow');
      }
    } catch (err) {
      console.error(err.message);
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'An error occurred',
        icon: 'error',
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl mb-5"></div>
      <form
        className="flex h-[calc(100vh-95px)] flex-col justify-center items-center outline-none border-10 w-[30rem] h-[30rem] rounded-lg shadow-md mt-20 transition duration-500 ease-in-out transform"
        onSubmit={hdlSubmit}
      >
        <p className="font-semibold text-base text-[#5473E3] text-center">เพิ่มสินค้า</p>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">ชื่อสินค้า</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            name="ItemName"
            value={input.ItemName}
            onChange={hdlChange}
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">ราคา</span>
          </div>
          <input
            type="number"
            className="input input-bordered w-full max-w-xs"
            name="price"
            value={input.price}
            onChange={hdlChange}
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">รายละเอียด</span>
          </div>
          <textarea
            className="textarea textarea-bordered w-full max-w-xs"
            name="description"
            value={input.description}
            onChange={hdlChange}
            rows={4}
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">จำนวนสินค้า</span>
          </div>
          <input
            type="number"
            className="input input-bordered w-full max-w-xs"
            name="stock"
            value={input.stock}
            onChange={hdlChange}
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">รูปภาพ</span>
          </div>
          <input
            type="file"
            className="input input-bordered w-full max-w-xs"
            name="fileInput"
            onChange={hdlFileChange}
          />
        </label>
        <div className="flex gap-5">
          <button type="submit" className="btn btn-outline btn-info mt-7">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
