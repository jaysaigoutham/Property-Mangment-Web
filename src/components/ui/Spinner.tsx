import { Loader2 } from "lucide-react";
import { cn } from "./cn";

export const Spinner = ({ className, label = "Loading" }: { className?: string; label?: string }) => (
  <div className={cn("flex items-center justify-center gap-2 text-sm text-stone-600", className)} role="status">
    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
    <span>{label}</span>
  </div>
);
