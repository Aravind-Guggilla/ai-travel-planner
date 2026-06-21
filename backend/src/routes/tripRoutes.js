const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const { createTripController, getTripsByUserIdController, getTripDetailsByIdController, deleteTripByIdController} = require("../controllers/tripController");

router.post("/trips/create", authenticateToken, createTripController);

router.get("/trips", authenticateToken, getTripsByUserIdController);

router.get("/trips/:tripId", authenticateToken, getTripDetailsByIdController);

router.delete("/trips/delete/:tripId", authenticateToken, deleteTripByIdController);

module.exports = router;