// src/components/ui/Alert.jsx
import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

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

  if (!message) {
    return null;
  }

  let styles = {
    container: 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
    icon: <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" />,
    button: 'text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800/50'
  };

  switch (type) {
    case 'success':
      styles = {
        container: 'bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300',
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />,
        button: 'text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-800/50'
      };
      break;
    case 'error':
      styles = {
        container: 'bg-red-50/50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300',
        icon: <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />,
        button: 'text-red-500 hover:bg-red-100 dark:hover:bg-red-800/50'
      };
      break;
    case 'warning':
      styles = {
        container: 'bg-amber-50/50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300',
        icon: <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400" />,
        button: 'text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-800/50'
      };
      break;
    default:
      break;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={clsx("p-4 mb-4 text-sm rounded-xl border flex items-start justify-between shadow-sm backdrop-blur-sm", styles.container)} 
          role="alert"
        >
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">{styles.icon}</div>
            <div className="font-medium leading-relaxed">{message}</div>
          </div>
          {onDismiss && (
            <button
              type="button"
              className={clsx("ml-3 shrink-0 rounded-lg p-1.5 inline-flex items-center justify-center transition-colors", styles.button)}
              onClick={() => {
                setIsVisible(false);
                onDismiss();
              }}
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;