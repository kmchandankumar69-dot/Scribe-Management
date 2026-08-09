import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function Examinations() {
  const [examinations, setExaminations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    date_time: "",
    location: "",
    subject: "",
    duration: "",
    person_id: "",
    vol_id: "",
  });

  useEffect(() => {
    fetchExaminations();
  }, []);

  function fetchExaminations() {
    setLoading(true);
    setError("");

    fetch(`${API_URL}/examinations`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        return res.json();
      })
      .then((data) => {
        setExaminations(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch examinations:", err);
        setError(
          "Could not load examinations. Make sure the backend is running."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  function handleAdd(e) {
    e.preventDefault();
    setError("");

    if (
      !form.date_time ||
      !form.location.trim() ||
      !form.subject.trim() ||
      !form.duration ||
      !form.person_id ||
      !form.vol_id
    ) {
      setError("Please fill in all examination fields.");
      return;
    }

    setLoading(true);

    fetch(`${API_URL}/examinations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then(async (res) => {
        if (!res.ok) {
          let message = `Server returned ${res.status}`;

          try {
            const data = await res.json();

            if (data && data.error) {
              message = data.error;
            }
          } catch {
            // Keep default message
          }

          throw new Error(message);
        }

        return res.json().catch(() => ({}));
      })
      .then(() => {
        setForm({
          date_time: "",
          location: "",
          subject: "",
          duration: "",
          person_id: "",
          vol_id: "",
        });

        fetchExaminations();
      })
      .catch((err) => {
        console.error("Failed to add examination:", err);
        setError(`Could not add examination: ${err.message}`);
        setLoading(false);
      });
  }

  function handleDelete(exam_id) {
    if (!window.confirm("Are you sure you want to delete this examination?")) {
      return;
    }

    setError("");
    setLoading(true);

    fetch(`${API_URL}/examinations/${exam_id}`, {
      method: "DELETE",
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        return res.json().catch(() => ({}));
      })
      .then(() => {
        fetchExaminations();
      })
      .catch((err) => {
        console.error("Failed to delete examination:", err);
        setError(`Could not delete examination: ${err.message}`);
        setLoading(false);
      });
  }

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Examinations</h2>

      {error && <div style={errorStyle}>{error}</div>}

      <form onSubmit={handleAdd} style={formStyle}>
        <input
          type="datetime-local"
          name="date_time"
          value={form.date_time}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="number"
          name="duration"
          placeholder="Duration (hours)"
          min="0.5"
          step="0.5"
          value={form.duration}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="number"
          name="person_id"
          placeholder="Person ID"
          min="1"
          value={form.person_id}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="number"
          name="vol_id"
          placeholder="Volunteer ID"
          min="1"
          value={form.vol_id}
          onChange={handleChange}
          style={inputStyle}
        />

        <button
          type="submit"
          style={buttonStyle}
          disabled={loading}
        >
          {loading ? "Please wait..." : "Add Examination"}
        </button>
      </form>

      <div style={listContainerStyle}>
        <h3 style={listHeaderStyle}>Examination List</h3>

        {loading && examinations.length === 0 ? (
          <p style={emptyStyle}>Loading examinations...</p>
        ) : examinations.length === 0 ? (
          <p style={emptyStyle}>No examinations found.</p>
        ) : (
          <ul style={listStyle}>
            {examinations.map((e) => (
              <li key={e.exam_id} style={listItemStyle}>
                <div style={examinationInfoStyle}>
                  <strong>{e.subject}</strong>

                  <span>
                    Date:{" "}
                    {e.date_time
                      ? new Date(e.date_time).toLocaleString()
                      : "Not specified"}
                  </span>

                  <span>Location: {e.location}</span>

                  <span>Duration: {e.duration} hours</span>

                  <span>Person ID: {e.person_id}</span>

                  <span>Volunteer ID: {e.vol_id}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(e.exam_id)}
                  style={deleteButtonStyle}
                  disabled={loading}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const containerStyle = {
  padding: 20,
  backgroundColor: "#fff",
  borderRadius: 12,
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  maxWidth: 1000,
  margin: "20px auto",
};

const headerStyle = {
  color: "#4a90e2",
  textAlign: "center",
  marginBottom: 20,
};

const formStyle = {
  display: "flex",
  gap: 12,
  marginBottom: 30,
  flexWrap: "wrap",
  justifyContent: "center",
};

const inputStyle = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ccc",
  minWidth: 150,
  fontSize: 14,
  outline: "none",
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
};

const listContainerStyle = {
  marginTop: 20,
};

const listHeaderStyle = {
  color: "#4a90e2",
  textAlign: "center",
  marginBottom: 15,
};

const listStyle = {
  listStyleType: "none",
  paddingLeft: 0,
  margin: 0,
};

const listItemStyle = {
  backgroundColor: "#f0f5ff",
  marginBottom: 12,
  padding: 15,
  borderRadius: 8,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 15,
  fontSize: 14,
};

const examinationInfoStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 5,
  flex: 1,
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

const errorStyle = {
  backgroundColor: "#ffe6e6",
  color: "#c62828",
  border: "1px solid #ef9a9a",
  borderRadius: 8,
  padding: 12,
  marginBottom: 20,
  textAlign: "center",
};

const emptyStyle = {
  textAlign: "center",
  color: "#777",
  padding: 20,
};

export default Examinations;