const express = require("express");
const router = express.Router();
const controller = require("../controllers/draftLinksController");

// Créer un lien
router.post("/create", controller.createDraftLink);

// Récupérer les liens (optionnellement par fileId)
router.get("/", controller.getDraftLinks);

// Supprimer un lien
router.delete("/:id", controller.deleteDraftLink);

module.exports = router;
