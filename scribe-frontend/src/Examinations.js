import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

export default function Examinations() {
  const [examinations, setExaminations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [persons, setPersons] = useState([]);
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
    fetchVolunteers();
    fetchPersons();
  }, []);

  function fetchExaminations() {
    setLoading(true);
    setError("");

    fetch(`${API_URL}/examinations`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then((data) => setExaminations(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Failed to fetch examinations:", err);
        setError("Could not load examinations. Make sure the backend is running.");
      })
      .finally(() => setLoading(false));
  }

  function fetchVolunteers() {
    fetch(`${API_URL}/volunteers`)
      .then((res) => res.json())
      .then((data) => setVolunteers(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Failed to fetch volunteers:", err));
  }

  function fetchPersons() {
    fetch(`${API_URL}/persons`)
      .then((res) => res.json())
      .then((data) => setPersons(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Failed to fetch persons:", err));
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
            if (data && data.error) message = data.error;
          } catch {}
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
    if (!window.confirm("Are you sure you want to delete this examination?")) return;

    setError("");
    setLoading(true);

    fetch(`${API_URL}/examinations/${exam_id}`, {
      method: "DELETE",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json().catch(() => ({}));
      })
      .then(() => fetchExaminations())
      .catch((err) => {
        console.error("Failed to delete examination:", err);
        setError(`Could not delete examination: ${err.message}`);
        setLoading(false);
      });
  }

  return (
    <div className="space-y-6">
      
      {/* Top Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Scheduled Exams</div>
          <div className="text-3xl font-extrabold text-slate-800 mt-1">{examinations.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Scribe Hours</div>
          <div className="text-3xl font-extrabold text-indigo-600 mt-1">
            {examinations.reduce((acc, curr) => acc + (Number(curr.duration) || 0), 0)}
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Locations</div>
          <div className="text-3xl font-extrabold text-blue-600 mt-1">
            {new Set(examinations.map((e) => e.location)).size}
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
        <h3 className="text-lg font-bold text-slate-800 mb-4">Schedule New Examination</h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="subject"
              placeholder="Subject Name"
              value={form.subject}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <input
              type="datetime-local"
              name="date_time"
              value={form.date_time}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-slate-600"
            />
            <input
              type="text"
              name="location"
              placeholder="Exam Location"
              value={form.location}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <input
              type="number"
              name="duration"
              placeholder="Duration (hours) e.g., 2.5"
              min="0.5"
              step="0.5"
              value={form.duration}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            
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
                  ID: #{p.person_id} - {p.preferred_language} ({p.contact_info})
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
                  ID: #{v.vol_id} - {v.vol_name} ({v.language})
                </option>
              ))}
            </select>

            <div className="md:col-span-3 flex justify-end mt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 px-6 rounded-lg shadow-sm transition duration-150 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Add Examination Allocation"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Directory Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Examination Roster</h3>
          <span className="text-xs text-slate-500 font-medium">{examinations.length} Entries</span>
        </div>

        {loading && examinations.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading examinations...</div>
        ) : examinations.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">No examinations scheduled yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100/75 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="py-3 px-6">Subject</th>
                  <th className="py-3 px-6">Date & Time</th>
                  <th className="py-3 px-6">Location</th>
                  <th className="py-3 px-6">Duration</th>
                  <th className="py-3 px-6">Visually Impaired Person ID</th>
                  <th className="py-3 px-6">Vol ID</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {examinations.map((e) => (
                  <tr key={e.exam_id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-6 font-semibold text-slate-800">{e.subject}</td>
                    <td className="py-4 px-6 text-slate-600">
                      {e.date_time ? new Date(e.date_time).toLocaleString() : "Not specified"}
                    </td>
                    <td className="py-4 px-6 text-slate-600">{e.location}</td>
                    <td className="py-4 px-6 text-slate-600 font-medium">{e.duration} hrs</td>
                    <td className="py-4 px-6 text-slate-600">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-200 text-slate-800">
                        #{e.person_id}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        #{e.vol_id}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(e.exam_id)}
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