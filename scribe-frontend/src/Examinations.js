import React, { useEffect, useState } from "react";

function Examinations() {
  const [examinations, setExaminations] = useState([]);
  const [form, setForm] = useState({
    date_time: "",
    location: "",
    subject: "",
    duration: "",
    person_id: "",
    vol_id: "",
  });

  useEffect(() => {
    fetch("https://capable-recreation-production-3e70.up.railway.app/examinations")
      .then((res) => res.json())
      .then(setExaminations)
      .catch(console.error);
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleAdd() {
    fetch("https://capable-recreation-production-3e70.up.railway.app/examinations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then(() => {
      setForm({ date_time: "", location: "", subject: "", duration: "", person_id: "", vol_id: "" });
      fetch("https://capable-recreation-production-3e70.up.railway.app/examinations")
        .then((res) => res.json())
        .then(setExaminations);
    });
  }

  function handleDelete(id) {
    fetch(`https://capable-recreation-production-3e70.up.railway.app/examinations/${id}`, { method: "DELETE" }).then(() => {
      setExaminations(examinations.filter((e) => e.exam_id !== id));
    });
  }

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Examinations</h2>
      <div style={formStyle}>
        <input
          name="date_time"
          type="datetime-local"
          placeholder="Date & Time"
          value={form.date_time}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="duration"
          type="number"
          placeholder="Duration (hours)"
          value={form.duration}
          onChange={handleChange}
          style={inputStyle}
          min="0"
        />
        <input
          name="person_id"
          placeholder="Person ID"
          value={form.person_id}
          onChange={handleChange}
          style={inputStyle}
          type="number"
        />
        <input
          name="vol_id"
          placeholder="Volunteer ID"
          value={form.vol_id}
          onChange={handleChange}
          style={inputStyle}
          type="number"
        />
        <button onClick={handleAdd} style={buttonStyle}>
          Add Examination
        </button>
      </div>
      <ul style={listStyle}>
        {examinations.map((e) => (
          <li key={e.exam_id} style={listItemStyle}>
            <div>
              <strong>{e.subject}</strong> at {new Date(e.date_time).toLocaleString()} — {e.location} — Duration: {e.duration} hrs
              <br />
              Person ID: {e.person_id} — Volunteer ID: {e.vol_id}
            </div>
            <button onClick={() => handleDelete(e.exam_id)} style={deleteButtonStyle}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const containerStyle = {
  padding: 20,
  backgroundColor: "#fff",
  borderRadius: 12,
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
};

const headerStyle = {
  color: "#4a90e2",
  textAlign: "center",
  marginBottom: 20,
};

const formStyle = {
  display: "flex",
  gap: 12,
  marginBottom: 20,
  flexWrap: "wrap",
  justifyContent: "center",
};

const inputStyle = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ccc",
  minWidth: 140,
  fontSize: 14,
};

const buttonStyle = {
  backgroundColor: "#4a90e2",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "10px 20px",
  cursor: "pointer",
  fontWeight: "600",
  boxShadow: "0 4px 12px rgba(74, 144, 226, 0.4)",
  transition: "background-color 0.3s ease",
};

const listStyle = {
  listStyleType: "none",
  paddingLeft: 0,
};

const listItemStyle = {
  backgroundColor: "#f0f5ff",
  marginBottom: 12,
  padding: 12,
  borderRadius: 8,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const deleteButtonStyle = {
  backgroundColor: "#e94e4e",
  border: "none",
  color: "white",
  borderRadius: 8,
  padding: "6px 14px",
  cursor: "pointer",
  fontWeight: "700",
};

export default Examinations;
