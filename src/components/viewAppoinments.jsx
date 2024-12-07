import React, { useState, useEffect, useRef } from 'react';
import config from "../config";
import Switch from 'react-switch';

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [userData, setUserData] = useState({});
  const [printData, setPrintData] = useState({});
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const printRef = useRef(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${config.baseURL}patients`, {
          headers: {
            'Authorization': `Bearer ${config.EXPO_PUBLIC_STRAPI_API_KEY}`
          }
        });
        const data = await response.json();
        setAppointments(data.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [1]);

  useEffect(() => {
    const userData1 = JSON.parse(localStorage.getItem('userData'));
    if (userData1 && userData1.userId) {
      setUserData(userData1);
    }
  }, [1]);

  const handleSwitchChange = (id, field, value) => {
    setAppointments(prevAppointments =>
      prevAppointments.map(appointment =>
        appointment.id === id ? { ...appointment, [field]: value } : appointment
      )
    );
  };

  const handleSave = async (appointment) => {
    try {
      const response = await fetch(`${config.baseURL}patients/${appointment.documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.EXPO_PUBLIC_STRAPI_API_KEY}`
        },
        body: JSON.stringify({data:{
          feePaid:appointment.feePaid,
          exercise:appointment.exercise}})
      });
      if (!response.ok) {
        throw new Error('Failed to save appointment');
      }
      const updatedAppointment = await response.json();
      setAppointments(prevAppointments =>
        prevAppointments.map(a => (a.id === updatedAppointment.id ? updatedAppointment : a))
      );
      alert('Appointment saved successfully!');
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const handleSave2 = async (appointment) => {
    try {
      const response = await fetch(`${config.baseURL}patients/${appointment.documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.EXPO_PUBLIC_STRAPI_API_KEY}`
        },
        body: JSON.stringify({data:{
          feePaid:appointment.feePaid,
          exercise:appointment.exercise}})
      });
      if (!response.ok) {
        throw new Error('Failed to save appointment');
      }
      const updatedAppointment = await response.json();
      setAppointments(prevAppointments =>
        prevAppointments.map(a => (a.id === updatedAppointment.id ? updatedAppointment : a))
      );
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const handlePrint = async (appointment) => {
    try {
      setPrintData(appointment);
      await handleSave2(appointment);
      const printContent = printRef.current.innerHTML;
      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow.document.write('<html><head><title>Print Appointment</title>');
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
    } catch (error) {
      console.error('Error saving appointment before printing:', error);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const dateOfAppoinment = new Date(appointment.dateOfAppoinment);
    const selectedDateObj = new Date(selectedDate);
    return dateOfAppoinment.toDateString() === selectedDateObj.toDateString();
  });

  const filteredAppointmentsByUserType = userData.userType === 'mak_doctor'
    ? filteredAppointments.filter(appointment => appointment.feePaid || appointment.exercise)
    : filteredAppointments;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Appointments</h1>

        <input
          type="date"
          placeholder="Appointment Date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className=" p-2 mb-4 border border-gray-300 rounded"
        />
       
        {filteredAppointmentsByUserType.length === 0 ? (
          <p className="text-center">No appointments found.</p>
        ) : (
          <ul>
            {filteredAppointmentsByUserType.map((appointment) => {
              const isFutureOrToday = new Date(appointment.dateOfAppoinment) >= new Date(today);
              return (
                <li key={appointment.id} className="mb-4 p-4 border border-gray-300 rounded">
                  <p><strong>Name:</strong> {appointment.Name}</p>
                  <p><strong>Phone Number:</strong> {appointment.phoneNumber}</p>
                  <p><strong>Appointment Date:</strong> {appointment.dateOfAppoinment}</p>
                  <p><strong>Doctor:</strong> {appointment.DoctorName}</p>
                  {(userData.userType === 'mak_doctor') ? (
                    <>
                      <p><strong>Doctor Fee:</strong> {appointment.feePaid ? 'Yes' : 'No'}</p>
                      <p><strong>Exercise Fee:</strong> {appointment.exercise ? 'Yes' : 'No'}</p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center mb-4">
                        <Switch
                          onChange={(checked) => handleSwitchChange(appointment.id, 'feePaid', checked)}
                          checked={appointment.feePaid}
                          onColor="#00FF00"
                          offColor="#FF0000"
                          uncheckedIcon={false}
                          checkedIcon={false}
                          handleDiameter={28}
                          height={20}
                          width={50}
                          disabled={!isFutureOrToday}
                        />
                        <label className="ml-2">Doctor Fee</label>
                      </div>
                      <div className="flex items-center mb-4">
                        <Switch
                          onChange={(checked) => handleSwitchChange(appointment.id, 'exercise', checked)}
                          checked={appointment.exercise}
                          onColor="#00FF00"
                          offColor="#FF0000"
                          uncheckedIcon={false}
                          checkedIcon={false}
                          handleDiameter={28}
                          height={20}
                          width={50}
                          disabled={!isFutureOrToday}
                        />
                        <label className="ml-2">Exercise Fee</label>
                      </div>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleSave(appointment)}
                        disabled={!isFutureOrToday}
                      >
                        Save
                      </button>
                      {appointment.feePaid && appointment.dateOfAppoinment === today && (
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 rounded hidden md:inline-block"
                          onClick={() => handlePrint(appointment)}
                        >
                          Print
                        </button>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
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
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img 
            src="https://imcbusiness.com/images/logo.png" 
            alt="Mega Ayurvedic Kendra Logo" 
            style={{ height: '80px', marginBottom: '10px' }} 
          />
          <h1 style={{ margin: 0, fontSize: '24px', color: '#4caf50' }}>Mega Ayurvedic Kendra</h1>
          <p style={{ margin: 0, fontSize: '14px' }}>Roadways to Bhawarnath Bypass Road, KolBazBahadur, Azamgarh, Uttar Pradesh</p>
          <p style={{ margin: 0, fontSize: '14px' }}>Phone: +91 9554242552 | Email: imc.azamgarh@gmail.com</p>
        </div>
      
        {/* Patient Info Section */}
        <div style={{ borderTop: '2px solid #4caf50', marginTop: '20px', paddingTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <p><strong>Patient Name:</strong> {printData.Name}</p>
            <p><strong>Phone Number:</strong> {printData.phoneNumber}</p>
            <p><strong>Date:</strong> {printData.dateOfAppoinment}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <p><strong>Doctor:</strong>{printData.DoctorName} </p>
            <p><strong>Age:</strong> ____</p>
            <p><strong>Gender:</strong> ____</p>
          </div>
        </div>
      
        {/* Prescription Section */}
        <div style={{ borderTop: '2px solid #000', marginTop: '10px', paddingTop: '10px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Prescription:</h2>
        </div>
      
        {/* Footer Section */}
        <div 
          style={{ 
            position: 'absolute', 
            bottom: '60px', 
            left: '20px', 
            right: '20px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            borderTop: '2px solid #4caf50', 
            paddingTop: '10px' 
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', margin: 0 }}><strong>Doctor's Signature</strong></p>
            <p style={{ margin: '40px 0 0', fontSize: '14px' }}>__________________________</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', margin: '0 0 10px' }}></p>
            <div style={{ height: '100px', width: '100px' }}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?data=${printData.documentId}&size=100x100`} 
                alt="QR Code" 
                style={{ height: '100px', width: '100px' }} 
              />
            </div>
          </div>
        </div>
      
        {/* Disclaimer */}
        <p 
          style={{ 
            position: 'absolute', 
            bottom: '10px', 
            left: '20px', 
            right: '20px', 
            fontSize: '12px', 
            textAlign: 'center', 
            color: '#777' 
          }}
        >
          <strong>Disclaimer:</strong> This is not an official document. The prescription is issued for informational purposes only and should not be treated as a legally binding medical record.
        </p>
      </div>

    </div>
  );
};

export default ViewAppointments;