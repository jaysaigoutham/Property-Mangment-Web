import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "./cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, id, label, error, ...props }, ref) => {
  const inputId = id ?? props.name;

  return (
    <label className="grid gap-1.5 text-sm font-medium text-stone-800" htmlFor={inputId}>
      {label ? <span>{label}</span> : null}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "h-10 rounded-md border border-stone-300 bg-white px-3 text-sm text-stone-950 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100",
          error && "border-rose-400 focus:border-rose-600 focus:ring-rose-100",
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs font-medium text-rose-700">{error}</span> : null}
    </label>
  );
});

Input.displayName = "Input";
