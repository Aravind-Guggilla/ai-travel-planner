const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const initializeDB = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("PostgreSQL Connected");
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

const getDB = () => {
  return pool;
};

module.exports = {
  initializeDB,
  getDB,
};