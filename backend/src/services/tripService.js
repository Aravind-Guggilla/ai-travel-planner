const {getDB} = require('../database/db')

const createTrip = async tripData => {
  const db = getDB()

  const {userId, destination, days, budgetType, interests} = tripData
  const query = `
    INSERT INTO trips
    (
      user_id,
      destination,
      days,
      budget_type,
      interests
    )
    VALUES
    ($1, $2, $3, $4, $5)
    RETURNING id;
  `

  const result = await db.query(query, [
    userId,
    destination,
    days,
    budgetType,
    JSON.stringify(interests),
  ])

  return {
    tripId: result.rows[0].id,
  }
}

const getTripsByUserId = async userId => {
  const db = getDB()

  const query = `
    SELECT *
    FROM trips
    WHERE user_id = $1;
  `

  const result = await db.query(query, [userId])

  return result.rows
}

const getTripDetailsById = async tripId => {
  const db = getDB()

  const query = `
    SELECT *
    FROM trips
    WHERE id = $1;
  `

  const result = await db.query(query, [tripId])

  return result.rows[0]
}

const deleteTripById = async tripId => {
  const db = getDB()

  const query = `
    DELETE FROM trips
    WHERE id = $1;
  `

  await db.query(query, [tripId])
}

const updateTripById = async (tripId, updatedData) => {
  const db = getDB()

  const {destination, days, budgetType, interests} = updatedData

  const query = `
    UPDATE trips
    SET
      destination = $1,
      days = $2,
      budget_type = $3,
      interests = $4
    WHERE id = $5;
  `

  await db.query(query, [
    destination,
    days,
    budgetType,
    JSON.stringify(interests),
    tripId,
  ])
}

const saveTravelPlan = async (tripId, travelPlan) => {
  const db = getDB()

  const {itinerary, estimatedBudget, hotels} = travelPlan

  const query = `
    UPDATE trips
    SET
      itinerary = $1,
      estimated_budget = $2,
      hotels = $3
    WHERE id = $4;
  `

  await db.query(query, [
    JSON.stringify(itinerary),
    JSON.stringify(estimatedBudget),
    JSON.stringify(hotels),
    tripId,
  ])
}

const updateItinerary = async (tripId, itinerary) => {
  const db = getDB()

  const query = `
    UPDATE trips
    SET itinerary = $1
    WHERE id = $2;
  `

  await db.query(query, [JSON.stringify(itinerary), tripId])
}

module.exports = {
  createTrip,
  getTripsByUserId,
  getTripDetailsById,
  deleteTripById,
  updateTripById,
  saveTravelPlan,
  updateItinerary,
}
