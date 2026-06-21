const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const { createTripController, getTripsByUserIdController, getTripDetailsByIdController} = require("../controllers/tripController");

router.post("/create", authenticateToken, createTripController);

router.get("/trips", authenticateToken, getTripsByUserIdController);

router.get("/trips/:tripId", authenticateToken, getTripDetailsByIdController);

module.exports = router;