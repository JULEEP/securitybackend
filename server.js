import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import userRoutes from "./routes/user.routes.js";


dotenv.config();

const app = express();
  
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use("/api/freeliencers", userRoutes);



// Default route
app.get("/", (req, res) => {
 res.json({ message: "Hello from Macbell" });
});

// Start the server
const port = process.env.PORT || 6000; // Use the PORT environment variable if available, or default to 4000

const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
