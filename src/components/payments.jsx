import React, { useEffect, useState } from "react";
import config from "../config";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [amount, setAmount] = useState("0.00");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [colo, setColo] = useState("white");
  const [showQR, setShowQR] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.baseURL}payment`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setPayments(data.data || []);
      if (data.amount === "NaN") {
        window.location.reload();
      }
      if (data.amount[0] === "-") {
        setColo("green");
        setAmount(data.amount.slice(1));
      } else {
        setColo("red");
        setAmount(data.amount);
      }
    } catch (err) {
      setError("Failed to fetch payments");
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const shareQR = async () => {
    try {
      const response = await fetch("https://raw.githubusercontent.com/avmaurya07/MAK_Doctor_Plus/refs/heads/main/public/upi_1741692439227.png");
      const blob = await response.blob();
      const file = new File([blob], "qr.png", { type: blob.type });
  
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          title: "QR Code",
          text: "Scan this QR code for payment.",
          files: [file],
        }).catch((error) => console.error("Error sharing:", error));
      } else {
        alert("Sharing files is not supported on this browser.");
      }
    } catch (error) {
      console.error("Error fetching QR code image:", error);
      alert("Failed to load QR code for sharing.");
    }
  };  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Payments <span className={`bg-${colo}-500 px-2 py-1 rounded text-white`}>(₹ {amount})</span></h1>
          <button
            onClick={() => setShowQR(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
          >
            QR
          </button>
        </div>
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && payments.length === 0 && (
          <p className="text-center text-gray-500">No payments for today</p>
        )}
        {!loading && !error && payments.length > 0 && (
          <ul>
            {payments.map((payment, index) => (
              <li
                key={index}
                className="mb-4 p-6 border border-gray-200 rounded-xl shadow-md bg-white"
              >
                <p className="text-lg font-semibold">
                  <strong>Transaction ID:</strong> {payment[1]}
                </p>
                <p className="text-lg font-semibold bg-green-500">
                  <strong>Amount:</strong> {payment[2]}
                </p>
                <p className="text-lg font-semibold">
                  <strong>Date:</strong> {payment[0]}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showQR && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-xl font-bold mb-4">QR Code</h2>
            <img src="https://raw.githubusercontent.com/avmaurya07/MAK_Doctor_Plus/refs/heads/main/public/upi_1741692439227.png" alt="QR Code" className="w-full h-auto mb-4" />
            <button
              onClick={shareQR}
              className="mb-2 px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600"
            >
              Share
            </button>
            <button
              onClick={() => setShowQR(false)}
              className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
