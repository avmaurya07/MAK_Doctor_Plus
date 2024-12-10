import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import config from "../config";
import Switch from "react-switch";

function Register() {
  const baseURL = config.baseURL;
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("mak_doctor");
  const [mak, setMak] = useState(300069);
  const [isMakOwner, setIsMakOwner] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    userId: "",
    role: "",
    mak: 300069,
    isMakOwner: false,
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData || userData.userType !== "admin") {
      navigate("/dashboard");
    }
  }, [1]);

  useEffect(() => {
    if (location.pathname === "/register-employee") {
      setRole("mak_employee");
      setIsMakOwner(false);
    }
    if (location.pathname === "/register-doctor") {
      setRole("mak_doctor");
    }
  }, [1]);

  const handleRegister = async () => {
    if (!name || !userId || !role) {
      alert("Please fill all the fields");
      return;
    }
    if (role === "Employee") {
      setNewUser({
        name: name,
        userId: userId,
        role: "mak_employee",
        mak: 300069,
        isMakOwner: isMakOwner,
      });
    }
    if (role === "Doctor") {
      setNewUser({
        name: name,
        userId: userId,
        role: "mak_doctor",
        mak: 300069,
        isMakOwner: false,
      });
    }
    try {
      const response = await fetch(`${baseURL}user-lists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.EXPO_PUBLIC_STRAPI_API_KEY}`,
        },
        body: JSON.stringify({
          data: {
            Name: name,
            userId: userId,
            userType: role,
            mak: mak,
            isActive: false,
            isMakOwner: isMakOwner,
          },
        }),
      });
      const data = await response.json();
      console.log(data.data);
      if (data.data.userId === userId) {
        alert("Registration Successful");
        navigate("/login");
      } else {
        alert("Registration Failed", data.message);
      }
    } catch (error) {
      alert("Registration Failed", "An error occurred.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xs">
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="number"
          placeholder="MAK Code"
          value={mak}
          onChange={(e) => setMak(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          disabled
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded bg-gray-200 text-gray-500 cursor-not-allowed"
          disabled
        >
          <option value="mak_doctor">Doctor</option>
          <option value="mak_employee">Employee</option>
        </select>
        {role === "mak_employee" && (
          <div className="flex items-center mb-4">
            <Switch
              onChange={()=>setIsMakOwner(!isMakOwner)}
              checked={isMakOwner}
              onColor="#00FF00"
              offColor="#FF0000"
              uncheckedIcon={false}
              checkedIcon={false}
              handleDiameter={28}
              height={20}
              width={50}
            />
            <label className="ml-2">Is MAK Owner</label>
          </div>
        )}
        <button
          onClick={handleRegister}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default Register;
