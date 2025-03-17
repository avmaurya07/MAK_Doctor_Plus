import React, { useState } from 'react';
import config from "../config";

const SCMLogin = () => {
  const [storeCode, setStoreCode] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`${config.baseURL}scm-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ storeCode }),
      });

      if (response.ok) {
        const data = await response.json(); // Await JSON parsing only once

        if (data.info.scmType === "Branch" || data.info.scmType === "Mega Ayurvedic Kendra") {
          window.open("https://imcbusiness.com/Distributor/WelcomePage", "_blank");
        } else if (data.info.scmType === "Ayurvedic Kendra") {
          window.open("https://imcbusiness.com/AyurvedicKendra/WelcomePage", "_blank");
        }
      } else {
        console.error("Login failed");
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">SCM Login</h1>
        <div className="mb-4">
          <label htmlFor="storeCode" className="block text-gray-700 font-medium mb-2">
            Enter Store Code:
          </label>
          <input
            type="text"
            id="storeCode"
            value={storeCode}
            onChange={(e) => setStoreCode(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Store Code"
          />
        </div>
        <button
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default SCMLogin;
