import React from "react";
import { FileText, Clock } from "lucide-react";

const FileHistory = ({ files = [] }) => (
  <div className="mt-8 bg-white rounded-lg shadow">
    <h3 className="p-4 border-b font-semibold flex items-center">
      <Clock className="mr-2" />
      Analysis History
    </h3>

    <ul className="divide-y">
      {files.map((file, index) => (
        <li key={index} className="p-4 flex items-center">
          <FileText className="mr-3 text-gray-400" />
          <div>
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-gray-500">
              {new Date(file.date).toLocaleString()}
            </p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default FileHistory;
