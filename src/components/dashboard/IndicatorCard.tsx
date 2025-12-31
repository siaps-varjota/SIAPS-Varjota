import { cn } from "@/lib/utils";
import { TrendingUp, Minus } from "lucide-react";

interface IndicatorCardProps {
  title: string;
  value: number;
  total: number;
  className?: string;
}

function getStatus(percentage: number): { label: string; color: string; bgColor: string } {
  if (percentage >= 80) {
    return { label: "Ótimo", color: "text-blue-600", bgColor: "bg-blue-500" };
  } else if (percentage >= 60) {
    return { label: "Bom", color: "text-green-600", bgColor: "bg-green-500" };
  } else if (percentage >= 40) {
    return { label: "Suficiente", color: "text-yellow-600", bgColor: "bg-yellow-500" };
  } else if (percentage >= 20) {
    return { label: "Regular", color: "text-orange-500", bgColor: "bg-orange-500" };
  } else {
    return { label: "Crítico", color: "text-red-600", bgColor: "bg-red-500" };
  }
}

export function IndicatorCard({ title, value, total, className }: IndicatorCardProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  const status = getStatus(percentage);
  const showTrend = percentage >= 60;

  return (
    <div className={cn("bg-card rounded-xl border p-5 shadow-card", className)}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {showTrend ? (
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <Minus className="w-4 h-4 text-muted-foreground" />
        )}
      </div>

      <div className="mb-3">
        <span className="text-4xl font-bold text-primary">{value}</span>
        <span className="text-lg text-muted-foreground ml-1">/ {total}</span>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className={cn("text-sm font-medium", status.color)}>{status.label}</span>
        <span className="text-sm text-muted-foreground">{percentage}%</span>
      </div>

      <div className="w-full bg-muted rounded-full h-1.5">
        <div
          className={cn("h-1.5 rounded-full transition-all duration-500", status.bgColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
