import React from "react";
import classNames from "classnames";

const badgeVariants = {
  default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white",
  success: "bg-green-100 text-green-800 dark:bg-green-700 dark:text-white",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-white",
  danger: "bg-red-100 text-red-800 dark:bg-red-700 dark:text-white",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-white",
};

export const Badge = ({ children, variant = "default", className = "", ...props }) => {
  return (
    <span
      className={classNames(
        "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium",
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
