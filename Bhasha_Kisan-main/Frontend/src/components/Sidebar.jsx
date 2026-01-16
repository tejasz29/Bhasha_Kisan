// import React from "react";

// const Sidebar = ({ activeTab, setActiveTab }) => {
//   const menuItems = [
//     { id: "dashboard", label: "🏠 Dashboard" },
//     { id: "crop_doctor", label: "🌱 Crop Doctor" },
//     { id: "weather", label: "☁️ Weather" },
//   ];

//   return (
//     <aside className="sidebar">
//       <div className="brand">
//         <h1>🌾 Bhasha-Kisan</h1>
//         <p>AI Agriculture Assistant</p>
//       </div>
      
//       <nav className="nav-menu">
//         {menuItems.map((item) => (
//           <button
//             key={item.id}
//             onClick={() => setActiveTab(item.id)}
//             className={`nav-btn ${activeTab === item.id ? "active" : ""}`}
//           >
//             {item.label}
//           </button>
//         ))}
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;

import React from "react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "dashboard", icon: "🏠", label: "Dashboard", color: "green" },
    { id: "crop_doctor", icon: "🔬", label: "Crop Doctor", color: "blue" },
    { id: "weather", icon: "🌤️", label: "Weather", color: "yellow" },
    { id: "soil", icon: "🌱", label: "Soil Health", color: "orange" },
    { id: "schemes", icon: "📋", label: "Gov Schemes", color: "purple" },
    { id: "expert", icon: "👨‍🌾", label: "Expert Connect", color: "pink" },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-green-800 to-green-900 min-h-screen shadow-2xl flex flex-col">
      
      {/* Logo Section */}
      <div className="p-6 border-b border-green-700">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-full p-2 shadow-lg">
            <span className="text-2xl">🌾</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">Bhasha-Kisan</h1>
            <p className="text-green-300 text-xs">AI Agriculture Assistant</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
              activeTab === item.id
                ? "bg-white text-green-800 shadow-lg scale-105"
                : "text-white hover:bg-green-700 hover:translate-x-1"
            }`}
          >
            <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
            {activeTab === item.id && (
              <span className="ml-auto text-green-600 animate-pulse">●</span>
            )}
          </button>
        ))}
      </nav>

      {/* Help Section */}
      <div className="p-4 border-t border-green-700">
        <button className="w-full flex items-center gap-3 px-4 py-3 bg-green-700 hover:bg-green-600 text-white rounded-xl transition-all duration-300 hover:shadow-lg">
          <span className="text-xl">❓</span>
          <span className="font-medium">Help & Tutorial</span>
        </button>
        
        {/* Version Info */}
        <div className="mt-4 text-center text-green-400 text-xs">
          Version 1.0.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
