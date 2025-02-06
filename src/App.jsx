import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import AnalysisResults from "./components/AnalysisResults";
import AnomalyDetection from "./components/AnomalyDetection";
import FileHistory from "./components/FileHistory";
import LoadingSpinner from "./components/LoadingSpinner";
import TestAWS from "./TestAWS"; // ✅ Ajout du test AWS

const App = () => {
  const [results, setResults] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUploadSuccess = (file) => {
    setFiles((prevFiles) => [
      ...prevFiles,
      {
        name: file.name,
        date: new Date(),
      },
    ]);

    // Simuler un appel API pour récupérer les résultats après l'upload
    setLoading(true);
    setTimeout(() => {
      setResults({
        statistics: {
          Column1: { average: 23.5, median: 22.1 },
          Column2: { average: 45.8, median: 44.3 },
        },
        anomalies: ["Row 3: Value out of range", "Row 10: Missing data"],
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">CSV Analyzer</h1>

      {/* ✅ Ajout du test AWS */}
      <TestAWS />

      {/* Composant d'Upload */}
      <FileUpload onUploadSuccess={handleUploadSuccess} />

      {/* Loader pendant le traitement */}
      {loading && <LoadingSpinner />}

      {/* Résultats de l'analyse */}
      {results && !loading && (
        <>
          <AnalysisResults results={results} />
          <AnomalyDetection anomalies={results.anomalies} />
        </>
      )}

      {/* Historique des fichiers uploadés */}
      <FileHistory files={files} />
    </div>
  );
};

export default App;
