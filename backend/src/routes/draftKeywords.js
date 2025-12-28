const express = require("express");
const router = express.Router();
const controller = require("../controllers/draftKeywordsController");

// Créer un keyword
router.post("/create", controller.createDraftKeyword);

// Récupérer les keywords (optionnellement par fileId)
router.get("/", controller.getDraftKeywords);

// Mettre à jour un keyword
router.patch("/:id", controller.updateDraftKeyword);

// UPDATE — position uniquement
router.patch("/:id/position", controller.updateDraftKeywordPosition);

// Supprimer un keyword (seulement si aucun lien)
router.delete("/:id", controller.deleteDraftKeyword);

module.exports = router;
