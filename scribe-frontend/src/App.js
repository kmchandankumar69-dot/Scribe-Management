import React, { useState } from "react";
import Volunteers from "./Volunteers";
import Persons from "./Persons";
import Examinations from "./Examinations";
import Coordinators from "./Coordinators";
import Feedback from "./Feedback";

export default function App() {
  const [activeTab, setActiveTab] = useState("volunteers");

  const tabs = [
    { key: "volunteers", label: "Volunteers", icon: "👥" },
    { key: "persons", label: "Visually Impaired Person", icon: "👤" },
    { key: "examinations", label: "Examinations", icon: "📝" },
    { key: "coordinators", label: "Coordinators", icon: "👔" },
    { key: "feedback", label: "Feedback", icon: "💬" },
  ];

  const currentTabLabel = tabs.find(t => t.key === activeTab)?.label;

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            SCRIBE
          </h1>
          <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Management</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {tabs.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeTab === key 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span className="font-semibold">{label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="text-sm font-medium text-slate-300">Chandan Kumar</div>
          <div className="text-xs text-slate-500">System Administrator</div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              {currentTabLabel} Directory
            </h2>
            <p className="text-sm text-slate-500 mt-1">Manage and update {currentTabLabel.toLowerCase()} records in the system.</p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600 bg-slate-100 px-4 py-2 rounded-full">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-8 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            {activeTab === "volunteers" && <Volunteers />}
            {activeTab === "persons" && <Persons />}
            {activeTab === "examinations" && <Examinations />}
            {activeTab === "coordinators" && <Coordinators />}
            {activeTab === "feedback" && <Feedback />}
          </div>
        </div>
      </main>

    </div>
  );
}