import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000';

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [persons, setPersons] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [examinations, setExaminations] = useState([]);
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
    fetchPersons();
    fetchVolunteers();
    fetchExaminations();
  }, []);

  function fetchFeedbacks() {
    setLoading(true);
    setError('');

    fetch(`${API_URL}/feedback`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then((data) => setFeedbacks(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error('Failed to fetch feedback:', err);
        setError('Could not load feedback. Make sure the backend is running.');
      })
      .finally(() => setLoading(false));
  }

  function fetchPersons() {
    fetch(`${API_URL}/persons`)
      .then((res) => res.json())
      .then((data) => setPersons(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Failed to fetch persons:", err));
  }

  function fetchVolunteers() {
    fetch(`${API_URL}/volunteers`)
      .then((res) => res.json())
      .then((data) => setVolunteers(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Failed to fetch volunteers:", err));
  }

  function fetchExaminations() {
    fetch(`${API_URL}/examinations`)
      .then((res) => res.json())
      .then((data) => setExaminations(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Failed to fetch examinations:", err));
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
            if (data && data.error) message = data.error;
          } catch {}
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
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;

    setError('');
    setLoading(true);

    fetch(`${API_URL}/feedback/${feedback_id}`, {
      method: 'DELETE'
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json().catch(() => ({}));
      })
      .then(() => fetchFeedbacks())
      .catch((err) => {
        console.error('Failed to delete feedback:', err);
        setError(`Could not delete feedback: ${err.message}`);
        setLoading(false);
      });
  }

  const averageRating = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, curr) => acc + Number(curr.rating), 0) / feedbacks.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Feedback Entries</div>
          <div className="text-3xl font-extrabold text-slate-800 mt-1">{feedbacks.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Average Rating</div>
          <div className="text-3xl font-extrabold text-amber-500 mt-1 flex items-center gap-2">
            {averageRating} <span className="text-2xl">★</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">5-Star Ratings</div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-1">
            {feedbacks.filter(f => Number(f.rating) === 5).length}
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Submit Assignment Feedback</h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Dropdown with updated text */}
            <select
              name="person_id"
              value={form.person_id}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-slate-700"
            >
              <option value="">Select Visually Impaired Person...</option>
              {persons.map((p) => (
                <option key={p.person_id} value={p.person_id}>
                  ID: #{p.person_id} - {p.preferred_language}
                </option>
              ))}
            </select>

            <select
              name="vol_id"
              value={form.vol_id}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-slate-700"
            >
              <option value="">Select Volunteer...</option>
              {volunteers.map((v) => (
                <option key={v.vol_id} value={v.vol_id}>
                  ID: #{v.vol_id} - {v.vol_name}
                </option>
              ))}
            </select>

            <select
              name="exam_id"
              value={form.exam_id}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-slate-700"
            >
              <option value="">Select Exam...</option>
              {examinations.map((e) => (
                <option key={e.exam_id} value={e.exam_id}>
                  ID: #{e.exam_id} - {e.subject} ({new Date(e.date_time).toLocaleDateString()})
                </option>
              ))}
            </select>

            <input
              type="number"
              name="rating"
              placeholder="Rating (1-5)"
              min="1"
              max="5"
              value={form.rating}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <div className="md:col-span-3">
              <textarea
                name="comments"
                placeholder="Enter feedback comments..."
                value={form.comments}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none h-12"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 px-4 rounded-lg shadow-sm transition duration-150 disabled:opacity-50 h-12"
            >
              {loading ? 'Processing...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>

      {/* Directory Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Feedback Repository</h3>
          <span className="text-xs text-slate-500 font-medium">{feedbacks.length} Entries</span>
        </div>

        {loading && feedbacks.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading feedback records...</div>
        ) : feedbacks.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">No feedback submitted yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100/75 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="py-3 px-6">Assignment Info</th>
                  <th className="py-3 px-6">Rating</th>
                  <th className="py-3 px-6 w-1/2">Comments</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {feedbacks.map((f) => (
                  <tr key={f.feedback_id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-6 text-slate-600">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs"><strong className="text-slate-800">Visually Impaired Person:</strong> #{f.person_id}</span>
                        <span className="text-xs"><strong className="text-slate-800">Vol:</strong> #{f.vol_id}</span>
                        <span className="text-xs"><strong className="text-slate-800">Exam:</strong> #{f.exam_id}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        Number(f.rating) >= 4 ? 'bg-emerald-100 text-emerald-800' : 
                        Number(f.rating) === 3 ? 'bg-amber-100 text-amber-800' : 
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {f.rating} ★
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 italic">"{f.comments}"</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(f.feedback_id)}
                        disabled={loading}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-md transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}