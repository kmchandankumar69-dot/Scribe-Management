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
// =========================
// PERSONS
// =========================

app.get("/persons", (req, res) => {
  db.query("SELECT * FROM person", (err, result) => {
    if (err) {
      console.error("Error fetching persons:", err.message);
      return res.status(500).json({ error: err.message });
    }

    res.json(result);
  });
});

app.post("/persons", (req, res) => {
  const {
    contact_info,
    education_level,
    preferred_language
  } = req.body;

  if (!contact_info || !education_level || !preferred_language) {
    return res.status(400).json({
      error: "All person fields are required"
    });
  }

  const sql = `
    INSERT INTO person
    (contact_info, education_level, preferred_language)
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [
      contact_info,
      education_level,
      preferred_language
    ],
    (err, result) => {
      if (err) {
        console.error("Error adding person:", err.message);
        return res.status(500).json({
          error: err.message
        });
      }

      res.status(201).json({
        id: result.insertId,
        message: "Person added successfully"
      });
    }
  );
});

app.delete("/persons/:id", (req, res) => {
  const id = req.params.id.trim();

  const sql = "DELETE FROM person WHERE person_id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting person:", err.message);
      return res.status(500).json({
        error: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Person not found"
      });
    }

    res.json({
      message: "Person deleted successfully"
    });
  });
});

// =========================
// EXAMINATIONS
// =========================

app.get("/examinations", (req, res) => {
  db.query(
    "SELECT * FROM examination ORDER BY date_time ASC",
    (err, result) => {
      if (err) {
        console.error("Error fetching examinations:", err.message);
        return res.status(500).json({
          error: err.message
        });
      }

      res.json(result);
    }
  );
});

app.post("/examinations", (req, res) => {
  const {
    date_time,
    location,
    subject,
    duration,
    person_id,
    vol_id
  } = req.body;

  if (
    !date_time ||
    !location ||
    !subject ||
    !duration ||
    !person_id ||
    !vol_id
  ) {
    return res.status(400).json({
      error: "All examination fields are required"
    });
  }

  const sql = `
    INSERT INTO examination
    (date_time, location, subject, duration, person_id, vol_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      date_time,
      location,
      subject,
      duration,
      person_id,
      vol_id
    ],
    (err, result) => {
      if (err) {
        console.error("Error adding examination:", err.message);
        return res.status(500).json({
          error: err.message
        });
      }

      res.status(201).json({
        id: result.insertId,
        message: "Examination added successfully"
      });
    }
  );
});

app.delete("/examinations/:id", (req, res) => {
  const id = req.params.id.trim();

  db.query(
    "DELETE FROM examination WHERE exam_id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error deleting examination:", err.message);
        return res.status(500).json({
          error: err.message
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Examination not found"
        });
      }

      res.json({
        message: "Examination deleted successfully"
      });
    }
  );
});  

// =========================
// COORDINATORS
// =========================

app.get("/coordinators", (req, res) => {
  db.query(
    "SELECT * FROM coordinator ORDER BY coord_id DESC",
    (err, result) => {
      if (err) {
        console.error("Error fetching coordinators:", err.message);
        return res.status(500).json({
          error: err.message
        });
      }

      res.json(result);
    }
  );
});

app.post("/coordinators", (req, res) => {
  const {
    coord_name,
    contact_info,
    assigned_exam
  } = req.body;

  if (
    !coord_name ||
    !contact_info ||
    !assigned_exam
  ) {
    return res.status(400).json({
      error: "All coordinator fields are required"
    });
  }

  const sql = `
    INSERT INTO coordinator
    (coord_name, contact_info, assigned_exam)
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [
      coord_name,
      contact_info,
      assigned_exam
    ],
    (err, result) => {
      if (err) {
        console.error("Error adding coordinator:", err.message);
        return res.status(500).json({
          error: err.message
        });
      }

      res.status(201).json({
        id: result.insertId,
        message: "Coordinator added successfully"
      });
    }
  );
});

app.delete("/coordinators/:id", (req, res) => {
  const id = req.params.id.trim();

  db.query(
    "DELETE FROM coordinator WHERE coord_id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error deleting coordinator:", err.message);
        return res.status(500).json({
          error: err.message
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Coordinator not found"
        });
      }

      res.json({
        message: "Coordinator deleted successfully"
      });
    }
  );
});
// =========================
// FEEDBACK
// =========================

app.get("/feedback", (req, res) => {
  db.query(
    "SELECT * FROM feedback ORDER BY feedback_id DESC",
    (err, result) => {
      if (err) {
        console.error("Error fetching feedback:", err.message);
        return res.status(500).json({
          error: err.message
        });
      }

      res.json(result);
    }
  );
});

app.post("/feedback", (req, res) => {
  const {
    person_id,
    vol_id,
    exam_id,
    rating,
    comments
  } = req.body;

  if (
    !person_id ||
    !vol_id ||
    !exam_id ||
    !rating ||
    !comments
  ) {
    return res.status(400).json({
      error: "All feedback fields are required"
    });
  }

  const ratingNumber = Number(rating);

  if (
    !Number.isInteger(ratingNumber) ||
    ratingNumber < 1 ||
    ratingNumber > 5
  ) {
    return res.status(400).json({
      error: "Rating must be between 1 and 5"
    });
  }

  const sql = `
    INSERT INTO feedback
    (person_id, vol_id, exam_id, rating, comments)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      person_id,
      vol_id,
      exam_id,
      ratingNumber,
      comments
    ],
    (err, result) => {
      if (err) {
        console.error("Error adding feedback:", err.message);
        return res.status(500).json({
          error: err.message
        });
      }

      res.status(201).json({
        id: result.insertId,
        message: "Feedback added successfully"
      });
    }
  );
});

app.delete("/feedback/:id", (req, res) => {
  const id = req.params.id.trim();

  db.query(
    "DELETE FROM feedback WHERE feedback_id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error deleting feedback:", err.message);
        return res.status(500).json({
          error: err.message
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Feedback not found"
        });
      }

      res.json({
        message: "Feedback deleted successfully"
      });
    }
  );
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});