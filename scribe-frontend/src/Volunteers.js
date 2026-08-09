import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000';

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [examinations, setExaminations] = useState([]); // NEW: State for tracking assignments
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
    fetchExaminations(); // NEW: Fetch assignment data on load
  }, []);

  function fetchVolunteers() {
    setLoading(true);
    setError('');

    fetch(`${API_URL}/volunteers`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then((data) => setVolunteers(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error('Failed to fetch volunteers:', err);
        setError('Could not connect to the backend. Make sure the backend is running on port 5000.');
      })
      .finally(() => setLoading(false));
  }

  // NEW: Fetch examinations to calculate assigned status
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
            if (data && data.error) message = data.error;
          } catch {}
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
    if (!window.confirm('Are you sure you want to delete this volunteer?')) return;

    setError('');
    setLoading(true);

    fetch(`${API_URL}/volunteers/${vol_id}`, {
      method: 'DELETE'
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json().catch(() => ({}));
      })
      .then(() => fetchVolunteers())
      .catch((err) => {
        console.error('Failed to delete volunteer:', err);
        setError(`Could not delete volunteer: ${err.message}`);
        setLoading(false);
      });
  }

  return (
    <div className="space-y-6">
      
      {/* Top Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Volunteers</div>
          <div className="text-3xl font-extrabold text-slate-800 mt-1">{volunteers.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Assigned Scribes</div>
          <div className="text-3xl font-extrabold text-blue-600 mt-1">
            {volunteers.filter(v => examinations.some(e => String(e.vol_id) === String(v.vol_id))).length}
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Languages Covered</div>
          <div className="text-3xl font-extrabold text-indigo-600 mt-1">
            {new Set(volunteers.map(v => v.language)).size}
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
        <h3 className="text-lg font-bold text-slate-800 mb-4">Register New Volunteer</h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="vol_name"
              placeholder="Volunteer Name"
              value={form.vol_name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <input
              type="text"
              name="vol_contact"
              placeholder="Contact Number / Email"
              value={form.vol_contact}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <input
              type="text"
              name="availability"
              placeholder="Pref. Timing (e.g. Weekends)"
              value={form.availability}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <input
              type="text"
              name="language"
              placeholder="Language (e.g. Kannada)"
              value={form.language}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <input
              type="text"
              name="education"
              placeholder="Education Qualification"
              value={form.education}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 px-4 rounded-lg shadow-sm transition duration-150 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Add Volunteer'}
            </button>
          </div>
        </form>
      </div>

      {/* Directory Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Volunteer Roster</h3>
          <span className="text-xs text-slate-500 font-medium">{volunteers.length} Entries</span>
        </div>

        {loading && volunteers.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading volunteer roster...</div>
        ) : volunteers.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">No volunteers registered yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100/75 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="py-3 px-6">ID</th>
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">Contact</th>
                  <th className="py-3 px-6">Language</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {volunteers.map((v) => {
                  // NEW: Calculate if volunteer exists in exams table
                  const isAssigned = examinations.some(e => String(e.vol_id) === String(v.vol_id));

                  return (
                    <tr key={v.vol_id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-6 font-medium text-slate-400">#{v.vol_id}</td>
                      <td className="py-4 px-6 font-semibold text-slate-800">
                        {v.vol_name}
                        <div className="text-xs text-slate-400 font-normal mt-0.5">{v.education}</div>
                      </td>
                      <td className="py-4 px-6 text-slate-600">{v.vol_contact}</td>
                      <td className="py-4 px-6 text-slate-600">{v.language}</td>
                      <td className="py-4 px-6">
                        {isAssigned ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Assigned
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Available
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(v.vol_id)}
                          disabled={loading}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-md transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}