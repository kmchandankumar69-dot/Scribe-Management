import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000';

function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    setLoading(true);
    setError('');

    fetch(`${API_URL}/volunteers`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        return res.json();
      })
      .then((data) => {
        setVolunteers(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Failed to fetch volunteers:', err);
        setError(
          'Could not connect to the backend. Make sure the backend is running on port 5000.'
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
      [name]: value
    }));
  }

  function handleAdd(e) {
    e.preventDefault();

    setError('');

    // Basic validation
    if (
      !form.vol_name.trim() ||
      !form.vol_contact.trim() ||
      !form.availability.trim() ||
      !form.language.trim() ||
      !form.education.trim()
    ) {
      setError('Please fill in all volunteer fields.');
      return;
    }

    setLoading(true);

    fetch(`${API_URL}/volunteers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
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
            // Keep the default error message
          }

          throw new Error(message);
        }

        return res.json().catch(() => ({}));
      })
      .then(() => {
        setForm({
          vol_name: '',
          vol_contact: '',
          availability: '',
          language: '',
          education: ''
        });

        fetchVolunteers();
      })
      .catch((err) => {
        console.error('Failed to add volunteer:', err);
        setError(`Could not add volunteer: ${err.message}`);
        setLoading(false);
      });
  }

  function handleDelete(vol_id) {
    if (!window.confirm('Are you sure you want to delete this volunteer?')) {
      return;
    }

    setError('');
    setLoading(true);

    fetch(`${API_URL}/volunteers/${vol_id}`, {
      method: 'DELETE'
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        return res.json().catch(() => ({}));
      })
      .then(() => {
        fetchVolunteers();
      })
      .catch((err) => {
        console.error('Failed to delete volunteer:', err);
        setError(`Could not delete volunteer: ${err.message}`);
        setLoading(false);
      });
  }

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Volunteers</h2>

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      <form onSubmit={handleAdd} style={formStyle}>
        <input
          type="text"
          name="vol_name"
          placeholder="Volunteer Name"
          value={form.vol_name}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="text"
          name="vol_contact"
          placeholder="Contact Info"
          value={form.vol_contact}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="text"
          name="availability"
          placeholder="Availability"
          value={form.availability}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="text"
          name="language"
          placeholder="Language"
          value={form.language}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="text"
          name="education"
          placeholder="Education"
          value={form.education}
          onChange={handleChange}
          style={inputStyle}
        />

        <button
          type="submit"
          style={buttonStyle}
          disabled={loading}
        >
          {loading ? 'Please wait...' : 'Add Volunteer'}
        </button>
      </form>

      <div style={listContainerStyle}>
        <h3 style={listHeaderStyle}>Volunteer List</h3>

        {loading && volunteers.length === 0 ? (
          <p style={emptyStyle}>Loading volunteers...</p>
        ) : volunteers.length === 0 ? (
          <p style={emptyStyle}>No volunteers found.</p>
        ) : (
          <ul style={listStyle}>
            {volunteers.map((v) => (
              <li
                key={v.vol_id}
                style={listItemStyle}
              >
                <div style={volunteerInfoStyle}>
                  <strong>
                    ID: {v.vol_id} — {v.vol_name}
                  </strong>

                  <span>
                    Contact: {v.vol_contact}
                  </span>

                  <span>
                    Availability: {v.availability}
                  </span>

                  <span>
                    Language: {v.language}
                  </span>

                  <span>
                    Education: {v.education}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(v.vol_id)}
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
  backgroundColor: '#fff',
  borderRadius: 12,
  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  maxWidth: 1000,
  margin: '20px auto'
};

const headerStyle = {
  color: '#4a90e2',
  textAlign: 'center',
  marginBottom: 20
};

const formStyle = {
  display: 'flex',
  gap: 12,
  marginBottom: 30,
  flexWrap: 'wrap',
  justifyContent: 'center'
};

const inputStyle = {
  padding: 10,
  borderRadius: 8,
  border: '1px solid #ccc',
  minWidth: 150,
  fontSize: 14,
  outline: 'none'
};

const buttonStyle = {
  backgroundColor: '#4a90e2',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '10px 20px',
  cursor: 'pointer',
  fontWeight: '600',
  boxShadow: '0 4px 12px rgba(74, 144, 226, 0.4)'
};

const listContainerStyle = {
  marginTop: 20
};

const listHeaderStyle = {
  color: '#4a90e2',
  textAlign: 'center',
  marginBottom: 15
};

const listStyle = {
  listStyleType: 'none',
  paddingLeft: 0,
  margin: 0
};

const listItemStyle = {
  backgroundColor: '#f0f5ff',
  marginBottom: 12,
  padding: 15,
  borderRadius: 8,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 15,
  fontSize: 14
};

const volunteerInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
  flex: 1
};

const deleteButtonStyle = {
  backgroundColor: '#e94e4e',
  border: 'none',
  color: 'white',
  borderRadius: 8,
  padding: '6px 14px',
  cursor: 'pointer',
  fontWeight: '700'
};

const errorStyle = {
  backgroundColor: '#ffe6e6',
  color: '#c62828',
  border: '1px solid #ef9a9a',
  borderRadius: 8,
  padding: 12,
  marginBottom: 20,
  textAlign: 'center'
};

const emptyStyle = {
  textAlign: 'center',
  color: '#777',
  padding: 20
};

export default Volunteers;