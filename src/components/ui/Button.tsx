import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

    const sizeStyles = {
      // Touch target sizing (minimum 44-48px height on mobile for accessible tap areas)
      sm: "min-h-[40px] px-3.5 py-1.5 text-xs gap-1.5",
      md: "min-h-[48px] px-5 py-2.5 text-sm gap-2",
      lg: "min-h-[52px] px-6 py-3.5 text-base gap-2.5",
    };

    const variantStyles = {
      primary:
        "bg-krishi-deepGreen text-krishi-warmIvory hover:bg-krishi-primary-600 focus:ring-krishi-deepGreen shadow-sm active:bg-krishi-primary-700",
      secondary:
        "bg-krishi-leafGreen text-krishi-primary-900 hover:bg-krishi-leaf-400 focus:ring-krishi-leafGreen font-semibold",
      accent:
        "bg-krishi-earthBrown text-white hover:bg-krishi-accent-600 focus:ring-krishi-earthBrown shadow-sm",
      outline:
        "border-2 border-krishi-deepGreen text-krishi-deepGreen hover:bg-krishi-primary-50 focus:ring-krishi-deepGreen bg-transparent",
      ghost:
        "text-krishi-textMain hover:bg-krishi-ivory-200 focus:ring-krishi-deepGreen bg-transparent",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
