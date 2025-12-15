const express = require("express");
const router = express.Router();
const controller = require("../controllers/draftFilesController");

// CREATE
router.post("/create", controller.createDraftFile);

// READ
router.get("/", controller.getDraftFiles);

// UPDATE — position uniquement
router.patch("/:id/position", controller.updateDraftFilePosition);

// UPDATE — contenu uniquement
router.patch("/:id/content", controller.updateDraftFileContent);

// UPDATE — patch général (optionnel / legacy)
router.patch("/:id", controller.updateDraftFile);

// DELETE
router.delete("/:id", controller.deleteDraftFile);

module.exports = router;
