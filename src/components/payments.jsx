import React, { useEffect, useState } from "react";
import config from "../config";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [amount, setAmount] = useState("0.00");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [colo, setColo] = useState("white");

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
      setPayments(data.data || []); // Ensure empty state is handled
      // console.log(data.amount);
      if(data.amount[0]==='-'){
        setColo("green");
        setAmount(data.amount.slice(1));
      }else{
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Payments <p className={`bg-${colo}-500`}>(&#8377; {amount})</p>
        </h1>
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
    </div>
  );
};

export default Payments;
