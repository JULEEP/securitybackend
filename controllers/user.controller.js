import { createUser, findUserByEmail, findAllUsers } from "../models/user.model.js";
import { createBasicInfoTable,
   createUserSocialInfoTable,
    createEducationDetailsTable,
    createExperienceTable,
    createSkillsTable,
    createAwardsTable
   } from "../models/basicInfo.model.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.config.js";

// controllers/userController.js
import { addSkill, getSkillsByUserId } from "../models/Skill.js";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "mysecretkey";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await createUser(name, email, hashedPassword);
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find the user
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to get all users
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users
    const users = await findAllUsers();

    // Check if no users are found
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    // Respond with the users list
    res.status(200).json({
      message: 'Users fetched successfully',
      users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const addBasicInfo = async (req, res) => {
  try {
    const { userId, field, value } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const basicInfo = await BasicInfo.create({ userId, field, value });

    res.status(201).json({ message: 'Basic info added successfully', basicInfo });
  } catch (error) {
    console.error('Error adding basic info:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addSkillForUser = async (req, res) => {
  const { userId } = req.params; // Extract userId from params
  const { skillNames } = req.body; // Expect array of skill names

  if (!Array.isArray(skillNames) || skillNames.length === 0) {
      return res.status(400).json({ message: "Skill names must be a non-empty array." });
  }

  try {
      const addedSkills = [];

      // Loop through each skill and insert it into the database
      for (const skillName of skillNames) {
          const newSkill = await addSkill(userId, skillName);
          addedSkills.push(newSkill);
      }

      // Return the updated list of skills
      res.status(201).json({
          message: "Skills added successfully",
          skills: addedSkills, // Return all newly added skills
      });
  } catch (err) {
      res.status(500).json({ message: "Error adding skills", error: err.message });
  }
};


// Controller function to get skills by user ID
export const getSkillsForUser = async (req, res) => {
  const { userId } = req.params;  // Get userId from route parameter

  try {
      // Fetch skills for the user from the database
      const skills = await getSkillsByUserId(userId);

      if (skills.length === 0) {
          return res.status(404).json({ message: "No skills found for this user." });
      }

      // Return the skills found for the user
      res.status(200).json({
          message: "Skills retrieved successfully",
          skills,  // Return the list of skills for the user
      });
  } catch (err) {
      res.status(500).json({ message: "Error retrieving skills", error: err });
  }
};

/// Function to insert new basic information (with only 10 columns)
export const createBasicInfoController = async (req, res) => {
  const { userId } = req.params; // Extract userId from URL parameters
  const {
    firstName, lastName, emailAddress, phoneNumber, currentPosition, categories,
    description, dateOfBirth, ageRange, gender, languages, qualification,
    yearsOfExperience, offerSalary, salaryType, currency, streetAddress, city,
    state, zipCode, country
  } = req.body; // Extract data from request body

  try {
    // Ensure the table is created before inserting
    await createBasicInfoTable();

    const insertQuery = `
    INSERT INTO user_basic_info (
      user_id, first_name, last_name, email_address, phone_number, current_position,
      categories, description, date_of_birth, age_range, gender, languages,
      qualification, years_of_experience, street_address, city, state, zip_code, country
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
    )
    RETURNING first_name, last_name, email_address, phone_number, current_position,
      categories, description, date_of_birth, age_range, gender, languages,
      qualification, years_of_experience, street_address, city, state, zip_code, country;
  `;

    const result = await pool.query(insertQuery, [
      userId, firstName, lastName, emailAddress, phoneNumber, currentPosition, categories,
      description, dateOfBirth, ageRange, gender, languages, qualification,
      yearsOfExperience, streetAddress, city, state, zipCode, country
    ]);

    return res.status(201).json({
      message: "User basic information created successfully",
      data: result.rows[0], // Only the relevant fields are returned in the response
    });
  } catch (err) {
    console.error("Error in createBasicInfoController:", err);
    return res.status(500).json({
      message: "Failed to create user basic information",
      error: err.message,
    });
  }
};


// Function to insert new social media information (with 5 fields)
export const createUserSocialInfoController = async (req, res) => {
  const { userId } = req.params; // Extract userId from URL parameters
  const { resumeFilePath, twitterLink, linkedinLink, facebookLink, instagramLink } = req.body; // Extract data from request body

  try {
    // Ensure the table is created before inserting
    await createUserSocialInfoTable();

    const insertQuery = `
      INSERT INTO user_social_info (
        user_id, resume_file_path, twitter_link, linkedin_link, facebook_link, instagram_link
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING resume_file_path, twitter_link, linkedin_link, facebook_link, instagram_link;
    `;

    const result = await pool.query(insertQuery, [
      userId, resumeFilePath, twitterLink, linkedinLink, facebookLink, instagramLink
    ]);

    return res.status(201).json({
      message: "User social media information created successfully",
      data: result.rows[0], // Only the relevant fields are returned in the response
    });
  } catch (err) {
    console.error("Error in createUserSocialInfoController:", err);
    return res.status(500).json({
      message: "Failed to create user social media information",
      error: err.message,
    });
  }
};



// Controller to update existing basic information for a user
export const updateBasicInfoController = async (req, res) => {
  const { userId } = req.params; // Extract userId from request params
  const {
      firstName,
      lastName,
      emailAddress,
      phoneNumber,
      currentPosition,
      categories,
      description,
      dateOfBirth,
      ageRange,
      gender,
      languages,
      qualification,
      yearsOfExperience,
      offerSalary,
      salaryType,
      currency,
      streetAddress,
      city,
      state,
      zipCode,
      country,
      resumeFilePath,
      twitterLink,
      linkedinLink,
      facebookLink,
      instagramLink,
  } = req.body; // Extract all basic information fields from request body

  try {
      // Call the model function to add or update basic info
      const updatedInfo = await addOrUpdateBasicInfo(userId, {
          firstName,
          lastName,
          emailAddress,
          phoneNumber,
          currentPosition,
          categories,
          description,
          dateOfBirth,
          ageRange,
          gender,
          languages,
          qualification,
          yearsOfExperience,
          offerSalary,
          salaryType,
          currency,
          streetAddress,
          city,
          state,
          zipCode,
          country,
          resumeFilePath,
          twitterLink,
          linkedinLink,
          facebookLink,
          instagramLink,
      });

      res.status(200).json({
          message: "User basic information updated successfully",
          data: updatedInfo,
      });
  } catch (err) {
      console.error("Error in updateBasicInfoController:", err);
      res.status(500).json({
          message: "Failed to update user basic information",
          error: err.message,
      });
  }
};

// Controller to fetch basic information by user ID
export const getBasicInfoByUserIdController = async (req, res) => {
  const { userId } = req.params; // Extract userId from request params

  try {
      // Call the model function to fetch basic info
      const basicInfo = await getBasicInfoByUserId(userId);

      if (!basicInfo) {
          return res.status(404).json({ message: "Basic information not found for this user" });
      }

      res.status(200).json({
          message: "User basic information retrieved successfully",
          data: basicInfo,
      });
  } catch (err) {
      console.error("Error in getBasicInfoByUserIdController:", err);
      res.status(500).json({
          message: "Error retrieving user basic information",
          error: err.message,
      });
  }
};

// Controller to insert new education details
export const createEducationDetailsController = async (req, res) => {
  const { userId } = req.params; // Extract userId from URL parameters
  const {
    title,
    universityName,
    levelOfEducation,
    fromDate,
    toDate,
    description,
    about,
  } = req.body; // Extract data from the request body

  try {
    // Ensure the table is created before inserting
    await createEducationDetailsTable();

    const insertQuery = `
      INSERT INTO education_details (
        user_id, title, university_name, level_of_education, from_date, to_date,
        description, about
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      )
      RETURNING id, title, university_name, level_of_education, from_date, to_date, description, about;
    `;

    const result = await pool.query(insertQuery, [
      userId,
      title,
      universityName,
      levelOfEducation,
      fromDate,
      toDate,
      description,
      about,
    ]);

    return res.status(201).json({
      message: "Education details created successfully",
      data: result.rows[0], // Return the inserted data
    });
  } catch (err) {
    console.error("Error in createEducationDetailsController:", err);
    res.status(500).json({
      message: "Failed to create education details",
      error: err.message,
    });
  }
};

export const addExperience = async (req, res) => {
  const { userId } = req.params; // Get userId from URL params
  const {
    job_title,
    company,
    location,
    degree,
    from_date,
    to_date,
    description,
  } = req.body;

  // Validate input
  if (!job_title || !company || !from_date) {
    return res.status(400).json({
      error: "job_title, company, and from_date are required fields.",
    });
  }

  const query = `
    INSERT INTO experience (user_id, job_title, company, location, degree, from_date, to_date, description)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;

  const values = [userId, job_title, company, location, degree, from_date, to_date, description];

  try {
    // Ensure the experience table exists
    await createExperienceTable();

    // Insert experience entry
    const result = await pool.query(query, values);
    res.status(201).json({
      message: "Experience added successfully.",
      experience: result.rows[0],
    });
  } catch (err) {
    console.error("Error adding experience:", err.message);
    res.status(500).json({
      error: "An error occurred while adding the experience.",
    });
  }

};

// Add skills for a user
export const addSkills = async (req, res) => {
  const { userId } = req.params; // Get userId from URL params
  const { skills } = req.body; // Skills should be an array of strings

  // Validate input
  if (!Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({
      error: "Skills must be a non-empty array.",
    });
  }

  const query = `
    INSERT INTO skills (user_id, skill_name)
    VALUES ($1, unnest($2::text[]))
    RETURNING *;
  `;

  const values = [userId, skills];

  try {
    // Ensure the skills table exists
    await createSkillsTable();

    // Insert skills into the table
    const result = await pool.query(query, values);
    res.status(201).json({
      message: "Skills added successfully.",
      skills: result.rows,
    });
  } catch (err) {
    console.error("Error adding skills:", err.message);
    res.status(500).json({
      error: "An error occurred while adding the skills.",
    });
  }
};

// Add awards for a user
export const addAwards = async (req, res) => {
  const { userId } = req.params; // Get userId from URL params
  const { awards } = req.body; // Awards should be an array of objects with title, award_date, and description

  // Validate input
  if (!Array.isArray(awards) || awards.length === 0) {
    return res.status(400).json({
      error: "Awards must be a non-empty array.",
    });
  }

  try {
    // Ensure the awards table exists
    await createAwardsTable();

    // Insert awards into the table
    const query = `
      INSERT INTO awards (user_id, title, award_date, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const insertedAwards = [];
    for (const award of awards) {
      const { title, award_date, description } = award;

      // Validate required fields
      if (!title || !award_date) {
        return res.status(400).json({
          error: "Each award must have a title and award_date.",
        });
      }

      const result = await pool.query(query, [userId, title, award_date, description]);
      insertedAwards.push(result.rows[0]);
    }

    res.status(201).json({
      message: "Awards added successfully.",
      awards: insertedAwards,
    });
  } catch (err) {
    console.error("Error adding awards:", err.message);
    res.status(500).json({
      error: "An error occurred while adding the awards.",
    });
  }
};

