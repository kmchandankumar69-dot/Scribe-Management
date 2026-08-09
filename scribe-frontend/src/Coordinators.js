import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function Coordinators() {
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    coord_name: "",
    contact_info: "",
    assigned_exam: "",
  });

  useEffect(() => {
    fetchCoordinators();
  }, []);

  function fetchCoordinators() {
    setLoading(true);
    setError("");

    fetch(`${API_URL}/coordinators`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        return res.json();
      })
      .then((data) => {
        setCoordinators(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch coordinators:", err);
        setError(
          "Could not load coordinators. Make sure the backend is running."
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
      !form.coord_name.trim() ||
      !form.contact_info.trim() ||
      !form.assigned_exam.trim()
    ) {
      setError("Please fill in all coordinator fields.");
      return;
    }

    setLoading(true);

    fetch(`${API_URL}/coordinators`, {
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
            // Keep default error message
          }

          throw new Error(message);
        }

        return res.json().catch(() => ({}));
      })
      .then(() => {
        setForm({
          coord_name: "",
          contact_info: "",
          assigned_exam: "",
        });

        fetchCoordinators();
      })
      .catch((err) => {
        console.error("Failed to add coordinator:", err);
        setError(`Could not add coordinator: ${err.message}`);
        setLoading(false);
      });
  }

  function handleDelete(coord_id) {
    if (!window.confirm("Are you sure you want to delete this coordinator?")) {
      return;
    }

    setError("");
    setLoading(true);

    fetch(`${API_URL}/coordinators/${coord_id}`, {
      method: "DELETE",
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        return res.json().catch(() => ({}));
      })
      .then(() => {
        fetchCoordinators();
      })
      .catch((err) => {
        console.error("Failed to delete coordinator:", err);
        setError(`Could not delete coordinator: ${err.message}`);
        setLoading(false);
      });
  }

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Coordinators</h2>

      {error && <div style={errorStyle}>{error}</div>}

      <form onSubmit={handleAdd} style={formStyle}>
        <input
          type="text"
          name="coord_name"
          placeholder="Coordinator Name"
          value={form.coord_name}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="text"
          name="contact_info"
          placeholder="Contact Info"
          value={form.contact_info}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="text"
          name="assigned_exam"
          placeholder="Assigned Exam"
          value={form.assigned_exam}
          onChange={handleChange}
          style={inputStyle}
        />

        <button
          type="submit"
          style={buttonStyle}
          disabled={loading}
        >
          {loading ? "Please wait..." : "Add Coordinator"}
        </button>
      </form>

      <div style={listContainerStyle}>
        <h3 style={listHeaderStyle}>Coordinator List</h3>

        {loading && coordinators.length === 0 ? (
          <p style={emptyStyle}>Loading coordinators...</p>
        ) : coordinators.length === 0 ? (
          <p style={emptyStyle}>No coordinators found.</p>
        ) : (
          <ul style={listStyle}>
            {coordinators.map((c) => (
              <li
                key={c.coord_id}
                style={listItemStyle}
              >
                <div style={coordinatorInfoStyle}>
                  <strong>{c.coord_name}</strong>

                  <span>
                    Contact: {c.contact_info}
                  </span>

                  <span>
                    Assigned Exam: {c.assigned_exam}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(c.coord_id)}
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
  maxWidth: 900,
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
  minWidth: 180,
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

const coordinatorInfoStyle = {
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

export default Coordinators;