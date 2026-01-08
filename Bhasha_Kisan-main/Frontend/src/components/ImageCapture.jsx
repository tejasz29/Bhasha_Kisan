import React from "react";

const ImageCapture = ({ onCapture }) => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition cursor-pointer relative">
      <input 
        type="file" 
        accept="image/*" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={(e) => {
          if (e.target.files[0]) onCapture(e.target.files[0]);
        }}
      />
      <div className="text-4xl mb-2">📸</div>
      <p className="text-gray-600 font-medium">Click to Upload Crop Photo</p>
      <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG</p>
    </div>
  );
};

export default ImageCapture;