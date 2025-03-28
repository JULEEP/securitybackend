import pool from "../config/db.config.js";

// Function to create user_basic_info table if it doesn't exist
const createBasicInfoTable = async () => {
  const query = `
      CREATE TABLE IF NOT EXISTS user_basic_info (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email_address VARCHAR(255) UNIQUE NOT NULL,
        phone_number VARCHAR(50),
        current_position VARCHAR(255),
        categories VARCHAR(255),
        description TEXT,
        date_of_birth DATE,
        age_range VARCHAR(50),
        gender VARCHAR(50),
        languages VARCHAR(255),
        qualification VARCHAR(255),
        years_of_experience VARCHAR(50),
        offer_salary NUMERIC,
        salary_type VARCHAR(50),
        currency VARCHAR(10),
        street_address VARCHAR(255),
        city VARCHAR(255),
        state VARCHAR(255),
        zip_code VARCHAR(10),
        country VARCHAR(255),
        resume_file_path VARCHAR(255),
        twitter_link VARCHAR(255),
        linkedin_link VARCHAR(255),
        facebook_link VARCHAR(255),
        instagram_link VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  try {
    await pool.query(query);
    console.log("user_basic_info table created successfully.");
  } catch (err) {
    console.error("Error creating user_basic_info table:", err);
    throw err;
  }
};

// Function to create user_social_info table if it doesn't exist
const createUserSocialInfoTable = async () => {
  const query = `
      CREATE TABLE IF NOT EXISTS user_social_info (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        resume_file_path VARCHAR(255),
        twitter_link VARCHAR(255),
        linkedin_link VARCHAR(255),
        facebook_link VARCHAR(255),
        instagram_link VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

  try {
    await pool.query(query);
    console.log("user_social_info table created successfully.");
  } catch (err) {
    console.error("Error creating user_social_info table:", err);
    throw err;
  }
};

// Function to create education_details table if it doesn't exist
const createEducationDetailsTable = async () => {
  const query = `
      CREATE TABLE IF NOT EXISTS education_details (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        university_name VARCHAR(255) NOT NULL,
        level_of_education VARCHAR(255) NOT NULL,
        from_date DATE NOT NULL,
        to_date DATE NOT NULL,
        description TEXT,
        about TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  try {
    await pool.query(query);
    console.log("education_details table created successfully.");
  } catch (err) {
    console.error("Error creating education_details table:", err);
    throw err;
  }
};


// Function to create the "experience" table
const createExperienceTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS experience (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      job_title VARCHAR(255) NOT NULL,
      company VARCHAR(255) NOT NULL,
      location VARCHAR(255),
      degree VARCHAR(255),
      from_date DATE NOT NULL,
      to_date DATE,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Experience table created successfully.");
  } catch (err) {
    console.error("Error creating experience table:", err.message);
    throw err;
  }
};

// Function to create the "skills" table
const createSkillsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS skills (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      skill_name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Skills table created successfully.");
  } catch (err) {
    console.error("Error creating skills table:", err.message);
    throw err;
  }
};

// Function to create the "awards" table
const createAwardsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS awards (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      award_date DATE NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Awards table created successfully.");
  } catch (err) {
    console.error("Error creating awards table:", err.message);
    throw err;
  }
};

// Function to add or update basic info
const addOrUpdateBasicInfo = async (userId, basicInfo) => {
  const {
    firstName, lastName, emailAddress, phoneNumber, currentPosition, categories,
    description, dateOfBirth, ageRange, gender, languages, qualification,
    yearsOfExperience, offerSalary, salaryType, currency, streetAddress, city,
    state, zipCode, country, resumeFilePath, twitterLink, linkedinLink,
    facebookLink, instagramLink
  } = basicInfo;

  try {
    // Check if the user already has basic info
    const checkQuery = "SELECT * FROM user_basic_info WHERE user_id = $1";
    const checkResult = await pool.query(checkQuery, [userId]);

    if (checkResult.rows.length > 0) {
      // Update existing info
      const updateQuery = `
                UPDATE user_basic_info
                SET 
                    first_name = $1, last_name = $2, email_address = $3, phone_number = $4,
                    current_position = $5, categories = $6, description = $7,
                    date_of_birth = $8, age_range = $9, gender = $10, languages = $11,
                    qualification = $12, years_of_experience = $13, offer_salary = $14,
                    salary_type = $15, currency = $16, street_address = $17, city = $18,
                    state = $19, zip_code = $20, country = $21, resume_file_path = $22,
                    twitter_link = $23, linkedin_link = $24, facebook_link = $25, instagram_link = $26
                WHERE user_id = $27
                RETURNING *;
            `;
      const result = await pool.query(updateQuery, [
        firstName, lastName, emailAddress, phoneNumber, currentPosition, categories,
        description, dateOfBirth, ageRange, gender, languages, qualification,
        yearsOfExperience, offerSalary, salaryType, currency, streetAddress, city,
        state, zipCode, country, resumeFilePath, twitterLink, linkedinLink,
        facebookLink, instagramLink, userId
      ]);
      return result.rows[0];
    } else {
      const insertQuery = `
            INSERT INTO user_basic_info (
              user_id, first_name, last_name, email_address, phone_number, current_position,
              categories, description, date_of_birth, age_range, gender, languages,
              qualification, years_of_experience, offer_salary, salary_type, currency,
              street_address, city, state, zip_code, country, resume_file_path, twitter_link,
              linkedin_link, facebook_link, instagram_link, created_at, updated_at
            )
            VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
              $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, NOW(), NOW()
            )
            RETURNING *;
          `;

      const result = await pool.query(insertQuery, [
        userId, firstName, lastName, emailAddress, phoneNumber, currentPosition, categories,
        description, dateOfBirth, ageRange, gender, languages, qualification,
        yearsOfExperience, offerSalary, salaryType, currency, streetAddress, city,
        state, zipCode, country, resumeFilePath, twitterLink, linkedinLink,
        facebookLink, instagramLink
      ]);
      return result.rows[0];
    }
  } catch (err) {
    console.error("Error in addOrUpdateBasicInfo:", { error: err });
    throw err;
  }
};

// Function to get basic info by user ID
const getBasicInfoByUserId = async (userId) => {
  try {
    const query = "SELECT * FROM user_basic_info WHERE user_id = $1";
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  } catch (err) {
    console.error("Error in getBasicInfoByUserId:", { error: err });
    throw err;
  }
};

export {
  createBasicInfoTable,
  addOrUpdateBasicInfo,
  getBasicInfoByUserId,
  createUserSocialInfoTable,
  createEducationDetailsTable,
  createExperienceTable,
  createSkillsTable,
  createAwardsTable
};
