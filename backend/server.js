const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authenticateToken = require("./src/middleware/authMiddleware");

const { initializeDB } = require("./src/database/db");

const authRoutes = require("./src/routes/authRoutes");
const tripRoutes = require("./src/routes/tripRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes 
app.use("/api/auth", authRoutes);
app.use("/api", tripRoutes);

const initializeServer = async () => {
  try {
    await initializeDB();

    console.log("Database Connected");

    // app.get("/api", (request, response) => {
    //   response.send("AI Travel Planner API Running");
    // });

    app.listen(process.env.PORT, () => {
      console.log(`Server Running at http://localhost:${process.env.PORT}/`);
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

app.get("/profile", authenticateToken, (request, response) => {
  response.send({
    message: "Protected Route",
    user: request.user,
  });
});

app.get("/api", (request, response) => {
  response.send("AI Travel Planner API Running");
});

const {generateItinerary,} = require("./src/services/geminiService");

app.get("/test-gemini",async (request, response) => {
  const result =
    await generateItinerary({
      destination: "Tokyo",
      days: 3,
      budgetType: "Medium",
      interests: [
        "Food",
        "Culture",
      ],
    });

    response.send(result);
  }
);

initializeServer();

module.exports = app