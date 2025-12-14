import { CsvRow } from "@/hooks/useCsvData";
import { useMemo } from "react";

interface ColumnMetricsProps {
  rows: CsvRow[];
  headers: string[];
  columnStart: number;
  columnEnd: number;
}

interface ColumnMetric {
  header: string;
  simCount: number;
  naoCount: number;
  filledCount: number;
  total: number;
}

// Check if value is considered "positive"
function isPositiveValue(value: string): boolean {
  const upper = value?.toUpperCase().trim();
  return upper === "SIM" || upper === "REALIZADAS" || upper === "PROVÁVEL";
}

// Check if value is considered "negative"
function isNegativeValue(value: string): boolean {
  const upper = value?.toUpperCase().trim();
  return upper === "NÃO" || upper === "FALTANDO" || upper === "ATRASADAS" || upper === "NÃO PROVÁVEL" || upper === "PRIORIDADE";
}

// Check if value is filled (non-empty)
function isFilled(value: string): boolean {
  return value !== undefined && value !== null && value.trim() !== "" && value.trim() !== "—";
}

// Determine column display type
function getColumnType(header: string): "boolean" | "date" | "text" {
  const upper = header.toUpperCase();
  if (upper.includes("DATA") || upper.includes("ÚLTIMA") || upper.includes("ULTIMO")) {
    return "date";
  }
  if (upper.includes("SIM") || upper.includes("TOTAL DE") || upper.includes("(1)") || upper.includes("(2)") || upper.includes("(3)") || upper.includes("(7)") || upper.includes("(9)")) {
    return "boolean";
  }
  return "text";
}

// Columns to skip from metrics
function shouldSkipColumn(header: string): boolean {
  const upper = header.toUpperCase();
  return upper.includes("EQUIPE") || 
         upper.includes("MICROÁREA") || 
         upper.includes("MICROAREA") ||
         upper.includes("NOME") ||
         upper.includes("CPF") ||
         upper.includes("CNS") ||
         upper.includes("NASCIMENTO") ||
         upper.includes("IDADE") ||
         upper === "Nº";
}

export function ColumnMetrics({ rows, headers, columnStart, columnEnd }: ColumnMetricsProps) {
  const metrics = useMemo(() => {
    const cleanHeaders = headers.filter((h) => h && !h.includes("SEERRO") && !h.includes("ARRAYFORMULA"));
    const visibleHeaders = cleanHeaders.slice(columnStart, columnEnd + 1);
    
    const result: ColumnMetric[] = [];
    
    for (const header of visibleHeaders) {
      if (shouldSkipColumn(header)) continue;
      
      const columnType = getColumnType(header);
      let simCount = 0;
      let naoCount = 0;
      let filledCount = 0;
      
      for (const row of rows) {
        const value = row[header];
        
        if (columnType === "boolean") {
          if (isPositiveValue(value)) simCount++;
          else if (isNegativeValue(value)) naoCount++;
        } else if (columnType === "date") {
          if (isFilled(value) && value !== "NÃO SE APLICA") filledCount++;
        } else {
          if (isFilled(value)) filledCount++;
        }
      }
      
      // Only include columns with meaningful data
      if (simCount > 0 || naoCount > 0 || filledCount > 0) {
        result.push({
          header,
          simCount,
          naoCount,
          filledCount,
          total: rows.length,
        });
      }
    }
    
    return result;
  }, [rows, headers, columnStart, columnEnd]);

  if (metrics.length === 0) return null;

  // Define colors for alternating progress bars
  const colors = ["bg-primary", "bg-amber-500", "bg-success", "bg-info", "bg-orange-500", "bg-cyan-500"];

  return (
    <div className="bg-card rounded-xl border p-5 shadow-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Indicadores de Acompanhamento
      </h3>
      <div className="space-y-4">
        {metrics.map((metric, idx) => {
          const positiveCount = metric.simCount > 0 ? metric.simCount : metric.filledCount;
          const positivePercent = metric.total > 0 ? Math.round((positiveCount / metric.total) * 100) : 0;
          const colorClass = colors[idx % colors.length];
          
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground truncate max-w-[70%]" title={metric.header}>
                  {metric.header}
                </span>
                <span className="text-muted-foreground font-medium tabular-nums">
                  {positiveCount} / {metric.total} ({positivePercent}%)
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${colorClass} rounded-full transition-all duration-500`}
                  style={{ width: `${positivePercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}