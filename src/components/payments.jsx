import React, { useEffect, useState } from "react";
import config from "../config";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [amount, setAmount] = useState("0.00");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [colo, setColo] = useState("white");
  const [showQR, setShowQR] = useState(false);

  const [amount1, setAmount1] = useState("");
  const [storeCode, setStoreCode] = useState("");
  const [showQR1, setShowQR1] = useState(false);

  const generateQRCode = () => {
    if (!amount1 || amount1 <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (!storeCode || storeCode <= 0) {
      alert("Please enter a valid store code.");
      return;
    }
    setShowQR1(true);
  };

  const goBack = () => {
    setShowQR1(false);
  };

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
  useEffect(() => {
    let interval;

    if (showQR1) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`${config.baseURL}payment`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          const data = await response.json();
          const newPayments = data.data || [];

          if (newPayments.length > 0) {
            // Get the latest payment (always at index 0)
            const latestPayment = newPayments[0];

            // Extract amount & transaction remark
            const latestAmount = parseFloat(latestPayment[2]); // Amount is at index 2
            const transactionRemark = latestPayment[1]; // Transaction details are at index 1

            // Extract store code from transaction remark
            const match = transactionRemark.match(
              /Payment to MAK AZAMGARH by (\d+)/
            );
            const latestStoreCode = match ? match[1] : null; // Extracted store code

            // Check if the latest payment matches our entered details
            if (
              latestAmount === parseFloat(amount1)
              // latestStoreCode === storeCode
            ) {
              alert(
                `Payment of ₹${amount1} received for Store Code: ${storeCode}!`
              );
              clearInterval(interval);
            }
          }
        } catch (error) {
          console.error("Error fetching payments:", error);
        }
      }, 5000); // Poll every 5 seconds
    }

    return () => clearInterval(interval);
  }, [showQR1, amount1, storeCode]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {!showQR ? (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">
              Payments{" "}
              <span className={`bg-${colo}-500 px-2 py-1 rounded text-white`}>
                (₹ {amount})
              </span>
            </h1>
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
      ) : (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
          {!showQR1 ? (
            <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
              <h2 className="text-2xl font-bold text-gray-700">
                Enter Payment Details
              </h2>
              <input
                type="number"
                value={amount1}
                onChange={(e) => setAmount1(e.target.value)}
                placeholder="Enter Amount"
                className="w-full p-3 mt-4 border rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="number"
                value={storeCode}
                onChange={(e) => setStoreCode(e.target.value)}
                placeholder="Enter Store Code"
                className="w-full p-3 mt-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <button
                className="w-full mt-5 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
                onClick={generateQRCode}
              >
                Generate QR Code
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
              <h2 className="text-2xl font-bold text-gray-700">QR Code</h2>
              <h3 className="text-lg font-semibold text-gray-600">
                MAK AZAMGARH
              </h3>
              <div className="flex justify-center my-4 bg-gray-100 p-4 rounded-lg">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi%3A%2F%2Fpay%3Fpa%3DIMCPMT89504837%40hdfcbank%26pn%3DMAK%20AZAMGARH%26cu%3DINR%26am%3D${amount1}%26tn%3DPayment%20to%20MAK%20Azamgarh%20by%20${storeCode}`}
                  alt="QR Code"
                  className="w-40 h-40"
                />
              </div>
              <p className="text-gray-600 font-medium">Amount: ₹{amount1}</p>
              <p className="mt-3 text-gray-500 text-sm">
                Scan and pay with any BHIM UPI app
              </p>
              <button
                className="w-full mt-5 bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition duration-200"
                onClick={goBack}
              >
                Back
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Payments;
