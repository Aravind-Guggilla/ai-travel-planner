const {registerUser, getUserByEmail} = require('../services/authService')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (request, response) => {
  // Implementation for user registration
  try {
    const { name, email, password } = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const dbUser = await getUserByEmail(email);
    if (dbUser === undefined) {
        const result = await registerUser({ name, email, hashedPassword });
        response.status(201).json({
        message: "User Created Successfully",
        userId: result.id
        });
    } else {
        response.status(400).json({ error: "User already exists" });
    }

  } catch (error) {
    console.error("Registration Error:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (request, response) => {
  // Implementation for user login
  try{
    const { email, password } = request.body;
    const userDetail = await getUserByEmail(email);

    if (userDetail === undefined) {
      response.status(404).json({ error: "User not found" });
    }else{
      const isPasswordValid = await bcrypt.compare(password, userDetail.password);

      if (isPasswordValid === true) {
        
        const payload = {
          userId: userDetail.id,
          email: userDetail.email
        }

        // const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET);

        response.status(200).json({ message: "Login successful", token: jwtToken });

      } else {
        response.status(400).json({ error: "Invalid password" });
      }
    }
    
  }catch(error){
    console.error("Login Error:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }

};

module.exports = { register, login };