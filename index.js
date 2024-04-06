const express = require("express");
const connectDB = require("./db");
const cors = require("cors");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');

// Connect to MongoDB
connectDB();
app.use(cors());

// Middleware
app.use(express.json());

// Routes

app.use("/api/auth", require("./routes/auth"));
app.use("/api/entry", require("./routes/entry"));
app.use("/api/diagnosis", require("./routes/medical_entry"));
app.use("/api/inventory", require("./routes/inventory"));
app.use("/api/finance", require("./routes/finance"));
// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});