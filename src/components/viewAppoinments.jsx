import React, { useState, useEffect } from 'react';
import config from "../config";
import Switch from 'react-switch';

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [userData, setUserData] = useState({});
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

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
  }, [selectedDate]);

  useEffect(() => {
    const userData1 = JSON.parse(localStorage.getItem('userData'));
    if (userData1 && userData1.userId) {
      setUserData(userData1);
    }
  }, []);

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

  const filteredAppointments = appointments.filter(appointment => {
    const dateOfAppoinment = new Date(appointment.dateOfAppoinment);
    const selectedDateObj = new Date(selectedDate);
    return dateOfAppoinment.toDateString() === selectedDateObj.toDateString();
  });

  const filteredAppointmentsByUserType = userData.userType === 'mak_doctor'
    ? filteredAppointments.filter(appointment => appointment.collectedFee || appointment.exercise)
    : filteredAppointments;

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
            {filteredAppointmentsByUserType.map((appointment) => (
              <li key={appointment.id} className="mb-4 p-4 border border-gray-300 rounded">
                <p><strong>Name:</strong> {appointment.Name}</p>
                <p><strong>Phone Number:</strong> {appointment.phoneNumber}</p>
                <p><strong>Appointment Date:</strong> {appointment.dateOfAppoinment}</p>
                <p><strong>Doctor:</strong> {appointment.DoctorName}</p>
                {(userData.userType === 'mak_doctor') ? (
                  <>
                    <p><strong>Doctor Fee:</strong> {appointment.collectedFee ? 'Yes' : 'No'}</p>
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
                      />
                      <label className="ml-2">Exercise Fee</label>
                    </div>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleSave(appointment)}
                    >
                      Save
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ViewAppointments;