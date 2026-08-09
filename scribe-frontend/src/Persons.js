import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000';

function Persons() {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    contact_info: '',
    education_level: '',
    preferred_language: ''
  });

  useEffect(() => {
    fetchPersons();
  }, []);

  function fetchPersons() {
    setLoading(true);
    setError('');

    fetch(`${API_URL}/persons`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        return res.json();
      })
      .then((data) => {
        setPersons(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Failed to fetch persons:', err);
        setError(
          'Could not connect to the persons service. Make sure the backend is running.'
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

    if (
      !form.contact_info.trim() ||
      !form.education_level.trim() ||
      !form.preferred_language.trim()
    ) {
      setError('Please fill in all person fields.');
      return;
    }

    setLoading(true);

    fetch(`${API_URL}/persons`, {
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
            // Keep default error message
          }

          throw new Error(message);
        }

        return res.json().catch(() => ({}));
      })
      .then(() => {
        setForm({
          contact_info: '',
          education_level: '',
          preferred_language: ''
        });

        fetchPersons();
      })
      .catch((err) => {
        console.error('Failed to add person:', err);
        setError(`Could not add person: ${err.message}`);
        setLoading(false);
      });
  }

  function handleDelete(person_id) {
    if (!window.confirm('Are you sure you want to delete this person?')) {
      return;
    }

    setError('');
    setLoading(true);

    fetch(`${API_URL}/persons/${person_id}`, {
      method: 'DELETE'
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        return res.json().catch(() => ({}));
      })
      .then(() => {
        fetchPersons();
      })
      .catch((err) => {
        console.error('Failed to delete person:', err);
        setError(`Could not delete person: ${err.message}`);
        setLoading(false);
      });
  }

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Visually Impaired Persons</h2>

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      <form onSubmit={handleAdd} style={formStyle}>
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
          name="education_level"
          placeholder="Education Level"
          value={form.education_level}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="text"
          name="preferred_language"
          placeholder="Preferred Language"
          value={form.preferred_language}
          onChange={handleChange}
          style={inputStyle}
        />

        <button
          type="submit"
          style={buttonStyle}
          disabled={loading}
        >
          {loading ? 'Please wait...' : 'Add Person'}
        </button>
      </form>

      <div style={listContainerStyle}>
        <h3 style={listHeaderStyle}>Persons List</h3>

        {loading && persons.length === 0 ? (
          <p style={emptyStyle}>Loading persons...</p>
        ) : persons.length === 0 ? (
          <p style={emptyStyle}>No persons found.</p>
        ) : (
          <ul style={listStyle}>
            {persons.map((p) => (
              <li
                key={p.person_id}
                style={listItemStyle}
              >
                <div style={personInfoStyle}>
                  <strong>
                    ID: {p.person_id}
                  </strong>

                  <span>
                    Contact: {p.contact_info}
                  </span>

                  <span>
                    Education: {p.education_level}
                  </span>

                  <span>
                    Preferred Language: {p.preferred_language}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(p.person_id)}
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
  maxWidth: 900,
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
  minWidth: 180,
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

const personInfoStyle = {
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

export default Persons;