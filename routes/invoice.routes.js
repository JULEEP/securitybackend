import express from "express";
import {
  createInvoiceController,
  getAllInvoicesController,
  getInvoiceByIdController,
  downloadInvoiceController,
  updateInvoiceController,
  deleteInvoiceController,
} from "../controllers/invoice.controller.js";

const router = express.Router();

router.post("/create", createInvoiceController); // Route to create an invoice
router.get("/all", getAllInvoicesController); // Router Get All invoice
router.get("/:id", getInvoiceByIdController); // Router to get invoice by id
router.get("/download/:id", downloadInvoiceController); // Router to Download 
router.put("/:id", updateInvoiceController); //Update the invoice
router.delete("/:id", deleteInvoiceController); //Delete the invoice

export default router;
