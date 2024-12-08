import React, { useEffect, useRef, useState } from "react";
import config from "../config";
import { BrowserMultiFormatReader } from "@zxing/browser";
import '@fortawesome/fontawesome-free/css/all.min.css';

const QRScanner = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null); // Use useRef to store the stream
  const [scanResult, setScanResult] = useState("");
  const [error, setError] = useState(null);
  const [appointment, setAppointment] = useState({});
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toLocaleDateString('en-IN', { 
      timeZone: 'Asia/Kolkata', 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).split('/').reverse().join('-')
  });
  const [isScanning, setIsScanning] = useState(true); // State to track if scanning should continue

  const handleSave = async (documentId) => {
    try {
      const response = await fetch(`${config.baseURL}patients?filters[documentId][$eq]=${documentId}&filters[DoctorName][$eq]=${localStorage.getItem(userData).Name}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.EXPO_PUBLIC_STRAPI_API_KEY}`
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch appointment');
      }
      const data = await response.json();
      if (data.data.length) {
        setAppointment(data.data[0]);
        if (data.data[0].dateOfAppoinment === selectedDate) {
          const updateResponse = await fetch(`${config.baseURL}patients/${data.data[0].id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${config.EXPO_PUBLIC_STRAPI_API_KEY}`
            },
            body: JSON.stringify({
              data: { isAttended: true }
            }),
          });
          if (!updateResponse.ok) {
            throw new Error('Failed to update appointment');
          }
        }
      } else {
        setError('No appointment found for the given document ID');
      }
    } catch (error) {
      console.error('Error fetching appointment:', error);
      setError('Error fetching appointment');
    }
  };

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    const startScanner = async () => {
      try {
        // Start scanning for QR codes
        if (isScanning) {
          streamRef.current = await codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
            if (result) {
              setScanResult(result.text);
              handleSave(result.text);
              setIsScanning(false); // Stop further scanning
              // Stop the video stream
              if (streamRef.current && streamRef.current.getTracks) {
                streamRef.current.getTracks().forEach((track) => track.stop());
              }
            } else if (err) {
              console.warn("Scanning error: ", err.message);
            }
          });
        }
      } catch (e) {
        setError("Unable to start the QR scanner. Please check camera permissions.");
        console.error(e);
      }
    };

    if (isScanning) {
      startScanner();
    }

    // Cleanup function to stop the video stream
    return () => {
      if (streamRef.current && streamRef.current.getTracks) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [1]);

  const handleRestartScanning = () => {
    setScanResult("");
    setError(null);
    setIsScanning(true);
  };

  return (
    <div style={{ textAlign: "center" }}>
      {scanResult ? (
        <>
          {appointment.dateOfAppoinment === selectedDate ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw", backgroundColor: "#f0f0f0" }}>
              <h1 style={{ color: "green", fontSize: "3rem" }}>
                <i className="fas fa-check-circle" style={{ fontSize: "3rem" }}></i> Scan Success
              </h1>
            </div>
          ) : (
            <>
              <h1 style={{ color: "red" }}>
                <i className="fas fa-times-circle"></i> Scanned appointment is not for today.
              </h1>
              <p>{selectedDate}</p>
              <button 
                onClick={handleRestartScanning} 
                style={{
                  backgroundColor: "#007BFF",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                  marginTop: "20px"
                }}
              >
                Restart Scanning
              </button>
            </>
          )}
        </>
      ) : (
        error ? (
          <p style={{ color: "red" }}>
            <i className="fas fa-times-circle"></i> {error}
          </p>
        ) : (
          <video ref={videoRef} style={{ width: "100%", maxWidth: "500px" }} />
        )
      )}
    </div>
  );
};

export default QRScanner;