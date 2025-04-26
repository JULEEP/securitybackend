import pool from "../config/db.config.js"; // PostgreSQL pool

// Create the invoices table if it doesn't exist
export const createInvoiceTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS invoices (
      id SERIAL PRIMARY KEY,
      invoice_number VARCHAR(255) UNIQUE NOT NULL,
      client VARCHAR(255) NOT NULL,
      amount NUMERIC(10, 2) NOT NULL,
      date_issued DATE NOT NULL,
      status VARCHAR(20) CHECK (status IN ('Paid', 'Pending', 'Unpaid')) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
};

export const createInvoice = async (data) => {
  const { invoice_number, client, amount, date_issued, status } = data;

  const result = await pool.query(
    `INSERT INTO invoices (invoice_number, client, amount, date_issued, status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [invoice_number, client, amount, date_issued, status]
  );

  return result.rows[0];// Return the newly created invoice
};

// Get all invoices
export const getAllInvoices = async () => {
  const result = await pool.query("SELECT * FROM invoices ORDER BY date_issued DESC");
  return result.rows;
};

// Get invoice by ID
export const getInvoiceById = async (id) => {
  const result = await pool.query("SELECT * FROM invoices WHERE id = $1", [id]);
  return result.rows[0];
};

// For downloading (can be same as getInvoiceById, or custom if needed)
export const getInvoiceForDownload = async (id) => {
  return getInvoiceById(id); // reuse
};

// Update invoice
export const updateInvoice = async (id, data) => {
  const { invoice_number, client, amount, date_issued, status } = data;

  const result = await pool.query(
    `UPDATE invoices SET
      invoice_number = $1,
      client = $2,
      amount = $3,
      date_issued = $4,
      status = $5,
      updated_at = NOW()
     WHERE id = $6
     RETURNING *`,
    [invoice_number, client, amount, date_issued, status, id]
  );

  return result.rows[0];
};

// Delete invoice
export const deleteInvoice = async (id) => {
  await pool.query("DELETE FROM invoices WHERE id = $1", [id]);
};
