const express = require("express");
const router = express.Router();
const controller = require("../controllers/positionController");

// PATCH /draft/position
router.patch("/", controller.updatePosition);

module.exports = router;