import React, { useState } from "react";
import Volunteers from "./Volunteers";
import Persons from "./Persons";
import Examinations from "./Examinations";
import Coordinators from "./Coordinators";
import Feedback from "./Feedback";

function App() {
  const [activeTab, setActiveTab] = useState("volunteers");

  const tabs = [
    { key: "volunteers", label: "Volunteers" },
    { key: "persons", label: "Persons" },
    { key: "examinations", label: "Examinations" },
    { key: "coordinators", label: "Coordinators" },
    { key: "feedback", label: "Feedback" },
  ];

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: "20px 30px",
        borderRadius: 15,
        backgroundColor: "#f9faff",
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#4a90e2", marginBottom: 30 }}>
        Scribe Allocation System
      </h1>

      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 15,
          marginBottom: 30,
          flexWrap: "wrap",
        }}
      >
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: "10px 24px",
              fontSize: 16,
              fontWeight: "600",
              borderRadius: 30,
              border: "none",
              cursor: "pointer",
              backgroundColor: activeTab === key ? "#4a90e2" : "#e1e7f6",
              color: activeTab === key ? "white" : "#4a90e2",
              boxShadow:
                activeTab === key
                  ? "0 4px 12px rgba(74, 144, 226, 0.4)"
                  : "none",
              transition: "all 0.3s ease",
              minWidth: 120,
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      <section
        style={{
          backgroundColor: "white",
          padding: 30,
          borderRadius: 15,
          boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
          minHeight: 400,
        }}
      >
        {activeTab === "volunteers" && <Volunteers />}
        {activeTab === "persons" && <Persons />}
        {activeTab === "examinations" && <Examinations />}
        {activeTab === "coordinators" && <Coordinators />}
        {activeTab === "feedback" && <Feedback />}
      </section>
    </div>
  );
}

export default App;
