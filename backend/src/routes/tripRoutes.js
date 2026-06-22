const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const { createTripController, 
    getTripsByUserIdController, 
    getTripDetailsByIdController, 
    deleteTripByIdController,
    updateTripByIdController,
    generateTravelPlanController
} = require("../controllers/tripController");

router.post("/trips/create", authenticateToken, createTripController);

router.get("/trips", authenticateToken, getTripsByUserIdController);

router.get("/trips/:tripId", authenticateToken, getTripDetailsByIdController);

router.delete("/trips/delete/:tripId", authenticateToken, deleteTripByIdController);

router.put("/trips/update/:tripId", authenticateToken, updateTripByIdController);

router.post("/trips/:tripId/generate", authenticateToken, generateTravelPlanController);

module.exports = router;