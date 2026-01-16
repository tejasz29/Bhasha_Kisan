// import React, { useState } from "react";
// import Sidebar from "./components/Sidebar";
// import Dashboard from "./components/Dashboard";
// import "./index.css"; 

// function App() {
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const BACKEND_URL = "https://bhasha-kisan.onrender.com/analyze";

//   return (
//     <div className="app-container">
//       <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
//       <div className="main-content">
//         {activeTab === "dashboard" && <Dashboard backendUrl={BACKEND_URL} />}
//         {activeTab === "crop_doctor" && <div style={{padding:40}}><h2>Click 'Scan Crop' on Dashboard</h2></div>}
//         {activeTab === "weather" && <div style={{padding:40}}><h2>Weather Forecast</h2></div>}
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import "./index.css"; 

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const BACKEND_URL = "https://bhasha-kisan.onrender.com/analyze";

  // Placeholder components for other tabs
  const CropDoctor = () => (
    <div className="p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">🔬 Crop Doctor</h2>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <p className="text-gray-700 mb-4">
            Upload a photo of your crop from the Dashboard to get instant disease detection and treatment recommendations.
          </p>
          <button 
            onClick={() => setActiveTab("dashboard")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard →
          </button>
        </div>
      </div>
    </div>
  );

  const Weather = () => (
    <div className="p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">🌤️ Weather Forecast</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-blue-900 mb-2">7-Day Forecast</h3>
            <p className="text-blue-700">Extended weather predictions for your farming region</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-yellow-900 mb-2">Rainfall Alerts</h3>
            <p className="text-yellow-700">Get notified about upcoming rain and storms</p>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-green-900 mb-2">Best Planting Days</h3>
            <p className="text-green-700">AI-recommended optimal days for sowing</p>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-purple-900 mb-2">Historical Data</h3>
            <p className="text-purple-700">Compare with previous years' patterns</p>
          </div>
        </div>
      </div>
    </div>
  );

  const SoilHealth = () => (
    <div className="p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">🌱 Soil Health Monitoring</h2>
        <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-orange-500">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Track Your Soil Quality</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">pH Level</span>
              <span className="text-green-600 font-bold">6.5 - Optimal</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Nitrogen (N)</span>
              <span className="text-yellow-600 font-bold">Medium</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Phosphorus (P)</span>
              <span className="text-green-600 font-bold">High</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Potassium (K)</span>
              <span className="text-green-600 font-bold">High</span>
            </div>
          </div>
          <button className="mt-6 w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
            Request Soil Test Kit
          </button>
        </div>
      </div>
    </div>
  );

  const GovSchemes = () => (
    <div className="p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">📋 Government Schemes</h2>
        <div className="space-y-4">
          {[
            { name: "PM-KISAN", desc: "₹6000/year direct benefit transfer", color: "green" },
            { name: "Crop Insurance", desc: "Protect your crops from natural disasters", color: "blue" },
            { name: "KCC Loan", desc: "Kisan Credit Card for farm expenses", color: "purple" },
            { name: "Subsidy Programs", desc: "Equipment and fertilizer subsidies", color: "orange" }
          ].map((scheme, idx) => (
            <div key={idx} className={`bg-${scheme.color}-50 border-l-4 border-${scheme.color}-500 p-6 rounded-lg hover:shadow-lg transition-shadow`}>
              <h3 className={`text-xl font-bold text-${scheme.color}-900 mb-2`}>{scheme.name}</h3>
              <p className={`text-${scheme.color}-700 mb-3`}>{scheme.desc}</p>
              <button className={`bg-${scheme.color}-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-${scheme.color}-700 transition-colors`}>
                Check Eligibility →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ExpertConnect = () => (
    <div className="p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">👨‍🌾 Connect with Experts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-pink-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">👨‍🔬</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Dr. Ramesh Kumar</h3>
                <p className="text-sm text-gray-600">Agricultural Scientist</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm mb-4">
              Expert in pest management and organic farming techniques.
            </p>
            <button className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors">
              Schedule Call
            </button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-indigo-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">👩‍🌾</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Dr. Priya Singh</h3>
                <p className="text-sm text-gray-600">Soil Health Expert</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm mb-4">
              Specializes in soil nutrition and crop rotation strategies.
            </p>
            <button className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition-colors">
              Schedule Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-content">
        {activeTab === "dashboard" && <Dashboard backendUrl={BACKEND_URL} />}
        {activeTab === "crop_doctor" && <CropDoctor />}
        {activeTab === "weather" && <Weather />}
        {activeTab === "soil" && <SoilHealth />}
        {activeTab === "schemes" && <GovSchemes />}
        {activeTab === "expert" && <ExpertConnect />}
      </div>
    </div>
  );
}

export default App;
