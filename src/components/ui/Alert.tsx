import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "./cn";

interface AlertProps {
  title?: string;
  message: string;
  tone?: "error" | "success" | "info";
  className?: string;
}

const tones = {
  error: "border-rose-200 bg-rose-50 text-rose-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  info: "border-sky-200 bg-sky-50 text-sky-900",
};

export const Alert = ({ title, message, tone = "info", className }: AlertProps) => {
  const Icon = tone === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div className={cn("flex gap-3 rounded-md border p-4 text-sm", tones[tone], className)} role={tone === "error" ? "alert" : "status"}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div>
        {title ? <p className="font-semibold">{title}</p> : null}
        <p>{message}</p>
      </div>
    </div>
  );
};
