import React, { useState, useRef } from 'react';
import Modal from 'react-modal';

const EmergencyModal = ({ isModalOpen, closeModal }) => {
  const [emergencyData, setEmergencyData] = useState({
    Name: '',
    phoneNumber: '',
    age: '',
    gender: '',
    DoctorName: '',
  });

  const printRef = useRef(null);

  const handleEmergencyChange = (e) => {
    const { name, value } = e.target;
    setEmergencyData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePrintEmergency = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=100%,width=800');
    printWindow.document.write('<html><head><title>Print Appoinments</title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();

    printWindow.addEventListener('afterprint', () => {
      printWindow.close();
    });
    setTimeout(() => {
      printWindow.close();
    }, 1000);
  };

  const handleCloseModal = () => {
    setEmergencyData({
      Name: '',
      phoneNumber: '',
      age: '',
      gender: '',
      DoctorName: '',
    });
    closeModal();
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={handleCloseModal}
      contentLabel="Emergency Details"
      className="relative bg-white rounded-lg shadow-lg max-w-lg w-full mx-auto p-8"
      overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center"
      ariaHideApp={false}
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Appoinment Details</h2>
      <form>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="Name"
              value={emergencyData.Name}
              onChange={handleEmergencyChange}
              className="block w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="number"
              name="phoneNumber"
              value={emergencyData.phoneNumber}
              onChange={handleEmergencyChange}
              className="block w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={emergencyData.age}
              onChange={handleEmergencyChange}
              className="block w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              name="gender"
              value={emergencyData.gender}
              onChange={handleEmergencyChange}
              className="block w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Name</label>
            <input
              type="text"
              name="DoctorName"
              value={emergencyData.DoctorName}
              onChange={handleEmergencyChange}
              className="block w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end mt-6 space-x-4">
          <button
            type="button"
            onClick={handlePrintEmergency}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Print
          </button>
          <button
            type="button"
            onClick={handleCloseModal}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-md focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </form>
      <div 
        ref={printRef} 
        hidden 
        className="prescription-template" 
        style={{ 
          fontFamily: 'Arial, sans-serif', 
          padding: '20px', 
          border: '1px solid #000', 
          width: '600px', 
          height: '800px', 
          position: 'relative', 
          boxSizing: 'border-box'
        }}
      >
        {/* Header Section */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <img 
            src="https://imcbusiness.com/images/logo.png" 
            alt="Mega Ayurvedic Kendra Logo" 
            style={{ position: 'absolute', top: '1px', left: '20px', height: '120px' }} 
          />
          <div style={{ textAlign: 'center', marginTop: '0px' }}>
            <h1 style={{ margin: 0, fontSize: '36px', color: '#007540' }}>Mega Ayurvedic Kendra</h1>
            <p style={{ margin: 0, fontSize: '21px' }}>Roadways to Bhawarnath Bypass Road, 500 mtr from Roadways,<br /> Azamgarh, Uttar Pradesh - 276001</p>
            <p style={{ margin: 0, fontSize: '21px' }}>Phone: +91 9554242552 | Email: imc.azamgarh@gmail.com</p>
          </div>
          <div style={{ position: 'absolute', top: '1px', right: '20px' }}>
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?data=GOODIMC&size=100x100`} 
              alt="QR Code" 
              style={{ height: '120px', width: '120px' }} 
            />
          </div>
        </div>

        {/* Patient Info Section */}
        <div style={{ borderTop: '2px solid #007540', marginTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', lineHeight: '0.3' }}>
            <p style={{ fontSize: '1.5em' }}><strong>Patient:</strong> {emergencyData.Name || "__________"}</p>
            <p style={{ fontSize: '1.5em' }}><strong>Phone No:</strong> {emergencyData.phoneNumber || "__________"}</p>
                        <p style={{ fontSize: '1.5em' }}><strong>Date:</strong> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Kolkata' })}</p>          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', lineHeight: '0.3' }}>
            <p style={{ fontSize: '1.5em' }}><strong>Doctor:</strong> {emergencyData.DoctorName || "__________"}</p>
            <p style={{ fontSize: '1.5em' }}><strong>Age:</strong> {emergencyData.age || "_____"}</p>
            <p style={{ fontSize: '1.5em' }}><strong>Gender:</strong> {emergencyData.gender || "_____"}</p>
          </div>
        </div>
        {/* Prescription Section */}
        <div style={{ borderTop: '2px solid #007540', marginTop: '10px', paddingTop: '10px' }}>
          <h2 style={{ fontSize: '27px', marginBottom: '10px' }}>Prescription:</h2>
        </div>

        {/* Footer Section */}
        <div 
          style={{ 
            position: 'absolute', 
            bottom: '30px', 
            left: '20px', 
            right: '20px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            borderTop: '2px solid #007540', 
            paddingTop: '10px' 
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', margin: '0 0 10px' }}></p>
          </div>
        </div>

        {/* Disclaimer */}
        <p 
          style={{ 
            position: 'absolute', 
            bottom: '1px', 
            left: '20px', 
            right: '20px', 
            fontSize: '15px', 
            textAlign: 'center', 
            color: '#777' 
          }}
        >
          <strong>Disclaimer:</strong> This is not an official document. The prescription is issued for informational purposes only and should not be treated as a legally binding medical record.
        </p>
      </div>

      <style>
        {`
          @media print {
            @page {
              margin: 5px 0;
            }
            body {
              margin: 0mm;
            }
            .prescription-template {
              margin: 0mm auto;
              box-shadow: none;
            }
          }
        `}
      </style>
    </Modal>
  );
};

export default EmergencyModal;
