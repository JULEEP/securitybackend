import express from "express";
import {
  createProjectController,
  getAllProjectsController,
  getProjectByIdController,
  getProjectsByUserIdController,
  updateProjectController,
  deleteProjectController,
} from "../controllers/project.controller.js";

const router = express.Router();

// Create new project
router.post("/create/:userId", createProjectController);

// Get all projects
router.get("/all", getAllProjectsController);

// Get project by ID
router.get("/:projectId", getProjectByIdController);

// Get projects by user ID
router.get("/user/:userId", getProjectsByUserIdController);

// Update project
router.put("/:projectId", updateProjectController);

// Delete project
router.delete("/:projectId", deleteProjectController);

export default router;
