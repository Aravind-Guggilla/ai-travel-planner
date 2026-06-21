const jwt = require("jsonwebtoken");

const authenticateToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401).json({ error: "JWT Token is missing" });
  } else {
    jwt.verify(jwtToken, process.env.JWT_SECRET, async (error, payload) => {
      if (error) {
        response.status(401).json({ error: "Invalid JWT Token" }    );
      } else {
        request.user = payload;
        next();
      }
    });
  }
};

module.exports = authenticateToken;