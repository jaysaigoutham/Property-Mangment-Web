import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "./cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, id, label, error, ...props }, ref) => {
    const textareaId = id ?? props.name;

    return (
      <label className="grid gap-1.5 text-sm font-medium text-stone-800" htmlFor={textareaId}>
        {label ? <span>{label}</span> : null}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "min-h-32 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100",
            error && "border-rose-400 focus:border-rose-600 focus:ring-rose-100",
            className,
          )}
          {...props}
        />
        {error ? <span className="text-xs font-medium text-rose-700">{error}</span> : null}
      </label>
    );
  },
);

Textarea.displayName = "Textarea";
