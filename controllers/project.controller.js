import {
  createProject,
  getAllProjects,
  getProjectById,
  getProjectsByUserId,
  updateProject,
  deleteProject,
} from "../models/project.model.js";

// Create new project
export const createProjectController = async (req, res) => {
  try {
    const projectData = {
      user_id: req.params.userId,
      ...req.body,
    };

    const project = await createProject(projectData);
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error in createProjectController:", error);
    res.status(500).json({
      success: false,
      message: "Error creating project",
      error: error.message,
    });
  }
};

// Get all projects
export const getAllProjectsController = async (req, res) => {
  try {
    const projects = await getAllProjects();
    res.status(200).json({
      success: true,
      message: "Projects retrieved successfully",
      data: projects,
    });
  } catch (error) {
    console.error("Error in getAllProjectsController:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving projects",
      error: error.message,
    });
  }
};

// Get project by ID
export const getProjectByIdController = async (req, res) => {
  try {
    const project = await getProjectById(req.params.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Project retrieved successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error in getProjectByIdController:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving project",
      error: error.message,
    });
  }
};

// Get projects by user ID
export const getProjectsByUserIdController = async (req, res) => {
  try {
    const projects = await getProjectsByUserId(req.params.userId);
    res.status(200).json({
      success: true,
      message: "User projects retrieved successfully",
      data: projects,
    });
  } catch (error) {
    console.error("Error in getProjectsByUserIdController:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving user projects",
      error: error.message,
    });
  }
};

// Update project
export const updateProjectController = async (req, res) => {
  try {
    const updatedProject = await updateProject(req.params.projectId, req.body);
    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error("Error in updateProjectController:", error);
    res.status(500).json({
      success: false,
      message: "Error updating project",
      error: error.message,
    });
  }
};

// Delete project
export const deleteProjectController = async (req, res) => {
  try {
    const deletedProject = await deleteProject(req.params.projectId);
    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: deletedProject,
    });
  } catch (error) {
    console.error("Error in deleteProjectController:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting project",
      error: error.message,
    });
  }
};

export default {
  createProjectController,
  getAllProjectsController, 
  getProjectByIdController,
  getProjectsByUserIdController,
  updateProjectController,  
  deleteProjectController,
};