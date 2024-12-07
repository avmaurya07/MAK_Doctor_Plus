import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData1 = JSON.parse(localStorage.getItem('userData'));
    if (userData1 && userData1.userId) {
      setUserData(userData1);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md">
      {location.pathname !== '/dashboard' && (
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          onClick={handleBack}
        >
          Back
        </button>
      )}
      <div className="text-xl font-semibold text-gray-800 truncate w-1/2">Hello, {userData.Name}</div>
      <button 
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
        onClick={handleLogout}
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;