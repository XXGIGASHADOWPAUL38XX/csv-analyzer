import React from "react";
import { FileText } from "lucide-react";

const AnalysisResults = ({ results }) => {
  if (!results) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">
        <FileText className="inline mr-2" />
        Analysis Results
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {Object.entries(results.statistics).map(([key, stats]) => (
          <div key={key} className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold">{key}</h3>
            <dl>
              <dt>Average</dt>
              <dd>{stats.average.toFixed(2)}</dd>
              <dt>Median</dt>
              <dd>{stats.median.toFixed(2)}</dd>
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisResults;
