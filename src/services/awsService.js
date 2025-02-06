import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

// Configuration avec vos credentials
const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: "AKIA4SZHNX5SSUNHQ3X2",
    secretAccessKey: "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",
  },
});

// Upload de fichier vers S3
export const uploadToS3 = async (file) => {
  try {
    console.log("📤 Début upload:", {
      nom: file.name,
      taille: file.size,
      type: file.type,
    });

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

    return {
      success: true,
      fileName: file.name,
      response,
    };
  } catch (error) {
    console.error("❌ Erreur détaillée:", {
      nom: error.name,
      message: error.message,
      code: error.$metadata?.httpStatusCode,
    });
    throw new Error(`Erreur lors de l'upload: ${error.message}`);
  }
};

// Récupération des résultats d'analyse
export const getAnalysisResults = async (fileName) => {
  try {
    console.log("📥 Récupération des résultats pour:", fileName);

    // Récupérer les statistiques
    const statsCommand = new GetObjectCommand({
      Bucket: "processed-csv",
      Key: `processed-csv/stats/${fileName}`,
    });

    // Récupérer les données correctes
    const correctDataCommand = new GetObjectCommand({
      Bucket: "processed-csv",
      Key: `processed-csv/correct-data/${fileName}`,
    });

    // Récupérer les données incorrectes
    const incorrectDataCommand = new GetObjectCommand({
      Bucket: "processed-csv",
      Key: `processed-csv/incorrect-data/${fileName}`,
    });

    const [statsResponse, correctResponse, incorrectResponse] =
      await Promise.all([
        s3Client.send(statsCommand),
        s3Client.send(correctDataCommand),
        s3Client.send(incorrectDataCommand),
      ]);

    return {
      stats: await statsResponse.Body.transformToString(),
      correctData: await correctResponse.Body.transformToString(),
      incorrectData: await incorrectResponse.Body.transformToString(),
    };
  } catch (error) {
    console.error("❌ Erreur lors de la récupération:", error);
    throw new Error(
      `Erreur lors de la récupération des résultats: ${error.message}`
    );
  }
};

// Test de connexion AWS
export const testAWSConnection = async () => {
  try {
    console.log("🚀 Test de connexion AWS en cours...");
    const testContent = new TextEncoder().encode("Test de connexion");

    const command = new PutObjectCommand({
      Bucket: "base-csv",
      Key: "test.txt",
      Body: testContent,
      ContentType: "text/plain",
    });

    const response = await s3Client.send(command);
    console.log("✅ Connexion AWS réussie:", response);
    return true;
  } catch (error) {
    console.error("❌ Échec de la connexion AWS:", error);
    return false;
  }
};

// Vérification de la configuration
export const checkAWSConfig = () => {
  const config = {
    region: "eu-north-1",
    inputBucket: "base-csv",
    outputBucket: "processed-csv",
    hasCredentials: !!s3Client.config.credentials,
  };

  console.log("🔍 Configuration AWS:", config);
  return config;
};
