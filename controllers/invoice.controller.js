import { createInvoice, getAllInvoices, getInvoiceById, updateInvoice, deleteInvoice, getInvoiceForDownload } from "../models/invoice.model.js";

// Create the Invoice
export const createInvoiceController = async (req, res) => {
  try {
    const newInvoice = await createInvoice(req.body);
    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: newInvoice,
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({
      success: false,
      message: "Error creating invoice",
      error: error.message,
    });
  }
};

// Get all Invoices
export const getAllInvoicesController = async (req, res) => {
  try {
    const invoices = await getAllInvoices();
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get invoices by id
export const getInvoiceByIdController = async (req, res) => {
  try {
    const invoice = await getInvoiceById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// To download Invoice
export const downloadInvoiceController = async (req, res) => {
  try {
    const invoice = await getInvoiceForDownload(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    res.setHeader("Content-Disposition", `attachment; filename=invoice-${invoice.invoice_number}.json`);
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update the Invoice
export const updateInvoiceController = async (req, res) => {
  try {
    const updated = await updateInvoice(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Delete the Invoice
export const deleteInvoiceController = async (req, res) => {
  try {
    await deleteInvoice(req.params.id);
    res.send("Invoice deleted");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
