import { SearchX } from "lucide-react";
import { cn } from "./ui/cn";

interface EmptyStateProps {
  title: string;
  message: string;
  className?: string;
}

export const EmptyState = ({ title, message, className }: EmptyStateProps) => (
  <div className={cn("flex min-h-56 flex-col items-center justify-center rounded-md border border-dashed border-stone-300 bg-white p-8 text-center", className)}>
    <SearchX className="mb-3 h-8 w-8 text-stone-400" aria-hidden="true" />
    <h2 className="text-base font-semibold text-stone-950">{title}</h2>
    <p className="mt-1 max-w-md text-sm text-stone-600">{message}</p>
  </div>
);
