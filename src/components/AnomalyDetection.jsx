import React from "react";
import { AlertTriangle } from "lucide-react";
import { CSVToTable } from "react-csv-to-table";

const AnomalyDetection = ({ incorrectData }) => {
  if (!incorrectData) return null;

  // Convert byte representation of CSV to string
  const csvData = new TextDecoder().decode(incorrectData);

  return (
    <div className="mt-6 bg-white rounded-lg shadow p-6 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <AlertTriangle className="mr-2 text-red-600" /> Anomalies Detected
      </h2>
      <CSVToTable data={csvData} />
    </div>
  );
};

export default AnomalyDetection;
