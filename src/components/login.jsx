import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from "../config";
import { sendMsg } from "../functions/chatFunction.jsx";

function Login() {
    const baseURL = config.baseURL;
    const [userId, setUserId] = useState('');
    const [userData, setUserData] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            sendMsg(`User ${JSON.parse(storedUserData).Name} is online`,);
            navigate("/dashboard");
        }
    }, [1]);

    const handleLogin = async () => {
        try {
            const response = await fetch( `${baseURL}user-lists?userId=${userId}&password=${password}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.EXPO_PUBLIC_STRAPI_API_KEY}`
                },
            });
            const data = await response.json();
            if (userId && data.data[0].userId && data.data[0].isActive) {
                setUserData(data.data[0]);
                localStorage.setItem('userData', JSON.stringify(data.data[0]));
                if (!data.data[0].isTempPassword) {
                    sendMsg(`Someone logged in with user ID: ${userId}`);
                    navigate("/dashboard");
                } else {
                    sendMsg(`Someone logged in with user ID: ${userId} and redirected to change password page`);
                    navigate("/change-password");
                }
            } else {
                sendMsg(`Someone tried to login with incorrect user ID or password: ${userId}`);
                alert('Login Failed', 'Incorrect user ID or password.');
            }
        } catch (error) {
            sendMsg(`Someone tried to login with incorrect user ID or password: ${userId}`);
            alert('Login Failed', 'Incorrect user ID or password.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xs">
                <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
                <input
                    type="text"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Login
                </button>
            </div>
        </div>
    );
}

export default Login;