import React, { useEffect, useState } from "react";

const HistoryPanel = ({ userId, backendUrl }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch History from Backend API
  useEffect(() => {
    // Construct the URL: https://.../history/farmer_01
    // Note: We need to replace '/analyze' with '/history' if backendUrl includes it
    const baseUrl = backendUrl.replace("/analyze", ""); 
    const historyUrl = `${baseUrl}/history/${userId}`;

    fetch(historyUrl)
      .then(res => res.json())
      .then(data => {
        setHistory(data.history || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [userId, backendUrl]);

  if (loading) return <div className="p-4">Loading history...</div>;

  return (
    <div className="grid gap-4">
      {history.length === 0 ? (
        <p>No previous questions found.</p>
      ) : (
        history.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>📅 {new Date(item.timestamp).toLocaleDateString()}</span>
              <span>{item.analysis === "Image Analysis" ? "📸 Image" : "📝 Text"}</span>
            </div>
            <p className="font-bold text-gray-800">Q: {item.transcript}</p>
            <p className="text-gray-600 mt-2 truncate">A: {item.response?.answer || "..."}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default HistoryPanel;