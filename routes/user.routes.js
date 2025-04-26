import express from "express";
import {
    signup,
    login,
    getAllUsers,
    getSkillsForUser,
    createBasicInfoController,
    createUserSocialInfoController,
    createEducationDetailsController,
    addExperience,
    addSkills,
    addAwards
} from "../controllers/user.controller.js";

const router = express.Router();

// Signup route
router.post("/register", signup);

// Login route
router.post("/login", login);
router.get("/get", getAllUsers);
router.get('/get-skills/:userId', getSkillsForUser)
router.post('/add-basicinfo/:userId', createBasicInfoController)
router.post('/add-urls/:userId', createUserSocialInfoController)
router.post('/add-edu/:userId', createEducationDetailsController)
router.post('/add-experience/:userId', addExperience)
router.post("/add-skills/:userId", addSkills);
router.post("/add-awards/:userId", addAwards);


export default router;
