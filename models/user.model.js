import pool from "../config/db.config.js";

const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(query);
};


createUserTable();

const createUser = async (name, email, hashedPassword) => {
  const query = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *";
  const result = await pool.query(query, [name, email, hashedPassword]);
  return result.rows[0];
};


const findUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

// Function to fetch all users
 const findAllUsers = async () => {
  const query = 'SELECT * FROM users';  // Query to select all users
  const result = await pool.query(query);  // Execute the query
  return result.rows;  // Return the result (users list)
};

export { createUser, findUserByEmail, findAllUsers };
