import React, { useEffect, useState } from "react";
import config from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { sendMsg } from "../functions/chatFunction.jsx";

const PhoneCall = () => {
  const [users, setUsers] = useState([]);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${config.baseURL}ak`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.EXPO_PUBLIC_STRAPI_API_KEY}`,
        },
      });
      const data = await response.json();

      setUsers(data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    handleLogin();
  }, []);

  const handleMakeCall = (user) => {
    if (true) {
      sendMsg(`${JSON.parse(localStorage.getItem('userData')).Name} made a call to ${user.Name} on ${user.Mobile}`);
      window.location.href = `tel:${user.Mobile}`;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Today's Task</h1>
        <ul>
          {users.map((user,index) => (
            <li
          key={index}
          className="mb-4 p-6 border border-gray-200 rounded-xl shadow-md bg-white"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="flex-1 mb-4 sm:mb-0">
              <p className="text-base sm:text-lg font-semibold mb-2">
                <strong>S.No:</strong> {index+1}
              </p>
              <p className="text-base sm:text-lg font-semibold mb-2">
                <strong>ID No:</strong> {user.IDNo}
              </p>
              <p className="text-base sm:text-lg font-semibold mb-2">
                <strong>Name:</strong> {user.Name}
              </p>
              <p className="text-base sm:text-lg font-semibold mb-2">
                <strong>City:</strong> {user.City}
              </p>
              <p className="text-base sm:text-lg font-semibold mb-2">
                <strong>State:</strong> {user.State}
              </p>
              <p className="text-base sm:text-lg font-semibold mb-2">
                <strong>Join Date:</strong> {user.JoinDate}
              </p>
              <p className="text-base sm:text-lg font-semibold mb-2">
                <strong>Mobile:</strong> {user.Mobile}
              </p>
            </div>
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105 md:hidden"
              onClick={() => handleMakeCall(user)}
            >
              <FontAwesomeIcon icon={faPhone} className="mr-2" />
              Call
            </button>
          </div>
        </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PhoneCall;
