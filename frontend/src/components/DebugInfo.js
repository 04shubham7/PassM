import React, { useState, useEffect } from 'react';

const DebugInfo = () => {
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const info = {
      userAgent: navigator.userAgent,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      isOnline: navigator.onLine,
      cookieEnabled: navigator.cookieEnabled,
      language: navigator.language,
      platform: navigator.platform,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookies: document.cookie,
      apiUrl: process.env.REACT_APP_API_URL,
      timestamp: new Date().toISOString()
    };
    setDebugInfo(info);
  }, []);

  const copyToClipboard = () => {
    const debugText = JSON.stringify(debugInfo, null, 2);
    navigator.clipboard.writeText(debugText);
    alert('Debug info copied to clipboard!');
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm z-50">
      <h3 className="font-bold text-sm mb-2">Debug Info</h3>
      <div className="text-xs space-y-1 max-h-40 overflow-y-auto">
        {Object.entries(debugInfo).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="font-medium">{key}:</span>
            <span className="text-gray-600 dark:text-gray-400 break-all">
              {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
            </span>
          </div>
        ))}
      </div>
      <button
        onClick={copyToClipboard}
        className="mt-2 w-full bg-blue-600 text-white text-xs py-1 rounded hover:bg-blue-700"
      >
        Copy Debug Info
      </button>
    </div>
  );
};

export default DebugInfo; 