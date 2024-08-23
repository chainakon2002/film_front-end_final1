// import { Link, useNavigate } from 'react-router-dom'
// import useAuth from '../hooks/useAuth';

// export default function LoginForm() {
  
//     const { setUser } = useAuth()
//     const [input, setInput] = useState({
//       username : '', 
//       password : ''
//     })
  


  
//     return (
//       <div className="flex items-center justify-center h-screen mt-[-100px]">
//         {/* รูปภาพทางซ้าย */}
//         <div className="flex-none mr-40">
//           <img src="/src/assets/loginform.png" className="max-w-[600px] h-auto" />
//         </div>
    
//         {/* แบบฟอร์มทางขวา */}
//         <form className="flex flex-col justify-center items-center outline-none  border-20 w-[30rem] h-[30rem] rounded-[25px] shadow-md mt-20 ml-10 transition duration-500 ease-in-out transform" >
//             <h1>{user?.id ? user.username : ''}</h1>
//         </form>
//       </div>
//     );
    
    
    
//   }
  
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);

  const handleClick = (path) => {
    setClicked(true);
    setTimeout(() => {
      navigate(path);
      setClicked(false);
    }, 300); // Adjust timing to match your animation duration
  };

  return (
    <div className="bg-gradient-to-r from-pink-500 to-orange-400 p-8 rounded-lg shadow-lg text-center">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&display=swap');
        `}
      </style>
      <div className="my-4">
        <img
          src="https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png" // Replace with the actual image path
          alt="User"
          className="w-24 h-24 rounded-full mx-auto "
        />
        <h1 className="text-4xl font-bold my-2" style={{ fontFamily: 'Prompt, sans-serif' }}>
          {user?.id ? user.username : ''}
        </h1>
        <p className="text-lg font-light" style={{ fontFamily: 'Prompt, sans-serif' }}>
        {user?.id ? user.email : ''}
        </p>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <button
          className="bg-white text-gray-800 py-2 px-6 rounded-full transition-transform transform hover:scale-105"
          onClick={() => handleClick('/edit-profile')}
        >
          Edit Profile
        </button>
        <button
          className="bg-white text-gray-800 py-2 px-6 rounded-full transition-transform transform hover:scale-105"
          onClick={() => handleClick('/settings')}
        >
          Settings
        </button>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'Prompt, sans-serif' }}>
            ความเป็นส่วนตัวและการปรับเปลี่ยนในแบบของคุณ
          </h2>
          <p className="text-sm" style={{ fontFamily: 'Prompt, sans-serif' }}>
            ดูข้อมูลในบัญชี Google และเลือกกิจกรรมที่จะแสดงที่นี่เพื่อปรับเปลี่ยนประสบการณ์การใช้งาน Google ในแบบของคุณ
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'Prompt, sans-serif' }}>
            เคล็ดลับความปลอดภัยสำหรับคุณ
          </h2>
          <p className="text-sm" style={{ fontFamily: 'Prompt, sans-serif' }}>
            คำแนะนำเพื่อความปลอดภัยที่พบในหน้าการตรวจสอบความปลอดภัยสำหรับบัญชี
          </p>
        </div>
      </div>
    </div>
  );
}
