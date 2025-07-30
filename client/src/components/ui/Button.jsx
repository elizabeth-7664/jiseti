// src/components/ui/Buttons.jsx
import React from "react";
import clsx from "clsx";

const base =
  "rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-200 text-black hover:bg-gray-300",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

export default function Button({
  children,
  variant = "primary",
  className,
  ...props
}) {
  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
