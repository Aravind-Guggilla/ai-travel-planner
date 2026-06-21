const { createTrip, getTripsByUserId, getTripDetailsById } = require("../services/tripService");

const createTripController = async (request, response) => {
    try{
        const {destination, days, budgetType, interests } = request.body;
        const userId = request.user.userId; // Assuming the user ID is stored in the request object after authentication

        const result = await createTrip({ userId, destination, days, budgetType, interests });

        response.status(201).json({ message: "Trip Created Successfully", tripId: result.tripId });

    }catch(error){
        console.error("Create Trip Error:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
}

const getTripsByUserIdController = async (request, response) => {
    try{
        const userId = request.user.userId; // Assuming the user ID is stored in the request object after authentication
        const trips = await getTripsByUserId(userId);
        response.status(200).json({ trips });
    }catch(error){
        console.error("Get Trips Error:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
}

const getTripDetailsByIdController = async (request, response) => {
    try{
        const tripId = request.params.tripId; // Assuming the trip ID is passed as a URL parameter
        const tripDetails = await getTripDetailsById(tripId);

        if(!tripDetails){
            return response.status(404).json({ error: "Trip details not found" });
        }

        if(tripDetails.user_id !== request.user.userId){
            return response.status(403).json({ error: "Access denied" });
        }

        response.status(200).json({ tripDetails });
    }catch(error){
        console.error("Get Trip Details Error:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { createTripController, getTripsByUserIdController, getTripDetailsByIdController };