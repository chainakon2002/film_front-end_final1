// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useNavigate } from "react-router-dom";
// import './adminhome.css'
// import axios from 'axios';



  
  


// export default function adminhome() {
//   const [menutems, setMenutems] = useState([]);

//   useEffect(() => {
//     const fetchMenutems = async () => { // ปรับเปลี่ยนชื่อฟังก์ชันเป็น fetchMenutems
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get('http://localhost:8889/auth/getmenutems', {
//           headers: { Authorization: `Bearer ${token}` } 
//         });
        
//         setMenutems(response.data);
//       } catch (error) {
//         console.error('Error fetching menutems:', error);
//       }
//     };

//     fetchMenutems();
//   }, []); 


//   function ReseverdItem({ item }) {
//     const { Deletepro } = useContext(deletepro);
  
//     const hdlDelete = () => {
//       deleteReserved(item.id);
//       history.go(0);
//       alert("ลบสินค้าแล้ว");
//     };
//   }

//   return (
// <div className="  ">
//   <div className="flex flex-col justify-center items-center py-10">
//     <div className="">
//       <p className="text-[50px] font-semibold text-center">Admin</p>
//     </div>
//                   <div className="but">
//         {/* ปุ่มหรืออื่น ๆ ที่ต้องการเพิ่ม */}
//         <Link to={`/Add`}>
//         <button className="text-blue-500 font-semibold">เพิ่มสินค้า</button>
//         </Link>
//       </div>
//     <div className="container mx-auto mt-10 p-4">
//   {menutems.map((item) => (
//     <div key={item.id} className=" border p-4">

//         <div className="flex items-center justify-between border-b border-gray-200 pb-9 mb-2">
//         <div className='flex items-center'>
//         <img src={item.file} alt="" className="w-20 h-20 rounded-md mr-4" />
//         <div>
//               <p className="font-semibold">{item.ItemName}</p>
              
//             </div>
//         </div>
//         <div className="button-group">
//         {/* ปุ่มหรืออื่น ๆ ที่ต้องการเพิ่ม */}
//         <button  className="text-red-500 font-semibold" onClick={hdlDelete}>ลบ</button>
 
//       </div>
//       </div>
      
      
//     </div>
//   ))}
// </div>

//   </div>
// </div>


//   )
// }



import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Dashboard from './adminpage';
import './adminhome.css';

export default function AdminHome() {
 
  return (
    <div className="fade-in">
      <Dashboard />
    </div>
  );
}

