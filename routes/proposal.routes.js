import express from "express";
import {
  createProposalController,
  getAllProposalsController,
  getProposalByIdController,
  updateProposalController,
  updateProposalStatusController,
  deleteProposalController,
} from "../controllers/proposals.controller.js";

const router = express.Router();

// Create new proposal
router.post("/create/:userId", createProposalController);

// Get all proposals
router.get("/all", getAllProposalsController);

// Get proposal by ID
router.get("/:proposalId", getProposalByIdController);

// Update proposal
router.put("/:proposalId", updateProposalController);

// Update proposal status
router.patch("/:proposalId/status", updateProposalStatusController);

// Delete proposal
router.delete("/:proposalId", deleteProposalController);

export default router;
