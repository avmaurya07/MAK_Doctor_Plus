import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Switch from 'react-switch';
import config from "../config";

function BookAppointment() {
    const baseURL = config.baseURL;
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [appointmentDate, setAppointmentDate] = useState(() => {
        return new Date().toLocaleDateString('en-IN', { 
            timeZone: 'Asia/Kolkata', 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
          }).split('/').reverse().join('-')
    });
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('Male');
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [collectedFee, setCollectedFee] = useState(false);
    const [exercise, setExercise] = useState(false);
    const navigate = useNavigate();

    const handleBookAppointment = async () => {
        if (!name) {
            alert('Name is required');
            return;
        }

        if (!phoneNumber) {
            alert('Phone number is required');
            return;
        }

        if (!age) {
            alert('Age is required');
            return;
        }

        if (!gender) {
            alert('Gender is required');
            return;
        }

        if (!selectedDoctor) {
            alert('Doctor is required');
            return;
        }

        try {
            const response = await fetch(`${baseURL}patients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.EXPO_PUBLIC_STRAPI_API_KEY}`
                },
                body: JSON.stringify({
                    data: {
                        Name: name,
                        phoneNumber,
                        age,
                        gender,
                        dateOfAppoinment: appointmentDate,
                        mak: JSON.parse(localStorage.getItem('userData')).mak,
                        DoctorName: selectedDoctor,
                        feePaid: collectedFee,
                        exercise
                    }
                })
            });
            const data = await response.json();
            if (data.data) {
                alert('Appointment booked successfully');
                navigate("/view-appointments");
            } else {
                alert('Booking Failed', 'Please check the details and try again.');
            }
        } catch (error) {
            alert('Booking Failed', 'Please check the details and try again.');
        }
    };

    const getDoctors = async () => {
        try {
            const response = await fetch(`${baseURL}user-lists?userType=mak_doctor&isActive=true`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.EXPO_PUBLIC_STRAPI_API_KEY}`
                },
            });
            const data = await response.json();
            if (data) {
                setDoctors(data.data);
                setSelectedDoctor(data.data.length === 1 ? data.data[0].Name : "");
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getDoctors();
    }, [1]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xs">
                <h1 className="text-2xl font-bold mb-4 text-center">Book Appointment</h1>
                <input
                    type="number"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                    max="9999999999"
                    min="6000000000"
                    required
                />
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                    required
                />
                <input
                    type="number"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                    required
                    max="99"
                    min="1"
                />
                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                    required
                >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                <input
                    type="date"
                    placeholder="Appointment Date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className={`w-full p-2 mb-4 border border-gray-300 rounded ${doctors.length <= 1 ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                    disabled={doctors.length <= 1}
                >
                    <option value="">Select Doctor</option>
                    {Array.isArray(doctors) && doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.Name}>
                            {doctor.Name}
                        </option>
                    ))}
                </select>
                <div className="flex items-center mb-4">
                    <Switch
                        onChange={setCollectedFee}
                        checked={collectedFee}
                        onColor="#00FF00"
                        offColor="#FF0000"
                        uncheckedIcon={false}
                        checkedIcon={false}
                        handleDiameter={28}
                        height={20}
                        width={50}
                        disabled={JSON.parse((localStorage.getItem('userData')).userId==="300069-gullan")}
                    />
                    <label className="ml-2">Doctor Fee (&#8377;200)</label>
                </div>
                <div className="flex items-center mb-4">
                    <Switch
                        onChange={setExercise}
                        checked={exercise}
                        onColor="#00FF00"
                        offColor="#FF0000"
                        disabled={true}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        handleDiameter={28}
                        height={20}
                        width={50}
                    />
                    <label className="ml-2">Exercise Fee (&#8377;100)</label>
                </div>
                <button
                    onClick={handleBookAppointment}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Book Appointment
                </button>
            </div>
        </div>
    );
}

export default BookAppointment;