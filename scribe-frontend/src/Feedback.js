import React, { useEffect, useState } from 'react';

function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [form, setForm] = useState({ person_id: '', vol_id: '', exam_id: '', rating: '', comments: '' });

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  function fetchFeedbacks() {
    fetch('http://localhost:5000/feedback')
      .then(res => res.json())
      .then(data => setFeedbacks(data))
      .catch(console.error);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleAdd() {
    fetch('http://localhost:5000/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    .then(() => {
      setForm({ person_id: '', vol_id: '', exam_id: '', rating: '', comments: '' });
      fetchFeedbacks();
    })
    .catch(console.error);
  }

  function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;

    fetch(`http://localhost:5000/feedback/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete');
        fetchFeedbacks();
      })
      .catch(console.error);
  }

  const containerStyle = {
    maxWidth: '700px',
    margin: '40px auto',
    padding: '30px',
    borderRadius: '15px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  };

  const inputStyle = {
    width: 'calc(50% - 12px)',
    margin: '6px',
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '1rem',
  };

  const textareaStyle = {
    width: 'calc(100% - 20px)',
    margin: '6px',
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '1rem',
    resize: 'vertical',
  };

  const buttonStyle = {
    margin: '12px 6px 24px 6px',
    padding: '12px 24px',
    borderRadius: '30px',
    border: 'none',
    backgroundColor: '#ff6f61',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const buttonHover = (e) => (e.target.style.backgroundColor = '#ff3b2f');
  const buttonLeave = (e) => (e.target.style.backgroundColor = '#ff6f61');

  const listItemStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '12px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  };

  const deleteBtnStyle = {
    marginLeft: '15px',
    padding: '6px 12px',
    borderRadius: '15px',
    border: 'none',
    backgroundColor: '#ff3b2f',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Feedback</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
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
        <input
          name="exam_id"
          placeholder="Examination ID"
          value={form.exam_id}
          onChange={handleChange}
          style={inputStyle}
          type="number"
        />
        <input
          name="rating"
          placeholder="Rating (1-5)"
          value={form.rating}
          onChange={handleChange}
          style={inputStyle}
          type="number"
          min="1"
          max="5"
        />
        <textarea
          name="comments"
          placeholder="Comments"
          value={form.comments}
          onChange={handleChange}
          style={textareaStyle}
          rows={3}
        />
      </div>
      <button
        onClick={handleAdd}
        style={buttonStyle}
        onMouseEnter={buttonHover}
        onMouseLeave={buttonLeave}
      >
        Add Feedback
      </button>

      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {feedbacks.map(f => (
          <li key={f.feedback_id} style={listItemStyle}>
            <strong>Person ID:</strong> {f.person_id} | <strong>Volunteer ID:</strong> {f.vol_id} | <strong>Exam ID:</strong> {f.exam_id} <br />
            <strong>Rating:</strong> {f.rating} | <strong>Comments:</strong> {f.comments}
            <button
              onClick={() => handleDelete(f.feedback_id)}
              style={deleteBtnStyle}
              title="Delete feedback"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Feedback;
