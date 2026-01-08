import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import "./index.css"; 

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const BACKEND_URL = "https://bhasha-kisan.onrender.com/analyze";

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-content">
        {activeTab === "dashboard" && <Dashboard backendUrl={BACKEND_URL} />}
        {activeTab === "crop_doctor" && <div style={{padding:40}}><h2>Click 'Scan Crop' on Dashboard</h2></div>}
        {activeTab === "weather" && <div style={{padding:40}}><h2>Weather Forecast</h2></div>}
      </div>
    </div>
  );
}

export default App;