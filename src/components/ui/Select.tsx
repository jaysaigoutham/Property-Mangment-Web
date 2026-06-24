import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "./cn";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ label: string; value: string | number }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, id, label, error, options, ...props }, ref) => {
    const selectId = id ?? props.name;

    return (
      <label className="grid gap-1.5 text-sm font-medium text-stone-800" htmlFor={selectId}>
        {label ? <span>{label}</span> : null}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "h-10 rounded-md border border-stone-300 bg-white px-3 text-sm text-stone-950 shadow-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100",
            error && "border-rose-400 focus:border-rose-600 focus:ring-rose-100",
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? <span className="text-xs font-medium text-rose-700">{error}</span> : null}
      </label>
    );
  },
);

Select.displayName = "Select";
