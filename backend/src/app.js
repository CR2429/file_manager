const express = require("express");
const cors = require("cors");

const draftFilesRoutes = require("./routes/draftFiles");
const draftKeywordsRoutes = require("./routes/draftKeywords");
const draftLinksRoutes = require("./routes/draftLinks");
const publishRoutes = require("./routes/publish");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Blueprint backend is running");
});

// === REGISTER ROUTES ===
app.use("/draft/files", draftFilesRoutes);
//app.use("/draft/keywords", draftKeywordsRoutes);
//app.use("/draft/links", draftLinksRoutes);
//app.use("/publish", publishRoutes);

module.exports = app;
