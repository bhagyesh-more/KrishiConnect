import React, { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "ivory" | "highlight" | "bordered";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variantStyles = {
      default:
        "bg-white border border-krishi-border shadow-subtle hover:shadow-card transition-shadow",
      ivory:
        "bg-krishi-warmIvory border border-krishi-border/80 shadow-subtle",
      highlight:
        "bg-krishi-leaf-50 border-2 border-krishi-leafGreen/50 shadow-subtle",
      bordered:
        "bg-white border-2 border-krishi-deepGreen/20 shadow-none",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl p-4 sm:p-5 text-krishi-textMain",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn("mb-3 flex items-center justify-between gap-2", className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3
    className={cn("text-lg font-bold text-krishi-deepGreen leading-tight", className)}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p className={cn("text-xs sm:text-sm text-krishi-textMuted", className)} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => <div className={cn("space-y-2", className)} {...props}>{children}</div>;
