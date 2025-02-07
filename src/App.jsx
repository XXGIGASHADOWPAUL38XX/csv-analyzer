import React, { useState, useEffect } from "react";
import FileUpload from "./components/FileUpload";
import AnalysisResults from "./components/AnalysisResults";
import AnomalyDetection from "./components/AnomalyDetection";
import FileHistory from "./components/FileHistory";
import LoadingSpinner from "./components/LoadingSpinner";
import DownloadFiles from "./components/DownloadFiles";
import {
  SQSClient,
  ReceiveMessageCommand,
  PurgeQueueCommand,
} from "@aws-sdk/client-sqs";
import { getAnalysisResults } from "./services/awsService";

const App = () => {
  const sqsClient = new SQSClient({
    region: "eu-north-1",
    credentials: {
      accessKeyId: "AKIA4SZHNX5SSUNHQ3X2",
      secretAccessKey: "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",
    },
  });

  const queueUrl = "https://sqs.eu-north-1.amazonaws.com/864981729125/csv_sqs";

  const [results, setResults] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // 📂 **Gérer l'upload et ajouter le fichier à l'historique**
  const handleUploadSuccess = (file) => {
    setFiles((prevFiles) => [
      ...prevFiles,
      { name: file.name, date: new Date() },
    ]);
    setLoading(true);
  };

  // 🔄 **Vérifier la queue SQS et récupérer les résultats**
  const pollSQS = async () => {
    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 5,
      });
      const data = await sqsClient.send(command);

      if (data.Messages) {
        const messageBody = JSON.parse(data.Messages[0].Body);
        const fileName = messageBody["detail"]["message"];

        console.log("📥 Fichier terminé:", fileName);
        const newResults = await getAnalysisResults(fileName);
        setResults(newResults);
        setLoading(false);

        // 📌 Purger la queue après traitement
        const purgeCommand = new PurgeQueueCommand({ QueueUrl: queueUrl });
        await sqsClient.send(purgeCommand);
      }
    } catch (error) {
      console.error("❌ Erreur SQS:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (loading) pollSQS();
    }, 5000);
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">CSV Analyzer</h1>

      {/* 📂 Upload du fichier */}
      <FileUpload onUploadSuccess={handleUploadSuccess} />

      {/* 🔄 Loader pendant le traitement */}
      {loading && <LoadingSpinner />}

      {/* 📊 Résultats de l'analyse */}
      {results && !loading && (
        <>
          <AnalysisResults results={results.stats} />
          <AnomalyDetection results={results.incorrectData} />
          <DownloadFiles
            correctData={results.correctData}
            incorrectData={results.incorrectData}
            stats={results.stats}
          />
        </>
      )}

      {/* 🔍 Historique des fichiers uploadés */}
      <FileHistory files={files} />
    </div>
  );
};

export default App;
