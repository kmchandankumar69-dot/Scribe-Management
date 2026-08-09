import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000';

export default function Persons() {
  const [persons, setPersons] = useState([]);
  const [examinations, setExaminations] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    contact_info: '',
    education_level: '',
    preferred_language: ''
  });

  useEffect(() => {
    fetchPersons();
    fetchExaminations(); 
  }, []);

  function fetchPersons() {
    setLoading(true);
    setError('');

    fetch(`${API_URL}/persons`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then((data) => setPersons(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error('Failed to fetch persons:', err);
        setError('Could not connect to the persons service. Make sure the backend is running.');
      })
      .finally(() => setLoading(false));
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
      !form.contact_info.trim() ||
      !form.education_level.trim() ||
      !form.preferred_language.trim()
    ) {
      setError('Please fill in all fields.');
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
            if (data && data.error) message = data.error;
          } catch {}
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
        setError(`Could not add record: ${err.message}`);
        setLoading(false);
      });
  }

  function handleDelete(person_id) {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    setError('');
    setLoading(true);

    fetch(`${API_URL}/persons/${person_id}`, {
      method: 'DELETE'
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json().catch(() => ({}));
      })
      .then(() => fetchPersons())
      .catch((err) => {
        console.error('Failed to delete person:', err);
        setError(`Could not delete record: ${err.message}`);
        setLoading(false);
      });
  }

  return (
    <div className="space-y-6">
      
      {/* Top Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Registered Visually Impaired Person</div>
          <div className="text-3xl font-extrabold text-slate-800 mt-1">{persons.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Unmatched Requests</div>
          <div className="text-3xl font-extrabold text-amber-500 mt-1">
            {persons.filter(p => !examinations.some(e => String(e.person_id) === String(p.person_id))).length}
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
        <h3 className="text-lg font-bold text-slate-800 mb-4">Register Visually Impaired Person</h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              name="contact_info"
              placeholder="Contact Info"
              value={form.contact_info}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <input
              type="text"
              name="education_level"
              placeholder="Education Level"
              value={form.education_level}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <input
              type="text"
              name="preferred_language"
              placeholder="Preferred Language"
              value={form.preferred_language}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 px-4 rounded-lg shadow-sm transition duration-150 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Add Record'}
            </button>
          </div>
        </form>
      </div>

      {/* Directory Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Visually Impaired Person List</h3>
          <span className="text-xs text-slate-500 font-medium">{persons.length} Entries</span>
        </div>

        {loading && persons.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading roster...</div>
        ) : persons.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">No records registered yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100/75 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="py-3 px-6">ID</th>
                  <th className="py-3 px-6">Contact Info</th>
                  <th className="py-3 px-6">Education Level</th>
                  <th className="py-3 px-6">Preferred Language</th>
                  <th className="py-3 px-6">Match Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {persons.map((p) => {
                  const isAssigned = examinations.some(e => String(e.person_id) === String(p.person_id));

                  return (
                    <tr key={p.person_id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-6 font-medium text-slate-400">#{p.person_id}</td>
                      <td className="py-4 px-6 font-semibold text-slate-800">{p.contact_info}</td>
                      <td className="py-4 px-6 text-slate-600">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {p.education_level}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600">{p.preferred_language}</td>
                      <td className="py-4 px-6">
                        {isAssigned ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Matched
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Needs Scribe
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(p.person_id)}
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