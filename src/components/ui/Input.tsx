import React, { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-krishi-textMain"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-krishi-textMuted">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            className={cn(
              "w-full min-h-[48px] rounded-xl border bg-white px-4 py-2.5 text-base text-krishi-textMain placeholder:text-krishi-textMuted/60 transition-colors focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen focus:border-krishi-deepGreen disabled:bg-krishi-ivory-100 disabled:opacity-60",
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-krishi-border hover:border-krishi-primary-300",
              leftIcon && "pl-11",
              rightIcon && "pr-11",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-krishi-textMuted">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs font-medium text-red-600 mt-1" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-xs text-krishi-textMuted mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
