import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000';

function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    person_id: '',
    vol_id: '',
    exam_id: '',
    rating: '',
    comments: ''
  });

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  function fetchFeedbacks() {
    setLoading(true);
    setError('');

    fetch(`${API_URL}/feedback`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        return res.json();
      })
      .then((data) => {
        setFeedbacks(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Failed to fetch feedback:', err);
        setError(
          'Could not load feedback. Make sure the backend is running.'
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
      !form.person_id ||
      !form.vol_id ||
      !form.exam_id ||
      !form.rating ||
      !form.comments.trim()
    ) {
      setError('Please fill in all feedback fields.');
      return;
    }

    const ratingNumber = Number(form.rating);

    if (ratingNumber < 1 || ratingNumber > 5) {
      setError('Rating must be between 1 and 5.');
      return;
    }

    setLoading(true);

    fetch(`${API_URL}/feedback`, {
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
            // Keep default error
          }

          throw new Error(message);
        }

        return res.json().catch(() => ({}));
      })
      .then(() => {
        setForm({
          person_id: '',
          vol_id: '',
          exam_id: '',
          rating: '',
          comments: ''
        });

        fetchFeedbacks();
      })
      .catch((err) => {
        console.error('Failed to add feedback:', err);
        setError(`Could not add feedback: ${err.message}`);
        setLoading(false);
      });
  }

  function handleDelete(feedback_id) {
    if (
      !window.confirm(
        'Are you sure you want to delete this feedback?'
      )
    ) {
      return;
    }

    setError('');
    setLoading(true);

    fetch(`${API_URL}/feedback/${feedback_id}`, {
      method: 'DELETE'
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        return res.json().catch(() => ({}));
      })
      .then(() => {
        fetchFeedbacks();
      })
      .catch((err) => {
        console.error('Failed to delete feedback:', err);
        setError(`Could not delete feedback: ${err.message}`);
        setLoading(false);
      });
  }

  return (
    <div style={containerStyle}>
      <h2
        style={{
          textAlign: 'center',
          marginBottom: '20px'
        }}
      >
        Feedback
      </h2>

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      <form
        onSubmit={handleAdd}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between'
        }}
      >
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

        <input
          type="number"
          name="exam_id"
          placeholder="Exam ID"
          min="1"
          value={form.exam_id}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="number"
          name="rating"
          placeholder="Rating (1-5)"
          min="1"
          max="5"
          value={form.rating}
          onChange={handleChange}
          style={inputStyle}
        />

        <textarea
          name="comments"
          placeholder="Comments"
          value={form.comments}
          onChange={handleChange}
          style={textareaStyle}
        />

        <button
          type="submit"
          style={buttonStyle}
          disabled={loading}
        >
          {loading ? 'Please wait...' : 'Add Feedback'}
        </button>
      </form>

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ textAlign: 'center' }}>
          Feedback List
        </h3>

        {loading && feedbacks.length === 0 ? (
          <p style={emptyStyle}>Loading feedback...</p>
        ) : feedbacks.length === 0 ? (
          <p style={emptyStyle}>No feedback found.</p>
        ) : (
          <ul
            style={{
              listStyle: 'none',
              paddingLeft: 0
            }}
          >
            {feedbacks.map((f) => (
              <li
                key={f.feedback_id}
                style={listItemStyle}
              >
                <div>
                  <strong>Person ID:</strong> {f.person_id}
                  <br />

                  <strong>Volunteer ID:</strong> {f.vol_id}
                  <br />

                  <strong>Exam ID:</strong> {f.exam_id}
                  <br />

                  <strong>Rating:</strong> {f.rating}
                  <br />

                  <strong>Comments:</strong> {f.comments}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(f.feedback_id)
                  }
                  style={deleteBtnStyle}
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
  maxWidth: '700px',
  margin: '40px auto',
  padding: '30px',
  borderRadius: '15px',
  background:
    'linear-gradient(135deg, #667eea, #764ba2)',
  color: '#fff',
  fontFamily:
    "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
};

const inputStyle = {
  width: 'calc(50% - 12px)',
  margin: '6px',
  padding: '10px',
  borderRadius: '8px',
  border: 'none',
  fontSize: '1rem',
  boxSizing: 'border-box'
};

const textareaStyle = {
  width: 'calc(100% - 12px)',
  margin: '6px',
  padding: '10px',
  borderRadius: '8px',
  border: 'none',
  fontSize: '1rem',
  resize: 'vertical',
  minHeight: '100px',
  boxSizing: 'border-box'
};

const buttonStyle = {
  margin: '12px 6px 24px 6px',
  padding: '12px 24px',
  borderRadius: '30px',
  border: 'none',
  backgroundColor: '#ff6f61',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const listItemStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  padding: '15px',
  borderRadius: '10px',
  marginBottom: '12px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '15px'
};

const deleteBtnStyle = {
  padding: '6px 12px',
  borderRadius: '15px',
  border: 'none',
  backgroundColor: '#ff3b2f',
  color: 'white',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '0.9rem',
  whiteSpace: 'nowrap'
};

const errorStyle = {
  backgroundColor: '#ffe6e6',
  color: '#c62828',
  border: '1px solid #ef9a9a',
  borderRadius: '8px',
  padding: '12px',
  marginBottom: '20px',
  textAlign: 'center'
};

const emptyStyle = {
  textAlign: 'center',
  padding: '20px'
};

export default Feedback;