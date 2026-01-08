import React from "react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "dashboard", label: "🏠 Dashboard" },
    { id: "crop_doctor", label: "🌱 Crop Doctor" },
    { id: "weather", label: "☁️ Weather" },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <h1>🌾 Bhasha-Kisan</h1>
        <p>AI Agriculture Assistant</p>
      </div>
      
      <nav className="nav-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-btn ${activeTab === item.id ? "active" : ""}`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;