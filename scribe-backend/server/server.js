require("dotenv").config(); // This line loads your new .env file
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();

app.use(cors());
app.use(express.json());

// This now securely pulls from your .env file
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    return;
  }
  console.log("MySQL connected");
});

app.get("/volunteers", (req, res) => {
  db.query("SELECT * FROM volunteer", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.post("/volunteers", (req, res) => {
  const { vol_name, vol_contact, availability, language, education } = req.body;
  const sql = "INSERT INTO volunteer (vol_name, vol_contact, availability, language, education) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [vol_name, vol_contact, availability, language, education], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId });
  });
});

app.put("/volunteers/:id", (req, res) => {
  const id = req.params.id.trim();
  const { vol_name, vol_contact, availability, language, education } = req.body;
  const sql = "UPDATE volunteer SET vol_name = ?, vol_contact = ?, availability = ?, language = ?, education = ? WHERE vol_id = ?";
  db.query(sql, [vol_name, vol_contact, availability, language, education, id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Volunteer not found" });
    res.json({ message: "Volunteer updated successfully" });
  });
});

app.delete("/volunteers/:id", (req, res) => {
  const id = req.params.id.trim();
  const sql = "DELETE FROM volunteer WHERE vol_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Volunteer not found" });
    res.json({ message: "Volunteer deleted successfully" });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});