// import React, { useState, useEffect, useRef } from "react";

// const Dashboard = ({ backendUrl }) => {
//   const [query, setQuery] = useState("");
//   const [weather, setWeather] = useState(null);
//   const [response, setResponse] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);
  
//   const synthRef = useRef(window.speechSynthesis);

//   // 1. Fetch Weather
//   useEffect(() => {
//     fetch("https://api.open-meteo.com/v1/forecast?latitude=20.59&longitude=78.96&current_weather=true")
//       .then(res => res.json())
//       .then(data => setWeather(data.current_weather))
//       .catch(err => console.error("Weather Error:", err));
//   }, []);

//   // 2. Mic Logic
//   const startListening = () => {
//     if ('webkitSpeechRecognition' in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.lang = 'hi-IN'; 
//       recognition.onstart = () => setIsListening(true);
//       recognition.onend = () => setIsListening(false);
//       recognition.onresult = (event) => {
//         const transcript = event.results[0][0].transcript;
//         setQuery(transcript);
//       };
//       recognition.start();
//     } else {
//       alert("Use Google Chrome for Voice features.");
//     }
//   };

//   // 3. Text-to-Speech with Male Voice
//   const speakResponse = () => {
//     if (isSpeaking) {
//       synthRef.current.cancel();
//       setIsSpeaking(false);
//       return;
//     }

//     if (!response) return;

//     const utterance = new SpeechSynthesisUtterance(response);
    
//     // Select a male voice
//     const voices = synthRef.current.getVoices();
//     const maleVoice = voices.find(voice => 
//       voice.name.includes('Male') ||
//       voice.name.includes('Google हिन्दी') ||
//       voice.name.includes('Google UK English Male') ||
//       voice.name.includes('Microsoft David') ||
//       voice.name.includes('Rishi') ||
//       (voice.lang.startsWith('hi') || voice.lang.startsWith('en'))
//     );
    
//     if (maleVoice) {
//       utterance.voice = maleVoice;
//     }
    
//     // Male voice settings
//     utterance.rate = 0.95; // Slightly slower for clarity
//     utterance.pitch = 0.9; // Lower pitch for male voice
//     utterance.volume = 1.0; // Full volume
//     utterance.lang = 'hi-IN'; // Hindi language
    
//     utterance.onstart = () => setIsSpeaking(true);
//     utterance.onend = () => setIsSpeaking(false);
//     utterance.onerror = () => setIsSpeaking(false);
    
//     synthRef.current.speak(utterance);
//   };

//   // Stop speaking
//   const stopSpeaking = () => {
//     synthRef.current.cancel();
//     setIsSpeaking(false);
//   };

//   // 4. Search Logic
//   const handleSearch = async (manualQuery, imageFile) => {
//     const textToSend = manualQuery || query;
//     if (!textToSend && !imageFile) {
//       alert("Please type a question or upload an image!");
//       return;
//     }

//     setLoading(true);
//     setResponse(null);
//     console.log("🚀 Sending Request to:", backendUrl);

//     try {
//       const formData = new FormData();
//       formData.append("user_id", "farmer_01");
//       if (textToSend) formData.append("text", textToSend);
//       if (imageFile) formData.append("image", imageFile);

//       const res = await fetch(backendUrl, { method: "POST", body: formData });
      
//       console.log("📡 Server Status:", res.status);
      
//       if (!res.ok) {
//         throw new Error(`Server Error: ${res.status}`);
//       }

//       const data = await res.json();
//       console.log("✅ Data Received:", data);
//       setResponse(data.answer);

//       // Auto-play voice response
//       setTimeout(() => {
//         if (data.answer) {
//           const utterance = new SpeechSynthesisUtterance(data.answer);
//           const voices = synthRef.current.getVoices();
//           const maleVoice = voices.find(voice => 
//             voice.name.includes('Male') ||
//             voice.name.includes('Google हिन्दी') ||
//             (voice.lang.startsWith('hi') || voice.lang.startsWith('en'))
//           );
//           if (maleVoice) utterance.voice = maleVoice;
//           utterance.rate = 0.95;
//           utterance.pitch = 0.9;
//           utterance.lang = 'hi-IN';
//           utterance.onstart = () => setIsSpeaking(true);
//           utterance.onend = () => setIsSpeaking(false);
//           synthRef.current.speak(utterance);
//         }
//       }, 500);

//     } catch (err) {
//       console.error("🔥 FETCH ERROR:", err);
//       setResponse(`❌ Error: ${err.message}. (Check Console F12 for details)`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="dashboard-container">
      
//       {/* Header */}
//       <div className="header-flex">
//         <div>
//           <h1 style={{margin:0, color:'#333'}}>Namaste, Farmer! 🙏</h1>
//           <p style={{margin:0, color:'#666'}}>Ready to solve your farming problems?</p>
//         </div>
//         {weather && (
//           <div className="weather-widget">
//             <span style={{fontSize:'30px'}}>☀️</span>
//             <div>
//               <strong>{weather.temperature}°C</strong>
//               <div style={{fontSize:'12px', color:'#777'}}>Wind: {weather.windspeed} km/h</div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Hero Section */}
//       <div className="hero-box">
//         <h2 style={{margin:0}}>How can I help you today?</h2>
        
//         <div className="search-wrapper">
//           <input 
//             type="text" 
//             className="search-input"
//             placeholder="Ask a question..." 
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//           />
//           <button onClick={startListening} className={`mic-btn ${isListening ? 'listening' : ''}`}>🎤</button>
//           <button onClick={() => handleSearch()} className="search-btn" disabled={loading}>
//             {loading ? "Wait..." : "Search"}
//           </button>
//         </div>
//         {isListening && <p>Listening... Speak now 🗣️</p>}
//       </div>

//       {/* Cards Grid */}
//       <div className="cards-grid">
//         <div className="card green">
//           <input 
//             type="file" 
//             accept="image/*" 
//             style={{opacity:0, position:'absolute', inset:0, cursor:'pointer'}}
//             onChange={(e) => handleSearch(null, e.target.files[0])}
//           />
//           <span className="card-icon">📸</span>
//           <h3>Scan Crop</h3>
//           <p>Upload photo to detect disease.</p>
//         </div>

//         <div className="card blue" onClick={() => handleSearch("Give me irrigation advice")}>
//           <span className="card-icon">💧</span>
//           <h3>Irrigation</h3>
//           <p>Check water schedule.</p>
//         </div>

//         <div className="card yellow" onClick={() => handleSearch("Current mandi prices")}>
//           <span className="card-icon">💰</span>
//           <h3>Market Price</h3>
//           <p>Check Mandi rates.</p>
//         </div>
//       </div>

//       {/* AI Response */}
//       {(response || loading) && (
//         <div className="response-box">
//           <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
//             <h3 style={{color:'#14532d', margin:0}}>🤖 Bhasha-Kisan Says:</h3>
//             {response && !loading && (
//               <div style={{display: 'flex', gap: '10px'}}>
//                 <button 
//                   onClick={speakResponse}
//                   style={{
//                     background: isSpeaking ? '#ef4444' : '#22c55e',
//                     color: 'white',
//                     border: 'none',
//                     padding: '10px 20px',
//                     borderRadius: '25px',
//                     cursor: 'pointer',
//                     fontSize: '16px',
//                     fontWeight: 'bold',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '8px',
//                     transition: 'all 0.3s'
//                   }}
//                 >
//                   {isSpeaking ? '⏹️ Stop' : '🔊 Play Voice'}
//                 </button>
//               </div>
//             )}
//           </div>
//           {loading ? (
//             <p style={{color: '#22c55e', fontWeight: 'bold'}}>
//               Analyzing... (This may take 60 seconds if server is waking up)
//             </p>
//           ) : (
//             <div className="response-text">{response}</div>
//           )}
//         </div>
//       )}

//     </div>
//   );
// };

// export default Dashboard;

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
      };
      recognition.start();
    } else {
      alert("Use Google Chrome for Voice features.");
    }
  };

  // 3. Search Logic
  const handleSearch = async (manualQuery, imageFile) => {
    const textToSend = manualQuery || query;
    if (!textToSend && !imageFile) {
      alert("Please type a question or upload an image!");
      return;
    }

    setLoading(true);
    setResponse(null);
    console.log("🚀 Sending Request to:", backendUrl);

    try {
      const formData = new FormData();
      formData.append("user_id", "farmer_01");
      if (textToSend) formData.append("text", textToSend);
      if (imageFile) formData.append("image", imageFile);

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
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4 md:p-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">
            Namaste, Farmer! 🙏
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Ready to solve your farming problems?
          </p>
        </div>
        {weather && (
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-md border border-green-100 hover:shadow-lg transition-shadow duration-300">
            <span className="text-4xl">☀️</span>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {weather.temperature}°C
              </div>
              <div className="text-xs text-gray-600">
                Wind: {weather.windspeed} km/h
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl shadow-xl p-8 md:p-12 mb-8 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
        </div>
        
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
            What farming challenge can I help solve? 🌱
          </h2>
          
          <div className="flex flex-col md:flex-row gap-3 max-w-3xl mx-auto">
            <div className="flex-1 relative">
              <input 
                type="text" 
                className="w-full px-6 py-4 rounded-full text-gray-800 shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 pr-14"
                placeholder="Ask about crops, pests, weather, prices..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                onClick={startListening} 
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🎤
              </button>
            </div>
            <button 
              onClick={() => handleSearch()} 
              disabled={loading}
              className="px-8 py-4 bg-white text-green-700 font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> Analyzing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  🔍 Search
                </span>
              )}
            </button>
          </div>
          
          {isListening && (
            <p className="text-white text-center mt-4 animate-pulse font-medium">
              🗣️ Listening... Speak now
            </p>
          )}
        </div>
      </div>

      {/* Quick Tips Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-8">
        <p className="text-sm text-yellow-800">
          💡 <strong>Quick Tip:</strong> Upload a crop photo for instant disease detection, or ask about market prices, weather forecasts, and irrigation schedules!
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Scan Crop Card */}
        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer border-l-8 border-green-500">
          <input 
            type="file" 
            accept="image/*" 
            className="opacity-0 absolute inset-0 cursor-pointer z-10"
            onChange={(e) => handleSearch(null, e.target.files[0])}
          />
          <div className="p-6">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">📸</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              Scan Crop
              <span className="text-sm text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
            </h3>
            <p className="text-gray-600 text-sm">
              Upload a photo to detect crop diseases instantly using AI
            </p>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-500 opacity-5 rounded-bl-full"></div>
        </div>

        {/* Irrigation Card */}
        <div 
          onClick={() => handleSearch("Give me irrigation advice")}
          className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer border-l-8 border-blue-500"
        >
          <div className="p-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">💧</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              Irrigation
              <span className="text-sm text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
            </h3>
            <p className="text-gray-600 text-sm">
              Get smart water scheduling and irrigation recommendations
            </p>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 opacity-5 rounded-bl-full"></div>
        </div>

        {/* Market Price Card */}
        <div 
          onClick={() => handleSearch("Current mandi prices")}
          className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer border-l-8 border-yellow-500"
        >
          <div className="p-6">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">💰</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              Market Price
              <span className="text-sm text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
            </h3>
            <p className="text-gray-600 text-sm">
              Check current Mandi rates and price trends for your crops
            </p>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500 opacity-5 rounded-bl-full"></div>
        </div>
      </div>

      {/* Additional Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-bold text-purple-900 mb-2 flex items-center gap-2">
            🌾 Popular Questions
          </h3>
          <div className="space-y-2">
            {[
              "What crops should I plant this season?",
              "How to control pest infestation?",
              "Best fertilizer for wheat?",
              "When to harvest tomatoes?"
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(q)}
                className="block w-full text-left text-sm text-purple-700 hover:text-purple-900 hover:bg-purple-200 px-3 py-2 rounded-lg transition-colors duration-200"
              >
                • {q}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-bold text-orange-900 mb-2 flex items-center gap-2">
            📊 Government Schemes
          </h3>
          <p className="text-sm text-orange-700 mb-3">
            Check eligibility for agricultural subsidies and support programs
          </p>
          <button 
            onClick={() => handleSearch("Tell me about government schemes for farmers")}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors duration-200"
          >
            Learn More →
          </button>
        </div>
      </div>

      {/* AI Response */}
      {(response || loading) && (
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-t-4 border-green-500 animate-fadeIn">
          <h3 className="text-xl md:text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
            🤖 Bhasha-Kisan Says:
          </h3>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin text-6xl mb-4">🌾</div>
              <p className="text-green-600 font-semibold text-center">
                Analyzing your query...
              </p>
              <p className="text-gray-500 text-sm text-center mt-2">
                (This may take up to 60 seconds if server is waking up)
              </p>
            </div>
          ) : (
            <div className="prose max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                {response}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Dashboard;
