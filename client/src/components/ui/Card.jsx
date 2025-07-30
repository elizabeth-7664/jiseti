import React from "react";
import classNames from "classnames";

export const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={classNames(
        "rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm p-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ className, children, ...props }) => {
  return (
    <div className={classNames("mt-2 text-sm text-gray-700 dark:text-gray-300", className)} {...props}>
      {children}
    </div>
  );
};
