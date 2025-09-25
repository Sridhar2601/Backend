// console.log("Server is starting...");
// console.log("Server is running on port 3000");
// console.log("started");


const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",   // change if needed
  user: "root",        // your MySQL username
  password: "Sridhar@2004", // your MySQL password
  database: "portfolio_db"
});

// Connect to DB
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

// API route to save contact form
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
  db.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ success: true, message: "Message saved successfully!" });
  });
});

// API route to fetch all contact messages
app.get("/api/contact", (req, res) => {
  const sql = "SELECT * FROM contacts ORDER BY created_at DESC"; // latest messages first
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
});

// Delete a message by ID
app.delete("/api/contact/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM contacts WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting message:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ message: "Message deleted successfully!" });
  });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
