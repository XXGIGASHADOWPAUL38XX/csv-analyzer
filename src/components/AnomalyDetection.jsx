import React from "react";
import { AlertTriangle } from "lucide-react";
import { CSVToTable } from "react-csv-to-table";

const AnomalyDetection = ({ results }) => {
    console.log(results)
  return (
    <div className="bg-white p-4 shadow-md rounded-md mt-4">
      <h2 className="text-xl font-bold mb-2">❌ Anomalies du fichier</h2>
      {results.length === 0 ? (
        <p className="text-gray-500">Aucune donnée disponible.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {Object.keys(results[0]).map((col) => (
                <th key={col} className="border p-2">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, index) => (
              <tr key={index} className="border-t">
                {Object.values(row).map((val, i) => (
                  <td key={i} className="border p-2">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AnomalyDetection;
