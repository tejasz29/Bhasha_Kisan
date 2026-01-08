import React from 'react';

const TranscriptionDisplay = ({ transcript, isListening }) => {
  if (!transcript && !isListening) return null;

  return (
    <div className="fixed bottom-24 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="bg-black bg-opacity-80 backdrop-blur-md rounded-2xl p-6 shadow-2xl max-w-2xl w-11/12 transform transition-all duration-300 border border-green-500/30">
        <div className="flex items-center space-x-3 mb-3">
          {isListening && (
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
          <span className={`text-xs font-bold tracking-wider uppercase ${isListening ? 'text-red-400' : 'text-gray-400'}`}>
            {isListening ? 'Listening...' : 'Transcript'}
          </span>
        </div>
        <p className="text-white text-lg font-medium leading-relaxed text-center">
          {transcript || "Start speaking..."}
        </p>
      </div>
    </div>
  );
};

export default TranscriptionDisplay;