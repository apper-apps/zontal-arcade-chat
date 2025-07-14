import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  className, 
  variant = "default",
  ...props 
}, ref) => {
  const baseStyles = "rounded-lg border transition-all duration-200";
  
  const variants = {
    default: "bg-surface border-gray-700 shadow-lg",
    glass: "glass-card shadow-xl",
    elevated: "bg-surface border-gray-700 shadow-xl hover:shadow-2xl",
  };

  return (
    <div
      ref={ref}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    />
  );
});

Card.displayName = "Card";

export default Card;