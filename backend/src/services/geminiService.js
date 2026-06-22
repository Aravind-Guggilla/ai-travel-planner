require("dotenv").config();
const {GoogleGenerativeAI} = require("@google/generative-ai");


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const AiGenerateTripPlan = async (tripData) => {
  const {destination, days, budgetType, interests} = tripData;

  const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

  const prompt = `
    You are an expert travel planner.

    Create a ${days} day travel plan for ${destination}.

    Budget Type:
    ${budgetType}

    Interests:
    ${interests.join(", ")}

    Return ONLY valid JSON.

    Format:

    {
      "itinerary": [
        {
          "day": 1,
          "activities": [
            "Activity 1",
            "Activity 2"
          ]
        }
      ],
      "estimatedBudget": {
        "flights": 0,
        "accommodation": 0,
        "food": 0,
        "activities": 0,
        "transportation": 0,
        "total": 0
      },
      "hotels": [
        {
          "name": "Hotel Name",
          "type": "Budget Friendly",
          "description": "Short description"
        }
      ]
    }

    Requirements:

    1. Create a detailed day-by-day itinerary.
    2. Include 4-6 activities per day.
    3. Estimate realistic travel costs in USD.
    4. Budget estimates must include:
      - flights
      - accommodation
      - food
      - activities
      - transportation
      - total
    5. Suggest exactly 3 hotels:
      - One budget option
      - One mid-range option
      - One luxury option
    6. Hotel suggestions should be relevant to the destination.
    7. Return only valid JSON.
    8. Do not use markdown.
    9. Do not include explanations.
    10. Do not wrap the response in \`\`\`json blocks.

    Return JSON only.
    `;

  const result = await model.generateContent(prompt);

  const text = result.response.text();

  const itinerary = JSON.parse(text);
  return itinerary;
};

const

module.exports = {
  AiGenerateTripPlan,
};