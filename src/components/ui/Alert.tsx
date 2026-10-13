import React, { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error" | "offline";
  icon?: ReactNode;
  title?: string;
}

export const Alert: React.FC<AlertProps> = ({
  className,
  variant = "info",
  icon,
  title,
  children,
  ...props
}) => {
  const variantStyles = {
    info: "bg-krishi-primary-50 border-krishi-deepGreen/30 text-krishi-primary-900",
    success: "bg-emerald-50 border-emerald-300 text-emerald-950",
    warning: "bg-amber-50 border-amber-300 text-amber-950",
    error: "bg-red-50 border-red-300 text-red-950",
    offline: "bg-krishi-accent-50 border-krishi-earthBrown/40 text-krishi-accent-800",
  };

  return (
    <div
      role="alert"
      className={cn(
        "rounded-2xl border p-4 flex items-start gap-3 text-sm leading-relaxed",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {icon && <div className="flex-shrink-0 mt-0.5">{icon}</div>}
      <div className="space-y-0.5 flex-1">
        {title && <h5 className="font-bold text-sm tracking-tight">{title}</h5>}
        <div className="text-xs sm:text-sm opacity-90">{children}</div>
      </div>
    </div>
  );
};
