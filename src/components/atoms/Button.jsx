import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  icon,
  iconPosition = "left",
  loading = false,
  children, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-105 focus:ring-primary",
    secondary: "bg-white text-primary border border-primary hover:bg-blue-50 focus:ring-primary",
    outline: "bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
    success: "bg-success text-white hover:bg-green-600 focus:ring-success",
    warning: "bg-warning text-white hover:bg-orange-600 focus:ring-warning",
    error: "bg-error text-white hover:bg-red-600 focus:ring-error"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20
  };

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        loading && "opacity-75 cursor-not-allowed",
        className
      )}
      ref={ref}
      disabled={loading}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" size={iconSizes[size]} className="animate-spin mr-2" />
      )}
      {icon && iconPosition === "left" && !loading && (
        <ApperIcon name={icon} size={iconSizes[size]} className="mr-2" />
      )}
      {children}
      {icon && iconPosition === "right" && !loading && (
        <ApperIcon name={icon} size={iconSizes[size]} className="ml-2" />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;