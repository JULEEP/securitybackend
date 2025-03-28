import pool from "../config/db.config.js";

const createSkillsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS skills (
            id SERIAL PRIMARY KEY,
            skill_name VARCHAR(255) NOT NULL,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    await pool.query(query);
};

createSkillsTable();


const addSkill = async (userId, skillName) => {
    const query = "INSERT INTO skills (skill_name, user_id) VALUES ($1, $2) RETURNING *"; // Declare query outside
    try {
        const result = await pool.query(query, [skillName, userId]);
        return result.rows[0];
    } catch (err) {
        console.error("Error in addSkill:", { query, params: [skillName, userId], error: err });
        throw err;
    }
};



// Function to get skills by user ID
const getSkillsByUserId = async (userId) => {
    const query = "SELECT * FROM skills WHERE user_id = $1";
    const result = await pool.query(query, [userId]);
    return result.rows;
};

export { createSkillsTable, addSkill, getSkillsByUserId };
