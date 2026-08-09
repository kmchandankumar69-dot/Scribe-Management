import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

export default function Coordinators() {
  const [coordinators, setCoordinators] = useState([]);
  const [examinations, setExaminations] = useState([]); // NEW: State for dropdown
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    coord_name: "",
    contact_info: "",
    assigned_exam: "",
  });

  useEffect(() => {
    fetchCoordinators();
    fetchExaminations(); // NEW: Fetch exams on load
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
        setError("Could not load coordinators. Make sure the backend is running.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // NEW: Fetch examinations for the dropdown
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
            if (data && data.error) message = data.error;
          } catch {}
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
    <div className="space-y-6">
      
      {/* Top Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Coordinators</div>
          <div className="text-3xl font-extrabold text-slate-800 mt-1">{coordinators.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Exams Managed</div>
          <div className="text-3xl font-extrabold text-blue-600 mt-1">
            {new Set(coordinators.map(c => c.assigned_exam)).size}
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
        <h3 className="text-lg font-bold text-slate-800 mb-4">Register Coordinator</h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              name="coord_name"
              placeholder="Coordinator Name"
              value={form.coord_name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <input
              type="text"
              name="contact_info"
              placeholder="Contact Info"
              value={form.contact_info}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            
            {/* NEW: Exam Selection Dropdown */}
            <select
              name="assigned_exam"
              value={form.assigned_exam}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-slate-700"
            >
              <option value="">Assign to Exam...</option>
              {examinations.map((e) => (
                <option key={e.exam_id} value={e.exam_id}>
                  ID: #{e.exam_id} - {e.subject}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 px-4 rounded-lg shadow-sm transition duration-150 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Add Coordinator"}
            </button>
          </div>
        </form>
      </div>

      {/* Directory Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Coordinators List</h3>
          <span className="text-xs text-slate-500 font-medium">{coordinators.length} Entries</span>
        </div>

        {loading && coordinators.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading coordinators...</div>
        ) : coordinators.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">No coordinators registered yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100/75 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="py-3 px-6">ID</th>
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">Contact Info</th>
                  <th className="py-3 px-6">Assigned Exam</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {coordinators.map((c) => (
                  <tr key={c.coord_id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-6 font-medium text-slate-400">#{c.coord_id}</td>
                    <td className="py-4 px-6 font-semibold text-slate-800">{c.coord_name}</td>
                    <td className="py-4 px-6 text-slate-600">{c.contact_info}</td>
                    <td className="py-4 px-6 text-slate-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                        Exam #{c.assigned_exam}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(c.coord_id)}
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