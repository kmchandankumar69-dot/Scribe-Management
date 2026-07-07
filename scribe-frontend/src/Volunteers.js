import React, { useEffect, useState } from 'react';

function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [form, setForm] = useState({
    vol_name: '',
    vol_contact: '',
    availability: '',
    language: '',
    education: ''
  });

  useEffect(() => {
    fetchVolunteers();
  }, []);

  function fetchVolunteers() {
    fetch('https://capable-recreation-production-3e70.up.railway.app/volunteers')
      .then(res => res.json())
      .then(data => setVolunteers(data))
      .catch(console.error);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleAdd() {
    fetch('https://capable-recreation-production-3e70.up.railway.app/volunteers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    }).then(() => {
      setForm({ vol_name: '', vol_contact: '', availability: '', language: '', education: '' });
      fetchVolunteers();
    });
  }

  function handleDelete(vol_id) {
    fetch(`https://capable-recreation-production-3e70.up.railway.app/volunteers/${vol_id}`, { method: 'DELETE' })
      .then(() => fetchVolunteers());
  }

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Volunteers</h2>
      <div style={formStyle}>
        <input
          name="vol_name"
          placeholder="Volunteer Name"
          value={form.vol_name}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="vol_contact"
          placeholder="Contact Info"
          value={form.vol_contact}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="availability"
          placeholder="Availability"
          value={form.availability}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="language"
          placeholder="Language"
          value={form.language}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="education"
          placeholder="Education"
          value={form.education}
          onChange={handleChange}
          style={inputStyle}
        />
        <button onClick={handleAdd} style={buttonStyle}>
          Add Volunteer
        </button>
      </div>
      <ul style={listStyle}>
        {volunteers.map((v) => (
          <li key={v.vol_id} style={listItemStyle}>
            <div>
              <strong>ID: {v.vol_id}</strong> — {v.vol_name} | {v.vol_contact} | {v.availability} | {v.language} | {v.education}
            </div>
            <button onClick={() => handleDelete(v.vol_id)} style={deleteButtonStyle}>
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
  maxWidth: 800,
  margin: "20px auto"
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
  fontSize: 14,
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

export default Volunteers;
