import React, { useEffect, useState } from 'react';
import config from "../config";
import Switch from 'react-switch';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('mak_doctor');

  const handleLogin = async () => {
    try {
      const response = await fetch(`${config.baseURL}user-lists`, {
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

  const handleDelete = async (userId) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    try {
      const response = await fetch(`${config.baseURL}user-lists/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${config.EXPO_PUBLIC_STRAPI_API_KEY}`
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      setUsers(users.filter(user => user.id !== userId));
      alert('User deleted successfully!');
      handleLogin();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSwitchChange = async (userId, isActive) => {

    try {
      const response = await fetch(`${config.baseURL}user-lists/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.EXPO_PUBLIC_STRAPI_API_KEY}`
        },
        body: JSON.stringify({ 
          data: { isActive: isActive }
        })
      });
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      handleLogin();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const filteredUsers = users.filter(user => user.userType === filter);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">User List</h1>
        <div className="mb-4">
          <label htmlFor="userType" className="mr-2">Filter by User Type:</label>
          <select
            id="userType"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="mak_doctor">Doctor</option>
            <option value="mak_employee">Employee</option>
          </select>
        </div>
        <ul>
          {filteredUsers.map(user => (
            <li key={user.id} className="mb-4 p-4 border border-gray-300 rounded">
              <p><strong>Name:</strong> {user.Name}</p>
              <p><strong>User ID:</strong> {user.userId}</p>
              <div className="flex items-center mb-4">
                <Switch
                  onChange={(checked) => handleSwitchChange(user.documentId, checked)}
                  checked={user.isActive}
                  onColor="#00FF00"
                  offColor="#FF0000"
                  uncheckedIcon={false}
                  checkedIcon={false}
                  handleDiameter={28}
                  height={20}
                  width={50}
                />
                <label className="ml-2">Active</label>
              </div>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleDelete(user.documentId)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Users;