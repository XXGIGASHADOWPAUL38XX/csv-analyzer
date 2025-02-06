import React from "react";
import { FileText } from "lucide-react";
import { CSVToTable } from "react-csv-to-table";

const AnalysisResults = ({ stats }) => {
  if (!stats) return null;

  // Convert byte representation of CSV to string
  const csvData = new TextDecoder().decode(stats);

  return (
    <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FileText className="mr-2" /> Analysis Results
      </h2>
      <CSVToTable data={csvData} />
    </div>
  );
};

export default AnalysisResults;
