const { getDB } = require("../database/db");

const registerUser = async (userData) => {
    const { name, email, hashedPassword } = userData;
    const db = getDB();
    const createUserQuery = `
      INSERT INTO 
        users (name, email, password) 
      VALUES 
        (
          '${name}',
          '${email}', 
          '${hashedPassword}'
        )`;
    const dbResponse = await db.run(createUserQuery);
    const newUserId = dbResponse.lastID;
    return { id: newUserId};
}

const getUserByEmail = async (email) => {
    const db = getDB();
    const query = `
        SELECT * FROM 
            users
        WHERE 
            email = ?;
        `;

    const dbUser = await db.get(query, email);
    return dbUser;
}

module.exports = { registerUser, getUserByEmail };