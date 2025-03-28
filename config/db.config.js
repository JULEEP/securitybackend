import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
    user: "postgres",         // PostgreSQL default user
    host: "localhost",        // Host where PostgreSQL is running
    database: "security",     // Default database (can change to your desired DB name)
    password: "root", // Replace with your actual password
    port: 5432,               // Default PostgreSQL port
});

pool.connect()
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Error connecting to the database", err));

export default pool;
