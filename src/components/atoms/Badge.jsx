import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  children, 
  className,
  variant = "default",
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800",
    secondary: "bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800",
    accent: "bg-gradient-to-r from-accent-100 to-accent-200 text-accent-800",
    success: "bg-gradient-to-r from-green-100 to-green-200 text-green-800",
    warning: "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800",
    danger: "bg-gradient-to-r from-red-100 to-red-200 text-red-800",
    grade: {
      A: "bg-gradient-to-r from-green-100 to-green-200 text-green-800",
      B: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800",
      C: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800",
      D: "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800",
      F: "bg-gradient-to-r from-red-100 to-red-200 text-red-800"
    }
  };

  const getVariantClass = () => {
    if (variant.startsWith("grade-")) {
      const grade = variant.split("-")[1];
      return variants.grade[grade] || variants.default;
    }
    return variants[variant] || variants.default;
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm",
        getVariantClass(),
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";
export default Badge;