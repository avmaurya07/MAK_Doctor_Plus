import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const userData1 = JSON.parse(localStorage.getItem('userData'));
    if (userData1 && userData1.userId) {
      setUserData(userData1);
    } else {
      navigate('/login');
    }
  }, [1]);

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  const handleRegisterMak = () => {
    navigate('/register-mak');
  };

  const handleRegisterDoctor = () => {
    navigate('/register-doctor');
  };

  const handleRegisterEmployee = () => {
    navigate('/register-employee');
  };
  const handleViewUsers = () => {
    navigate('/users');
  };
  const handlephoneCall = () => {
    navigate('/phoneCall');
  };
  const handlepayment = () => {
    navigate('/payments');
  };

  const handleBookAppointment = () => {
    navigate('/book-appointment');
  };

  const handleViewAppointments = () => {
    navigate('/view-appointments');
  };

  const handleScanQR = () => {
    navigate('/QRScanner');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xs">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {userData.userType === 'mak_doctor' ? 'Doctor' : 
           userData.userType === 'admin' ? 'Admin' : 
           userData.userType === 'mak_employee' ? (userData.isMakOwner ? "MAK's" : 'Employee') : ''} Dashboard
        </h1>
        <ul className="space-y-4">
          {(userData.userType === 'admin') && (<>
            <li 
              onClick={handlephoneCall} 
              className="cursor-pointer p-4 bg-white text-black rounded flex justify-between items-center hover:bg-gray-200 border border-gray-300 md:hidden"
            >
              Phone Call
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li 
              onClick={handleRegisterDoctor} 
              className="cursor-pointer p-4 bg-white text-black rounded flex justify-between items-center hover:bg-gray-200 border border-gray-300"
            >
              Add Doctor
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li 
              onClick={handleRegisterEmployee} 
              className="cursor-pointer p-4 bg-white text-black rounded flex justify-between items-center hover:bg-gray-200 border border-gray-300"
            >
              Add Employee
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li 
              onClick={handleViewUsers} 
              className="cursor-pointer p-4 bg-white text-black rounded flex justify-between items-center hover:bg-gray-200 border border-gray-300"
            >
              View Users
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            </>
          )}
          {(userData.userType === 'admin' || userData.userType==='mak_employee') && (<>
           {(userData.userId==='300069' || userData.userId==='300069-gullan') && <li 
              onClick={handlephoneCall} 
              className="cursor-pointer p-4 bg-white text-black rounded flex justify-between items-center hover:bg-gray-200 border border-gray-300 md:hidden"
            >
              Phone Call
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </li>}
           {(userData.userId==='admin') && <li 
              onClick={handlepayment} 
              className="cursor-pointer p-4 bg-white text-black rounded flex justify-between items-center hover:bg-gray-200 border border-gray-300"
            >
              Payments
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </li>}
          {(userData.userId !== '300069-gullan') && <li 
            onClick={handleBookAppointment} 
            className="cursor-pointer p-4 bg-white text-black rounded flex justify-between items-center hover:bg-gray-200 border border-gray-300"
          >
            Book Appointments
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </li>}
          </>)}
          {(userData.userType === 'mak_doctor') && (
            <li 
              onClick={handleScanQR} 
              className="cursor-pointer p-4 bg-white text-black rounded flex justify-between items-center hover:bg-gray-200 border border-gray-300 md:hidden"
            >
              Scan QR
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </li>
          )}
          {(userData.userId !== '300069-gullan') && <li 
            onClick={handleViewAppointments} 
            className="cursor-pointer p-4 bg-white text-black rounded flex justify-between items-center hover:bg-gray-200 border border-gray-300"
          >
            View Appointments
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </li>}
          {(userData.userId==='300069' || userData.userId==='300069-gullan') && <li 
            onClick={handleChangePassword} 
            className="cursor-pointer p-4 bg-white text-black rounded flex justify-between items-center hover:bg-gray-200 border border-gray-300"
          >
            Change Password
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </li>}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;