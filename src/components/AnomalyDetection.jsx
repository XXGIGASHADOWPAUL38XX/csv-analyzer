import React from "react";
import { AlertTriangle } from "lucide-react";

const AnomalyDetection = ({ anomalies = [] }) => (
  <div className="mt-6">
    {anomalies.length > 0 ? (
      <div className="bg-red-50 border-red-200 p-4 rounded">
        <h3 className="flex items-center text-red-800">
          <AlertTriangle className="mr-2" />
          Anomalies Detected
        </h3>
        <ul className="mt-2 space-y-1">
          {anomalies.map((anomaly, index) => (
            <li key={index} className="text-red-600">
              {anomaly}
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <div className="bg-green-50 p-4 rounded">No anomalies detected</div>
    )}
  </div>
);

export default AnomalyDetection;
