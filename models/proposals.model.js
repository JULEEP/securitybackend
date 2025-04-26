import pool from "../config/db.config.js";

const createProposalsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS proposals (
      id SERIAL PRIMARY KEY,
      freelancer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      client_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      proposal_type VARCHAR(50) CHECK (proposal_type IN ('fixed', 'hourly')),
      estimated_duration VARCHAR(50),
      status VARCHAR(50) DEFAULT 'pending' CHECK (
        status IN ('pending', 'viewed', 'shortlisted', 'accepted', 'rejected', 'withdrawn')
      ),
      cover_letter TEXT,
      attachments TEXT[],
      applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_activity_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      activity_log JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    await pool.query(query);
    // console.log("Proposals table created successfully");
  } catch (err) {
    console.error("Error creating proposals table:", err);
    throw err;
  }
};


createProposalsTable();

// Create a new proposal
const createProposal = async (proposalData) => {
  const {
    freelancer_id,
    client_id,
    project_id,
    title,
    description,
    amount,
    proposal_type,
    estimated_duration,
    cover_letter,
    attachments,
  } = proposalData;

  const query = `
    INSERT INTO proposals (
      freelancer_id, client_id, project_id, title, description,
      amount, proposal_type, estimated_duration, cover_letter,
      attachments, activity_log
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *
  `;

  // Initial activity log entry
  const initialActivity = [
    {
      timestamp: new Date(),
      action: "submitted",
      status: "pending",
      description: "Proposal submitted by freelancer",
    },
  ];

  const values = [
    freelancer_id,
    client_id,
    project_id,
    title,
    description,
    amount,
    proposal_type,
    estimated_duration,
    cover_letter,
    attachments,
    JSON.stringify(initialActivity),
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Update proposal status
const updateProposalStatus = async (proposalId, newStatus, notes = "") => {
  const activityLog = {
    timestamp: new Date(),
    action: "status_updated",
    status: newStatus,
    description: notes || `Status updated to ${newStatus}`,
  };

  const query = `
    UPDATE proposals
    SET 
      status = $1,
      activity_log = activity_log || $2::jsonb,
      last_activity_date = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *
  `;

  const result = await pool.query(query, [
    newStatus,
    JSON.stringify([activityLog]),
    proposalId,
  ]);
  return result.rows[0];
};

// Update proposal
const updateProposal = async (proposalId, proposalData) => {
  const updates = [];
  const values = [];
  let paramCount = 1;

  // Check each field and only include it if it's provided
  const fields = [
    'title',
    'description',
    'amount',
    'proposal_type',
    'estimated_duration',
    'status',
    'cover_letter',
    'attachments'
  ];

  fields.forEach(field => {
    if (field in proposalData) {
      updates.push(`${field} = $${paramCount}`);
      values.push(proposalData[field]);
      paramCount++;
    }
  });

  // Always update the updated_at timestamp
  updates.push('updated_at = CURRENT_TIMESTAMP');

  
  if (updates.length === 1) {
    const existing = await getProposalById(proposalId);
    return existing;
  }

  const query = `
    UPDATE proposals 
    SET ${updates.join(', ')}
    WHERE id = $${paramCount}
    RETURNING *
  `;

  values.push(proposalId);
  const result = await pool.query(query, values);
  return result.rows[0];
};


// Get all proposals
const getAllProposals = async () => {
  const query = `
    SELECT 
      p.*,
      f.name as freelancer_name,
      c.name as client_name,
      pr.title as project_title
    FROM proposals p
    JOIN users f ON p.freelancer_id = f.id
    JOIN users c ON p.client_id = c.id
    JOIN projects pr ON p.project_id = pr.id
    ORDER BY p.created_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

// Get proposal by ID
const getProposalById = async (proposalId) => {
  const query = `
    SELECT 
      p.*,
      f.name as freelancer_name,
      c.name as client_name,
      pr.title as project_title
    FROM proposals p
    JOIN users f ON p.freelancer_id = f.id
    JOIN users c ON p.client_id = c.id
    JOIN projects pr ON p.project_id = pr.id
    WHERE p.id = $1
  `;
  const result = await pool.query(query, [proposalId]);
  return result.rows[0];
};

// Delete proposal
const deleteProposal = async (proposalId) => {
  const query = "DELETE FROM proposals WHERE id = $1 RETURNING *";
  const result = await pool.query(query, [proposalId]);
  return result.rows[0];
};

export {
  createProposalsTable,
  createProposal,
  updateProposalStatus,
  updateProposal,
  getAllProposals,
  getProposalById,
  deleteProposal,
};
