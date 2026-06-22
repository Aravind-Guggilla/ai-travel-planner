const { getDB } = require("../database/db");

const createTrip = async (tripData) => {
    const db = getDB();
    const {userId, destination, days, budgetType, interests} = tripData;
    const createTripQuery = `
        INSERT INTO 
            trips (user_id, destination, days, budget_type, interests)
        VALUES (?, ?, ?, ?, ?)
    `;
    const result = await db.run(createTripQuery, userId, destination, days, budgetType, JSON.stringify(interests));
    return { tripId: result.lastID };
};

const getTripsByUserId = async (userId) => {
    const db = getDB();
    const getTripsQuery = `
        SELECT * FROM trips WHERE user_id = ?
    `;
    const trips = await db.all(getTripsQuery, userId);
    return trips;
};

const getTripDetailsById = async (tripId) => {
    const db = getDB();
    const getTripDetailsQuery = `
        SELECT * FROM trips WHERE id = ?
    `;
    const trip = await db.get(getTripDetailsQuery, tripId);
    return trip;
}

const deleteTripById = async (tripId) => {
    const db = getDB();
    const deleteTripQuery = `
        DELETE FROM trips WHERE id = ?
    `;
    await db.run(deleteTripQuery, tripId);
};

const updateTripById = async (tripId, updatedData) => {
    const db = getDB();
    const {destination, days, budgetType, interests } = updatedData;

    const query = `
        UPDATE 
            trips
        SET
            destination = ?,
            days = ?,
            budget_type = ?,
            interests = ?
        WHERE id = ?;
  `;

    await db.run( query, destination, days, budgetType, JSON.stringify(interests), tripId);
};

const generateTravelPlan = async (tripId, itinerary, estimatedBudget, hotels) => {
    
}

const saveTravelPlan = async (tripId, travelPlan) => {
  const db = getDB();

  const {itinerary, estimatedBudget, hotels} = travelPlan;

  const query = `
    UPDATE trips
    SET
      itinerary = ?,
      estimated_budget = ?,
      hotels = ?
    WHERE id = ?;
  `;

  await db.run(
    query,
    JSON.stringify(itinerary),
    JSON.stringify(estimatedBudget),
    JSON.stringify(hotels),
    tripId
  );
};

module.exports = {createTrip, 
getTripsByUserId, 
getTripDetailsById, 
deleteTripById, 
updateTripById, 
generateTravelPlan,
saveTravelPlan };