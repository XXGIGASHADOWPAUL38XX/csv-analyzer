import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
  },
});

export const testAwsConnection = async () => {
  try {
    console.log("🚀 Test de connexion AWS en cours...");
    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);
    console.log("✅ Connexion réussie ! Buckets trouvés :", response.Buckets);
  } catch (error) {
    console.error("❌ Échec de la connexion à AWS :", error);
  }
};
