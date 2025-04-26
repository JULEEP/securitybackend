import pool from "../config/db.config.js";

const createProjectTable = async () => {
  const query = `
        CREATE TABLE IF NOT EXISTS projects (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            assigned_to INTEGER REFERENCES users(id),
            title VARCHAR(255) NOT NULL,
            description TEXT,
            project_url VARCHAR(255),
            github_url VARCHAR(255),
            technologies TEXT[],
            image_url VARCHAR(255),
            start_date DATE,
            deadline DATE,
            status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed')),
            visibility VARCHAR(50) DEFAULT 'public',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
  try {
    await pool.query(query);
    // console.log("Projects table created successfully");
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
    assigned_to,
    title,
    description,
    project_url,
    github_url,
    technologies,
    image_url,
    start_date,
    deadline,
    status,
    visibility,
  } = projectData;

  const query = `
        INSERT INTO projects (
            user_id, assigned_to, title, description, project_url, github_url,
            technologies, image_url, start_date, deadline, status, visibility
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
    `;

  const result = await pool.query(query, [
    user_id,
    assigned_to,
    title,
    description,
    project_url,
    github_url,
    technologies,
    image_url,
    start_date,
    deadline,
    status || 'pending', // Default to 'pending' if no status provided
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

// Update project function
const updateProject = async (projectId, projectData) => {
  // First get the existing project data
  const existingProject = await getProjectById(projectId);
  if (!existingProject) {
    return null;
  }

  // Create an array to store the fields to update and their values
  const updates = [];
  const values = [];
  let paramCount = 1;

  // Check each field and only include it if it's provided in projectData
  if ('title' in projectData) {
    updates.push(`title = $${paramCount}`);
    values.push(projectData.title);
    paramCount++;
  }
  if ('assigned_to' in projectData) {
    updates.push(`assigned_to = $${paramCount}`);
    values.push(projectData.assigned_to);
    paramCount++;
  }
  if ('description' in projectData) {
    updates.push(`description = $${paramCount}`);
    values.push(projectData.description);
    paramCount++;
  }
  if ('project_url' in projectData) {
    updates.push(`project_url = $${paramCount}`);
    values.push(projectData.project_url);
    paramCount++;
  }
  if ('github_url' in projectData) {
    updates.push(`github_url = $${paramCount}`);
    values.push(projectData.github_url);
    paramCount++;
  }
  if ('technologies' in projectData) {
    updates.push(`technologies = $${paramCount}`);
    values.push(projectData.technologies);
    paramCount++;
  }
  if ('image_url' in projectData) {
    updates.push(`image_url = $${paramCount}`);
    values.push(projectData.image_url);
    paramCount++;
  }
  if ('start_date' in projectData) {
    updates.push(`start_date = $${paramCount}`);
    values.push(projectData.start_date);
    paramCount++;
  }
  if ('deadline' in projectData) {
    updates.push(`deadline = $${paramCount}`);
    values.push(projectData.deadline);
    paramCount++;
  }
  if ('status' in projectData) {
    updates.push(`status = $${paramCount}`);
    values.push(projectData.status);
    paramCount++;
  }
  if ('visibility' in projectData) {
    updates.push(`visibility = $${paramCount}`);
    values.push(projectData.visibility);
    paramCount++;
  }

  // Always update the updated_at timestamp
  updates.push(`updated_at = CURRENT_TIMESTAMP`);

  // If no fields to update, return existing project
  if (updates.length === 1) { // Only updated_at
    return existingProject;
  }

  // Construct and execute the update query
  const query = `
    UPDATE projects 
    SET ${updates.join(', ')}
    WHERE id = $${paramCount}
    RETURNING *
  `;

  // Add projectId as the last parameter
  values.push(projectId);

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Delete project
const deleteProject = async (projectId) => {
  const query = "DELETE FROM projects WHERE id = $1 RETURNING *";
  const result = await pool.query(query, [projectId]);
  return result.rows[0];
};

export {
  createProjectTable,
  createProject,
  getAllProjects,
  getProjectById,
  getProjectsByUserId,
  updateProject,
  deleteProject,
};
