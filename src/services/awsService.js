import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import Papa from "papaparse";

// 📌 Configuration AWS
const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: "AKIA4SZHNX5SSUNHQ3X2",
    secretAccessKey: "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",
  },
});

// 📌 Fonction pour parser un CSV en JSON
const parseCSV = (csvString) => {
  return new Promise((resolve) => {
    Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (result) => resolve(result.data),
    });
  });
};

// 📂 **Upload d'un fichier vers S3**
export const uploadToS3 = async (file) => {
  try {
    console.log("📤 Début de l'upload:", file.name);

    const fileContent = await file.arrayBuffer();
    const uint8Array = new Uint8Array(fileContent);

    const command = new PutObjectCommand({
      Bucket: "base-csv",
      Key: `base-csv/${file.name}`,
      Body: uint8Array,
      ContentType: "text/csv",
    });

    const response = await s3Client.send(command);
    console.log("✅ Upload réussi:", response);

    return { success: true, fileName: file.name };
  } catch (error) {
    console.error("❌ Erreur d'upload:", error);
    throw new Error(`Erreur lors de l'upload: ${error.message}`);
  }
};

// 📥 **Récupération des fichiers traités depuis S3**
export const getAnalysisResults = async (fileName) => {
  try {
    console.log("📥 Récupération des résultats pour:", fileName);

    const [statsResponse, correctResponse, incorrectResponse] =
      await Promise.all([
        s3Client.send(
          new GetObjectCommand({
            Bucket: "processed-csv",
            Key: `processed-csv/stats/${fileName}`,
          })
        ),
        s3Client.send(
          new GetObjectCommand({
            Bucket: "processed-csv",
            Key: `processed-csv/correct-data/${fileName}`,
          })
        ),
        s3Client.send(
          new GetObjectCommand({
            Bucket: "processed-csv",
            Key: `processed-csv/incorrect-data/${fileName}`,
          })
        ),
      ]);

    // 📌 Convertir les résultats en texte puis en JSON
    const statsData = await parseCSV(
      await statsResponse.Body.transformToString()
    );
    const correctData = await parseCSV(
      await correctResponse.Body.transformToString()
    );
    const incorrectData = await parseCSV(
      await incorrectResponse.Body.transformToString()
    );

    return { stats: statsData, correctData, incorrectData };
  } catch (error) {
    console.error("❌ Erreur lors de la récupération:", error);
    throw new Error(
      `Erreur lors de la récupération des résultats: ${error.message}`
    );
  }
};
