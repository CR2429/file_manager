const express = require("express");
const cors = require("cors");

const draftFilesRoutes = require("./routes/draftFiles");
const draftKeywordsRoutes = require("./routes/draftKeywords");
const draftLinksRoutes = require("./routes/draftLinks");
const positionRoutes = require("./routes/position");
const publishRoutes = require("./routes/publish");
const apiAuth = require("./middleware/apiAuth");

const app = express();

app.use(cors());
app.use(express.json());

// Route publique basique pour tester que le backend tourne
app.get("/", (req, res) => {
    res.send("Blueprint backend is running");
});

// Toutes les routes suivantes sont protégées par le token (si API_TOKEN est défini)
app.use(apiAuth);

app.use("/draft/files", draftFilesRoutes);
app.use("/draft/keywords", draftKeywordsRoutes);
app.use("/draft/links", draftLinksRoutes);
app.use("/draft/position", positionRoutes);
// app.use("/publish", publishRoutes);

module.exports = app;
