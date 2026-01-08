import React from "react";

const Header = ({ weather }) => {
  return (
    <header className="bg-white p-4 shadow-sm flex justify-between items-center px-8">
      <div>
        <h1 className="text-2xl font-bold text-green-800">Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back, Farmer</p>
      </div>

      {weather && (
        <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-full">
          <span className="text-2xl">☀️</span>
          <div>
            <span className="font-bold text-blue-900">{weather.temperature}°C</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;