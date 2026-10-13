import React, { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "accent" | "success" | "warning" | "neutral";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}) => {
  const variantStyles = {
    primary: "bg-krishi-primary-50 text-krishi-deepGreen border border-krishi-primary-200",
    secondary: "bg-krishi-leaf-100 text-krishi-primary-800 border border-krishi-leaf-300",
    accent: "bg-krishi-accent-50 text-krishi-accent-700 border border-krishi-accent-200",
    success: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border border-amber-200",
    neutral: "bg-gray-100 text-gray-700 border border-gray-200",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs font-medium rounded-md",
    md: "px-2.5 py-1 text-xs sm:text-sm font-semibold rounded-lg",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 leading-none select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
