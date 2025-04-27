import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";
import invoiceRouters from "./routes/invoice.routes.js";
import proposalRoutes from "./routes/proposal.routes.js";


dotenv.config();

const app = express();
  
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use("/api/freelancers", userRoutes); //fixed spelling error freeliancers to freelancers
app.use("/api/projects", projectRoutes);
app.use("/api/invoices",invoiceRouters);
app.use("/api/proposals", proposalRoutes);



// Default route
app.get("/", (req, res) => {
 res.json({ message: "Hello from Macbell" });
});

// Start the server
const port = process.env.PORT || 6000; // Use the PORT environment variable if available, or default to 4000

const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
