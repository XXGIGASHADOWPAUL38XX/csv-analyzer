import React from "react";
import Papa from "papaparse"; // ✅ Ajout de l'import correct

const DownloadFiles = ({ correctData, incorrectData, stats }) => {
  const downloadFile = (data, fileName) => {
    if (!data || data.length === 0) {
      console.error(`❌ Pas de données pour ${fileName}`);
      return;
    }

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 border rounded mt-4">
      <h2 className="text-xl font-bold mb-2">📥 Télécharger les fichiers</h2>
      <button
        onClick={() => downloadFile(correctData, "correct-data.csv")}
        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
      >
        ✅ Données Correctes
      </button>
      <button
        onClick={() => downloadFile(incorrectData, "incorrect-data.csv")}
        className="bg-red-500 text-white px-4 py-2 rounded mr-2"
      >
        ❌ Données Incorrectes
      </button>
      <button
        onClick={() => downloadFile(stats, "stats.csv")}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        📊 Statistiques
      </button>
    </div>
  );
};

export default DownloadFiles;
