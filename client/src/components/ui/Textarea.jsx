import React from "react";
import clsx from "clsx";

const Textarea = React.forwardRef(
  ({ label, className, rows = 4, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label
            htmlFor={props.id || props.name}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={clsx(
            "px-4 py-2 rounded-md border border-input bg-gray-50 dark:bg-gray-800/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
