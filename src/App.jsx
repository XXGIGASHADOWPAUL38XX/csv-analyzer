import React, { useState, useEffect } from "react";
import FileUpload from "./components/FileUpload";
import AnalysisResults from "./components/AnalysisResults";
import AnomalyDetection from "./components/AnomalyDetection";
import FileHistory from "./components/FileHistory";
import LoadingSpinner from "./components/LoadingSpinner";
import TestAWS from "./TestAWS"; // ✅ Ajout du test AWS
import { SQSClient, ReceiveMessageCommand, PurgeQueueCommand } from "@aws-sdk/client-sqs";
import { getAnalysisResults } from "./services/awsService";

const App = () => {
  const sqsClient = new SQSClient({
      region: 'eu-north-1',
      credentials: {
        accessKeyId: "AKIA4SZHNX5SSUNHQ3X2",
        secretAccessKey: "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",
      },
  });

  const queueUrl = "https://sqs.eu-north-1.amazonaws.com/864981729125/csv_sqs";

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


const pollSQS = async () => {
    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 0,
      });

      const data = await sqsClient.send(command);

      if (data.Messages) {
        const messageBody = JSON.parse(data.Messages[0].Body);

        const newResults = await getAnalysisResults(messageBody["detail"]["message"]);
        setResults((prevResults) => {
          return newResults;
        });

        const purgeCommand = new PurgeQueueCommand({ QueueUrl: queueUrl });
        await sqsClient.send(purgeCommand);
      } else {
        console.log("No new messages in the queue.");
      }
    } catch (error) {
      console.error("Error receiving message from SQS:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(results)
      pollSQS();
    }, 2000);

    return () => clearInterval(interval);
  }, []);


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
          <AnalysisResults results={results.stats} />
          <AnomalyDetection anomalies={results.incorrectData} />
        </>
      )}

      {/* Historique des fichiers uploadés */}
      <FileHistory files={files} />
    </div>
  );
};

export default App;
