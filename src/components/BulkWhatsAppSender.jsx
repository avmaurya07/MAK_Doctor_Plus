import React, { useEffect, useState } from 'react';
import config from "../config";

const Users = () => {
  const [users, setUsers] = useState([]);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${config.baseURL}ak`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.EXPO_PUBLIC_STRAPI_API_KEY}`
        },
      });
      const data = await response.json();
      
      setUsers(data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    handleLogin();
  }, []);

const handleMakeCall = (user) => {
  const confirmed = window.confirm(`Do you want to make a call to ${user.Name}?`);
  if (confirmed) {
    window.location.href = `tel:${user.Mobile}`;
  }

  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">User List</h1>
        <ul>
          {users.map(user => (
            <li key={user.Sno} className="mb-4 p-4 border border-gray-300 rounded">
              <p><strong>S.No:</strong> {user.Sno}</p>
              <p><strong>Name:</strong> {user.Name}</p>
              <p><strong>Mobile:</strong> {user.Mobile}</p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
                onClick={() => handleMakeCall(user)}
              >
                Make call
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Users;