const express = require("express");
const router = express.Router();
const controller = require("../controllers/draftFilesController");

// Create a new draft file
router.post("/create", controller.createDraftFile);

// Get all draft files
router.get("/", controller.getDraftFiles);

// Update a draft file
router.patch("/:id", controller.updateDraftFile);

// Delete a draft file
router.delete("/:id", controller.deleteDraftFile);

module.exports = router;
