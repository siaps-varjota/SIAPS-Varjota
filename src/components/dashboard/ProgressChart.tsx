import { cn } from "@/lib/utils";

interface ProgressChartProps {
  label: string;
  value: number;
  total: number;
  color?: "primary" | "success" | "warning" | "destructive" | "info";
}

const colorStyles = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  info: "bg-info",
};

export function ProgressChart({
  label,
  value,
  total,
  color = "primary",
}: ProgressChartProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground truncate max-w-[60%]">
          {label}
        </span>
        <span className="text-muted-foreground tabular-nums">
          {value.toLocaleString("pt-BR")} / {total.toLocaleString("pt-BR")} ({percentage}%)
        </span>
      </div>
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            colorStyles[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
