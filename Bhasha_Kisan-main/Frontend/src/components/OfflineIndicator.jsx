import React from 'react';
import useNetworkStatus from '../hooks/useNetworkStatus';

const OfflineIndicator = () => {
  const isOnline = useNetworkStatus();

  if (isOnline) {
    return null; // Don't show anything if user is online
  }

  return (
    <div className="bg-red-500 text-white text-center py-2 px-4 fixed bottom-0 w-full z-50">
      <p className="font-bold">
        You are currently offline. Some features may be unavailable. 
        {'\u{1F4F4}'} {/* Signal Strength Emoji */}
      </p>
    </div>
  );
};

export default OfflineIndicator;