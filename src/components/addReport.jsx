import React, { useState, useEffect } from 'react';
import config from "../config";

const AddReport = () => {
  const [appointments, setAppointments] = useState([]);
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')) || {});
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [uploadedReports, setUploadedReports] = useState({});
  const [submittedReports, setSubmittedReports] = useState({});

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${config.baseURL}patients/${userData.mak}a${selectedDate}?dateOfAppoinment=${selectedDate}`, {
          headers: { 'Authorization': `Bearer ${config.EXPO_PUBLIC_STRAPI_API_KEY}` },
        });
        const data = await response.json();
        setAppointments(data.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    fetchAppointments();
  }, [selectedDate, userData.mak]);

  const parseHTMReport = (htmString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmString, "text/html");
    const cleanText = (text) => text.replace(/\s+/g, " ").trim();
  
    const nameMatch = doc.body.innerHTML.match(/Name:\s*([^<]+)/);
    const ageMatch = doc.body.innerHTML.match(/Age:\s*(\d+)/);
    const genderMatch = doc.body.innerHTML.match(/Sex:\s*([^<]+)/);
    const figureMatch = doc.body.innerHTML.match(/Figure:\s*([^<]+)/);
    const dateMatch = doc.body.innerHTML.match(/Testing Time:\s*([^<]+)/);
  
    const name = nameMatch ? cleanText(nameMatch[1]) : "Unknown";
    const age = ageMatch ? cleanText(ageMatch[1]) : "Unknown";
    const gender = genderMatch ? cleanText(genderMatch[1]) : "Unknown";
    const figure = figureMatch ? cleanText(figureMatch[1]) : "Unknown";
    const date = dateMatch ? cleanText(dateMatch[1]) : "Unknown";
  
    const results = [];
    const rows = doc.querySelectorAll("table tr");
    rows.forEach((row, index) => {
      const cells = row.querySelectorAll("td");
      if (cells.length === 5) {
        results.push({
          system: cleanText(cells[0].textContent),
          testingItem: cleanText(cells[1].textContent),
          normalRange: cleanText(cells[2].textContent),
          actualValue: cleanText(cells[3].textContent),
          expertAdvice: cleanText(cells[4].textContent),
        });
      }
    });
  
    return { name, age, gender, figure,date, results };
  };
  

  const handleFileUpload = (appointmentId, event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const reportData = parseHTMReport(e.target.result);
      setUploadedReports(prev => ({ ...prev, [appointmentId]: reportData }));
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (appointmentId) => {
    if (uploadedReports[appointmentId]) {
      try {
        const response = await fetch(`${config.baseURL}patients/${appointmentId}`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.EXPO_PUBLIC_STRAPI_API_KEY}`
          },
          body: JSON.stringify({ data: { report: uploadedReports[appointmentId] } })
        });
        if (!response.ok) throw new Error("Failed to update patient report");
        setSubmittedReports(prev => ({ ...prev, [appointmentId]: true }));
        alert("Report updated successfully!");
      } catch (error) {
        console.error("Error updating report:", error);
      }
    } else {
      console.log("No report uploaded for this appointment.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Upload Report</h1>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="p-2 border border-gray-300 rounded mb-4" />
        {appointments.length === 0 ? (
          <p className="text-center">No appointments found.</p>
        ) : (
          <ul>
            {appointments.map((appointment) => (
              <li key={appointment.id} className="mb-4 p-4 border border-gray-300 rounded">
                <p><strong>Name:</strong> {appointment.Name}</p>
                <p><strong>Phone:</strong> {appointment.phoneNumber}</p>
                <p><strong>Doctor:</strong> {appointment.DoctorName}</p>
                <p><strong>Date:</strong> {appointment.dateOfAppoinment.split('-').reverse().join('/')}</p>
                {appointment.report || submittedReports[appointment.id] ? (
                  <p className="text-green-600 font-bold">Already Uploaded</p>
                ) : (
                  <>
                    <label className="block mt-2 font-bold">Upload Report:</label>
                    <input type="file" accept=".htm" onChange={(e) => handleFileUpload(appointment.id, e)} className="border border-gray-300 p-2 rounded" />
                    <button onClick={() => handleSubmit(appointment.id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">Submit</button>
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

export default AddReport;
