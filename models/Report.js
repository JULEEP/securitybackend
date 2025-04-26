import pool from "../config/db.js";

// Create Report table if not exists
export const createReportTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS reports (
      id SERIAL PRIMARY KEY,
      report_name VARCHAR(255) NOT NULL,
      generated_on TIMESTAMP DEFAULT NOW(),
      data JSON
    );
  `;
  await pool.query(query);
};

// Example: get all reports
export const getAllReports = async () => {
  const result = await pool.query("SELECT * FROM reports ORDER BY generated_on DESC");
  return result.rows;
};
