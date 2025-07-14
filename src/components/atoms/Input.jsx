import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className, 
  type = "text", 
  error,
  ...props 
}, ref) => {
  const baseStyles = "flex h-10 w-full rounded-lg border bg-surface px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200";
  
  const errorStyles = error 
    ? "border-error focus:ring-error" 
    : "border-gray-600 hover:border-gray-500";

  return (
    <input
      type={type}
      ref={ref}
      className={cn(baseStyles, errorStyles, className)}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;