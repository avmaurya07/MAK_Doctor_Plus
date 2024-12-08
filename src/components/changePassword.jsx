import React, { useState } from "react";
import { data, useNavigate } from "react-router-dom";
import config from "../config";
import { sendMsg } from "../functions/chatFunction.jsx";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      console.log(userData);
      const response = await fetch(
        `${config.baseURL}user-lists/${userData.documentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.EXPO_PUBLIC_STRAPI_API_KEY}`,
          },
          body: JSON.stringify({
            data: { 

              password: newPassword,
              isTempPassword: false
               },
          }),
        }
      );

      if (response.ok) {
        sendMsg(`Password changed successfully: ${userData.Name}`);
        alert("Password changed successfully");
        localStorage.clear();
        navigate("/login");
      } else {
        alert("Failed to change password");
      }
    } catch (error) {
      alert("Failed to change password");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xs">
        <h1 className="text-2xl font-bold mb-4 text-center">Change Password</h1>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button
          onClick={handleChangePassword}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
