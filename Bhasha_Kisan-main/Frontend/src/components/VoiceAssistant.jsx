import React from 'react';
import { useAuth } from '../hooks/useAuth';

const VoiceAssistant = ({ isListening, onClick }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={onClick}
        className={`p-4 rounded-full shadow-2xl transform transition-transform hover:scale-110 ${
          isListening 
            ? 'bg-red-500 animate-pulse' 
            : 'bg-gradient-to-r from-green-500 to-green-600'
        }`}
      >
        <span className="text-3xl">
          {isListening ? '🛑' : 'mic'} {/* Use text if emoji fails, or a proper Icon */}
        </span>
      </button>
    </div>
  );
};

export default VoiceAssistant;