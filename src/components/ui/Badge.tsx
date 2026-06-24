import type { HTMLAttributes } from "react";
import { cn } from "./cn";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "green" | "amber" | "sky" | "rose";
}

const tones = {
  neutral: "bg-stone-100 text-stone-700",
  green: "bg-emerald-100 text-emerald-800",
  amber: "bg-amber-100 text-amber-800",
  sky: "bg-sky-100 text-sky-800",
  rose: "bg-rose-100 text-rose-800",
};

export const Badge = ({ className, tone = "neutral", ...props }: BadgeProps) => (
  <span className={cn("inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold", tones[tone], className)} {...props} />
);
