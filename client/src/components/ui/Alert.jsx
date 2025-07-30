// src/components/ui/Alert.jsx
import React, { useEffect, useState } from 'react';

const Alert = ({ type = 'info', message, onDismiss, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Automatically dismiss the alert after a duration if onDismiss is provided
  useEffect(() => {
    if (onDismiss && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss(); // Call the parent's dismiss handler
      }, duration);
      return () => clearTimeout(timer); // Cleanup timer on unmount or re-render
    }
  }, [onDismiss, duration]);

  if (!isVisible || !message) {
    return null;
  }

  let bgColorClass = 'bg-blue-100 border-blue-400 text-blue-800'; // Default info
  let icon = (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
    </svg>
  );

  switch (type) {
    case 'success':
      bgColorClass = 'bg-green-100 border-green-400 text-green-800';
      icon = (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
      );
      break;
    case 'error':
      bgColorClass = 'bg-red-100 border-red-400 text-red-800';
      icon = (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
        </svg>
      );
      break;
    case 'warning':
      bgColorClass = 'bg-yellow-100 border-yellow-400 text-yellow-800';
      icon = (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0L14.77 10.5c.765 1.36-.202 3-1.743 3H7.213c-1.54 0-2.507-1.64-1.743-3L8.257 3.099zM10 14a1 1 0 100-2 1 1 0 000 2zm0-5a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1z" clipRule="evenodd"></path>
        </svg>
      );
      break;
    default:
      // info is default
      break;
  }

  return (
    <div className={`p-4 mb-4 text-sm rounded-lg border ${bgColorClass} flex items-center justify-between`} role="alert">
      <div className="flex items-center">
        {icon}
        <span className="ml-3 font-medium">{message}</span>
      </div>
      {onDismiss && (
        <button
          type="button"
          className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 ${
            type === 'success' ? 'text-green-800 hover:bg-green-200' :
            type === 'error' ? 'text-red-800 hover:bg-red-200' :
            type === 'warning' ? 'text-yellow-800 hover:bg-yellow-200' :
            'text-blue-800 hover:bg-blue-200'
          }`}
          onClick={() => {
            setIsVisible(false);
            onDismiss();
          }}
          aria-label="Dismiss"
        >
          <span className="sr-only">Dismiss</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;