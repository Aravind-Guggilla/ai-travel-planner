require("dotenv").config();
const {GoogleGenerativeAI} = require("@google/generative-ai");


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateItinerary = async (tripData) => {
  const {destination, days, budgetType, interests} = tripData;

  const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
        You are an expert travel planner.

        Create a ${days} day itinerary for ${destination}.

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
        ]
        }

        Do not include markdown.
        Do not include explanations.
        Return JSON only.
    `;

  const result = await model.generateContent(prompt);

  const text = result.response.text();

  const itinerary = JSON.parse(text);
  return itinerary;
};

module.exports = {
  generateItinerary,
};