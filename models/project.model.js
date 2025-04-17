import pool from "../config/db.config.js";

const createProjectTable = async () => {
  const query = `
        CREATE TABLE IF NOT EXISTS projects (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            project_url VARCHAR(255),
            github_url VARCHAR(255),
            technologies TEXT[],
            image_url VARCHAR(255),
            start_date DATE,
            end_date DATE,
            is_ongoing BOOLEAN DEFAULT false,
            visibility VARCHAR(50) DEFAULT 'public',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
  try {
    await pool.query(query);
    console.log("Projects table created successfully");
  } catch (err) {
    console.error("Error creating projects table:", err);
    throw err;
  }
};

// Initialize table
createProjectTable();

// Create a new project
const createProject = async (projectData) => {
  const {
    user_id,
    title,
    description,
    project_url,
    github_url,
    technologies,
    image_url,
    start_date,
    end_date,
    is_ongoing,
    visibility,
  } = projectData;

  const query = `
        INSERT INTO projects (
            user_id, title, description, project_url, github_url,
            technologies, image_url, start_date, end_date, is_ongoing, visibility
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
    `;

  const result = await pool.query(query, [
    user_id,
    title,
    description,
    project_url,
    github_url,
    technologies,
    image_url,
    start_date,
    end_date,
    is_ongoing,
    visibility,
  ]);

  return result.rows[0];
};

// Get all projects
const getAllProjects = async () => {
  const query = "SELECT * FROM projects ORDER BY created_at DESC";
  const result = await pool.query(query);
  return result.rows;
};

// Get project by ID
const getProjectById = async (projectId) => {
  const query = "SELECT * FROM projects WHERE id = $1";
  const result = await pool.query(query, [projectId]);
  return result.rows[0];
};

// Get projects by user ID
const getProjectsByUserId = async (userId) => {
  const query =
    "SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC";
  const result = await pool.query(query, [userId]);
  return result.rows;
};

// Update project
const updateProject = async (projectId, projectData) => {
  const {
    title,
    description,
    project_url,
    github_url,
    technologies,
    image_url,
    start_date,
    end_date,
    is_ongoing,
    visibility,
  } = projectData;

  const query = `
        UPDATE projects
        SET title = $1,
            description = $2,
            project_url = $3,
            github_url = $4,
            technologies = $5,
            image_url = $6,
            start_date = $7,
            end_date = $8,
            is_ongoing = $9,
            visibility = $10,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $11
        RETURNING *
    `;

  const result = await pool.query(query, [
    title,
    description,
    project_url,
    github_url,
    technologies,
    image_url,
    start_date,
    end_date,
    is_ongoing,
    visibility,
    projectId,
  ]);

  return result.rows[0];
};

// Delete project
const deleteProject = async (projectId) => {
  const query = "DELETE FROM projects WHERE id = $1 RETURNING *";
  const result = await pool.query(query, [projectId]);
  return result.rows[0];
};

export {
  createProject,
  getAllProjects,
  getProjectById,
  getProjectsByUserId,
  updateProject,
  deleteProject,
};
