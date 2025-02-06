import React, { useState } from "react";
import { testAwsConnection } from "./testAwsConnection";

const TestAWS = () => {
  const [result, setResult] = useState(null);

  const handleTest = async () => {
    setResult("Test en cours...");
    try {
      await testAwsConnection();
      setResult("Connexion réussie !");
    } catch (error) {
      setResult("Erreur : " + error.message);
    }
  };

  return (
    <div className="p-4 border rounded">
      <button
        onClick={handleTest}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Tester AWS
      </button>
      {result && <p className="mt-2">{result}</p>}
    </div>
  );
};

export default TestAWS;
