import React, { useState } from "react";
import { Upload, FileText } from "lucide-react";
import { uploadToS3 } from "../services/awsService";

const FileUpload = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelection = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log("📂 Fichier sélectionné :", file.name);
    setSelectedFile(file);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Veuillez sélectionner un fichier CSV.");
      return;
    }

    console.log("🚀 Début de l'upload vers S3...");
    setLoading(true);

    try {
      const result = await uploadToS3(selectedFile);
      console.log("✅ Upload réussi :", result);
      onUploadSuccess(selectedFile);
      setSelectedFile(null);
    } catch (err) {
      console.error("❌ Erreur lors de l'upload :", err.message);
      setError(`Erreur lors de l'upload : ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-2 border-dashed p-8 rounded-lg text-center">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileSelection}
        className="hidden"
        id="csv-upload"
      />
      <label htmlFor="csv-upload" className="cursor-pointer">
        <Upload className="w-12 h-12 mx-auto text-gray-400" />
        <span className="block mt-2">Sélectionner un fichier CSV</span>
      </label>

      {selectedFile && (
        <div className="mt-4 bg-gray-100 p-2 rounded flex items-center justify-between">
          <FileText className="text-gray-500" />
          <span className="ml-2">{selectedFile.name}</span>
        </div>
      )}

      <button
        onClick={handleUpload}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        disabled={!selectedFile || loading}
      >
        {loading ? "Envoi en cours..." : "Envoyer vers AWS"}
      </button>

      {error && <div className="mt-2 text-red-500">{error}</div>}
    </div>
  );
};

export default FileUpload;
