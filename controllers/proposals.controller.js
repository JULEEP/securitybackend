import {
  createProposal,
  getAllProposals,
  getProposalById,
  updateProposalStatus,
  updateProposal,
  deleteProposal,
} from "../models/proposals.model.js"; 

// Create new proposal
export const createProposalController = async (req, res) => {
  try {
    const proposalData = {
      freelancer_id: req.params.userId,
      ...req.body,
    };

    // Validate required fields
    const requiredFields = [
      "client_id",
      "project_id",
      "title",
      "description",
      "amount",
      "proposal_type",
    ];


    const missingFields = requiredFields.filter(
      (field) => !proposalData[field]
    );


    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const proposal = await createProposal(proposalData);
    res.status(201).json({
      success: true,
      message: "Proposal created successfully",
      data: proposal,
    });
  } catch (error) {
    console.error("Error in createProposalController:", error);
    res.status(500).json({
      success: false,
      message: "Error creating proposal",
      error: error.message,
    });
  }
};

// Get all proposals
export const getAllProposalsController = async (req, res) => {
  try {
    const proposals = await getAllProposals();
    res.status(200).json({
      success: true,
      message: "Proposals retrieved successfully",
      data: proposals,
    });
  } catch (error) {
    console.error("Error in getAllProposalsController:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving proposals",
      error: error.message,
    });
  }
};



// Get proposal by ID
export const getProposalByIdController = async (req, res) => {
  try {
    const proposal = await getProposalById(req.params.proposalId);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Proposal retrieved successfully",
      data: proposal,
    });
  } catch (error) {
    console.error("Error in getProposalByIdController:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving proposal",
      error: error.message,
    });
  }
};

// Update proposal
export const updateProposalController = async (req, res) => {
  try {
    const updatedProposal = await updateProposal(
      req.params.proposalId,
      req.body
    );

    if (!updatedProposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Proposal updated successfully",
      data: updatedProposal,
    });
  } catch (error) {
    console.error("Error in updateProposalController:", error);
    res.status(500).json({
      success: false,
      message: "Error updating proposal",
      error: error.message,
    });
  }
};

// Update proposal status
export const updateProposalStatusController = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { status, notes } = req.body;

    // Validate status
    const validStatuses = ['pending', 'viewed', 'shortlisted', 'accepted', 'rejected', 'withdrawn'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Get current proposal to check if it exists
    const currentProposal = await getProposalById(proposalId);
    if (!currentProposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found"
      });
    }

    // Update the status
    const updatedProposal = await updateProposalStatus(proposalId, status, notes);

    res.status(200).json({
      success: true,
      message: "Proposal status updated successfully",
      data: updatedProposal
    });
  } catch (error) {
    console.error("Error in updateProposalStatusController:", error);
    res.status(500).json({
      success: false,
      message: "Error updating proposal status",
      error: error.message
    });
  }
};

// Delete proposal
export const deleteProposalController = async (req, res) => {
  try {
    const deletedProposal = await deleteProposal(req.params.proposalId);

    if (!deletedProposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Proposal deleted successfully",
      data: deletedProposal,
    });
  } catch (error) {
    console.error("Error in deleteProposalController:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting proposal",
      error: error.message,
    });
  }
};

export default {
  createProposalController,
  getAllProposalsController,
  getProposalByIdController,
  updateProposalController,
  updateProposalStatusController,
  deleteProposalController,
};
