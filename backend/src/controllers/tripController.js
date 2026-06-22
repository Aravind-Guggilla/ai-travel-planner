const { createTrip, 
getTripsByUserId, 
getTripDetailsById, 
deleteTripById, 
updateTripById,
saveTravelPlan
} = require("../services/tripService");

const {AiGenerateTripPlan, AiRegenerateDayPlan} = require("../services/geminiService");


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

const deleteTripByIdController = async (request, response) => {
    try{
        const tripId = request.params.tripId; // Assuming the trip ID is passed as a URL parameter 
        const userId = request.user.userId;
        const tripDetails = await getTripDetailsById(tripId);

        if(!tripDetails){
            return response.status(404).json({ error: "Trip not found" });
        }

        if(tripDetails.user_id !== userId){
            return response.status(403).json({ error: "Access denied" });
        }

        await deleteTripById(tripId);
        response.status(200).json({ message: "Trip deleted successfully" });

    }catch(error){
        console.error("Delete Trip Error:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
}

const updateTripByIdController = async (request, response) => {
    try{
        const tripId = request.params.tripId; // Assuming the trip ID is passed as a URL parameter 
        const { destination, days, budgetType, interests } = request.body;
        const userId = request.user.userId;
        const tripDetails = await getTripDetailsById(tripId);

        if(!tripDetails){
            return response.status(404).json({ error: "Trip not found" });
        }

        if(tripDetails.user_id !== userId){
            return response.status(403).json({ error: "Access denied" });
        }

        await updateTripById(tripId, { destination, days, budgetType, interests });
        response.status(200).json({ message: "Trip updated successfully" });

    }catch(error){
        console.error("Update Trip Error:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
}

const generateTravelPlanController = async (request, response) => {
    try{
        const { tripId } = request.params;

        const userId = request.user.userId;

        const trip = await getTripDetailsById(tripId);

        if (trip.user_id !== userId) {
            return response.status(403).json({
            error:
                "Unauthorized Access",
            });
        }

        const travelPlan = await AiGenerateTripPlan(
            {
                destination: trip.destination,
                days: trip.days,
                budgetType: trip.budget_type,
                interests: JSON.parse(trip.interests),
            }
        );

        await saveTravelPlan(tripId, travelPlan);

        response.status(200).json({ message: "Travel plan generated and saved successfully", travelPlan });

    }catch(error){
        console.error("Generate Travel Plan Error:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
}

const regenerateDayPlanController = async (request, response) => {
    try{

        const { tripId } = request.params;

        const {day, instruction} = request.body;

        const userId = request.user.userId;

        const trip = await getTripDetailsById(tripId);

        if (!trip) {
            return response.status(404).json({
                error: "Trip Not Found"
            });
        }

        if (trip.user_id !== userId) {
            return response.status(403).json({
                error: "Unauthorized Access"
            });
        }

        const itinerary = JSON.parse(trip.itinerary);

        //passing the entire trip data to the Gemini model so that it can regenerate the plan for the 
        // specific day based on the user instruction while keeping the rest of the itinerary intact

        const regeneratedDay = await AiRegenerateDayPlan(
            {
                destination: trip.destination,
                day,
                instruction,
                budgetType: trip.budget_type,
                interests: JSON.parse(trip.interests)
            }
        );

        itinerary[day - 1] = regeneratedDay; // Update the specific day in the itinerary with the regenerated plan

        await saveTravelPlan(tripId, itinerary); // Save the updated itinerary back to the database

        response.status(200).json({message: "Day Regenerated Successfully", itinerary});

    }catch(error){
        console.error("Regenerate Day Plan Error:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { 
    createTripController, 
    getTripsByUserIdController, 
    getTripDetailsByIdController, 
    deleteTripByIdController,
    updateTripByIdController,
    generateTravelPlanController,
    regenerateDayPlanController
};