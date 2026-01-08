import React, { useState, useEffect } from "react";

const Dashboard = ({ backendUrl }) => {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // 1. Fetch Weather
  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=20.59&longitude=78.96&current_weather=true")
      .then(res => res.json())
      .then(data => setWeather(data.current_weather))
      .catch(err => console.error("Weather Error:", err));
  }, []);

  // 2. Mic Logic
  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'hi-IN'; 
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        // Optional: Auto-submit on voice end
        // handleSearch(transcript, null); 
      };
      recognition.start();
    } else {
      alert("Use Google Chrome for Voice features.");
    }
  };

  // 3. Search Logic (DEBUG VERSION)
  const handleSearch = async (manualQuery, imageFile) => {
    const textToSend = manualQuery || query;
    if (!textToSend && !imageFile) {
      alert("Please type a question or upload an image!");
      return;
    }

    // 1. START LOADING
    setLoading(true);
    setResponse(null);
    console.log("🚀 Sending Request to:", backendUrl);

    try {
      const formData = new FormData();
      formData.append("user_id", "farmer_01");
      if (textToSend) formData.append("text", textToSend);
      if (imageFile) formData.append("image", imageFile);

      // 2. SEND TO BACKEND
      const res = await fetch(backendUrl, { method: "POST", body: formData });
      
      console.log("📡 Server Status:", res.status);
      
      if (!res.ok) {
        throw new Error(`Server Error: ${res.status}`);
      }

      const data = await res.json();
      console.log("✅ Data Received:", data);
      setResponse(data.answer);

    } catch (err) {
      console.error("🔥 FETCH ERROR:", err);
      setResponse(`❌ Error: ${err.message}. (Check Console F12 for details)`);
    } finally {
      // 3. STOP LOADING (Always run this!)
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      
      {/* Header */}
      <div className="header-flex">
        <div>
          <h1 style={{margin:0, color:'#333'}}>Namaste, Farmer! 🙏</h1>
          <p style={{margin:0, color:'#666'}}>Ready to solve your farming problems?</p>
        </div>
        {weather && (
          <div className="weather-widget">
            <span style={{fontSize:'30px'}}>☀️</span>
            <div>
              <strong>{weather.temperature}°C</strong>
              <div style={{fontSize:'12px', color:'#777'}}>Wind: {weather.windspeed} km/h</div>
            </div>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <div className="hero-box">
        <h2 style={{margin:0}}>How can I help you today?</h2>
        
        <div className="search-wrapper">
          <input 
            type="text" 
            className="search-input"
            placeholder="Ask a question..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={startListening} className={`mic-btn ${isListening ? 'listening' : ''}`}>🎤</button>
          <button onClick={() => handleSearch()} className="search-btn" disabled={loading}>
            {loading ? "Wait..." : "Search"}
          </button>
        </div>
        {isListening && <p>Listening... Speak now 🗣️</p>}
      </div>

      {/* Cards Grid */}
      <div className="cards-grid">
        <div className="card green">
          <input 
            type="file" 
            accept="image/*" 
            style={{opacity:0, position:'absolute', inset:0, cursor:'pointer'}}
            onChange={(e) => handleSearch(null, e.target.files[0])}
          />
          <span className="card-icon">📸</span>
          <h3>Scan Crop</h3>
          <p>Upload photo to detect disease.</p>
        </div>

        <div className="card blue" onClick={() => handleSearch("Give me irrigation advice")}>
          <span className="card-icon">💧</span>
          <h3>Irrigation</h3>
          <p>Check water schedule.</p>
        </div>

        <div className="card yellow" onClick={() => handleSearch("Current mandi prices")}>
          <span className="card-icon">💰</span>
          <h3>Market Price</h3>
          <p>Check Mandi rates.</p>
        </div>
      </div>

      {/* AI Response */}
      {(response || loading) && (
        <div className="response-box">
          <h3 style={{color:'#14532d', marginTop:0}}>🤖 Bhasha-Kisan Says:</h3>
          {loading ? (
            <p style={{color: '#22c55e', fontWeight: 'bold'}}>
              Analyzing... (This may take 60 seconds if server is waking up)
            </p>
          ) : (
            <div className="response-text">{response}</div>
          )}
        </div>
      )}

    </div>
  );
};

export default Dashboard;