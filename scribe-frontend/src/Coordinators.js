import React, { useEffect, useState } from "react";

function Coordinators() {
  const [coordinators, setCoordinators] = useState([]);
  const [form, setForm] = useState({ coord_name: "", contact_info: "", assigned_exam: "" });

  useEffect(() => {
    fetch("http://localhost:5000/coordinators")
      .then((res) => res.json())
      .then(setCoordinators)
      .catch(console.error);
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleAdd() {
    fetch("http://localhost:5000/coordinators", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then(() => {
      setForm({ coord_name: "", contact_info: "", assigned_exam: "" });
      fetch("http://localhost:5000/coordinators")
        .then((res) => res.json())
        .then(setCoordinators);
    });
  }

  function handleDelete(id) {
    fetch(`http://localhost:5000/coordinators/${id}`, { method: "DELETE" }).then(() => {
      setCoordinators(coordinators.filter((c) => c.coord_id !== id));
    });
  }

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Coordinators</h2>
      <div style={formStyle}>
        <input
          name="coord_name"
          placeholder="Coordinator Name"
          value={form.coord_name}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="contact_info"
          placeholder="Contact Info"
          value={form.contact_info}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="assigned_exam"
          placeholder="Assigned Exam"
          value={form.assigned_exam}
          onChange={handleChange}
          style={inputStyle}
        />
        <button onClick={handleAdd} style={buttonStyle}>
          Add Coordinator
        </button>
      </div>
      <ul style={listStyle}>
        {coordinators.map((c) => (
          <li key={c.coord_id} style={listItemStyle}>
            <strong>{c.coord_name}</strong> — {c.contact_info} — Assigned Exam: {c.assigned_exam}
            <button onClick={() => handleDelete(c.coord_id)} style={deleteButtonStyle}>
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
  minWidth: 150,
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

export default Coordinators;
