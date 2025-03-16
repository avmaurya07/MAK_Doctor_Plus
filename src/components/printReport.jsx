import React from "react";
import ReactDOM from "react-dom";

const MedicalReport = ({ data,doctor }) => {
    const tabledata = data.results.slice(1);
  return (
    <div className="p-6 w-full max-w-4xl mx-auto border border-gray-300 rounded-md bg-white print:w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <img
          src="https://imcbusiness.com/images/logo.png"
          alt="Mega Ayurvedic Kendra Logo"
          className="mx-auto h-24"
        />
        <h1 className="text-3xl font-bold text-green-700">Mega Ayurvedic Kendra</h1>
        <p className="text-gray-600 text-base">
          Roadways to Bhawarnath Bypass Road, 500m from Roadways, Azamgarh, Uttar Pradesh - 276001
        </p>
        <p className="text-gray-600 text-base">Phone: +91 9554242552 | Email: imc.azamgarh@gmail.com</p>
      </div>

      {/* Patient Info */}
      <table width="100%" cellSpacing="0" cellPadding="0">
  <tbody>
    <tr>
      <td width="30%"><strong>Name: </strong>{data.name}</td>
      <td width="30%" align="center"><strong>Sex: </strong>{data.gender}</td>
      <td width="30%" align="center"><strong>Age: </strong>{data.age}</td>
    </tr>
    <tr>
      <td colSpan="3">
        <table width="100%" cellSpacing="0" cellPadding="0">
          <tbody>
            <tr>
              <td width="50%" align="left">
              <strong> Figure: </strong>{data.figure || "__________"}
              </td>
            </tr>
            <tr>
              <td colSpan="2" align="left">
              <strong>Testing Time: </strong> {data.date || "__________"}
              </td>
            </tr>
            <tr>
              <td colSpan="2" align="left">
              <strong>Doctor: </strong> {doctor || "__________"}
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>


      {/* Tables */}
      <h3 className="text-2xl font-semibold mt-6 text-green-700">About the Probably Hidden Problems</h3>
      <Table data={tabledata.slice(0, tabledata.findIndex(item => item.system === "System"))} />

      <h3 className="text-2xl font-semibold mt-6 text-green-700">About the Problems of Sub-Health Trends</h3>
      <Table data={tabledata.slice(tabledata.findIndex(item => item.system === "System") + 1)} />

      {/* Disclaimer */}
      <p className="text-sm text-gray-500 text-center mt-6 border-t-2 pt-4">
        <strong>Disclaimer:</strong> The test results are for reference only and not as a diagnostic conclusion.
      </p>
    </div>
  );
};

const Table = ({ data }) => {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="w-full border-collapse border border-gray-300 text-base">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border border-gray-300 p-3">System</th>
            <th className="border border-gray-300 p-3">Testing Item</th>
            <th className="border border-gray-300 p-3">Normal Range</th>
            <th className="border border-gray-300 p-3">Actual Value</th>
            <th className="border border-gray-300 p-3 text-sm">Expert Advice</th>
          </tr>
        </thead>
        <tbody>
          {data.map((result, index) => (
            <tr key={index} className="border border-gray-300">
              <td className="border border-gray-300 p-3">{result.system}</td>
              <td className="border border-gray-300 p-3">{result.testingItem}</td>
              <td className="border border-gray-300 p-3">{result.normalRange}</td>
              <td className="border border-gray-300 p-3">{result.actualValue}</td>
              <td className="border border-gray-300 p-3 text-sm">{result.expertAdvice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const openMedicalReport = (data,doctor) => {
  const reportWindow = window.open("", "_blank", "width=800px,height=100px");
  if (!reportWindow) return;

  const doc = reportWindow.document;
  doc.open();
  doc.write(`<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Test Report</title>
      <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-white">
      <div id="root"></div>
      <script>
          document.addEventListener('DOMContentLoaded', function() {
              setTimeout(() => {
                  window.print();
                  setTimeout(() => { window.close(); }, 1000);
              }, 100);
          });
      </script>
  </body>
  </html>`);
  doc.close();

  reportWindow.onload = () => {
    const root = reportWindow.document.getElementById("root");
    ReactDOM.createRoot(root).render(<MedicalReport data={data} doctor={doctor} />);
  };
};

export { openMedicalReport };