const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // Active CORS pour toutes les requêtes
app.use(express.json());

app.post("/log", (req, res) => {
  console.log("📥 Log reçu :", req.body);
  res.send("✅ Log enregistré");
});

app.listen(4000, () => {
  console.log("🚀 Serveur de logs démarré sur http://localhost:4000");
});
