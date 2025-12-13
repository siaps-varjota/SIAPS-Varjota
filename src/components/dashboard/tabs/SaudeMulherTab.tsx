import { useState, useCallback } from "react";
import { useCsvData, CsvRow } from "@/hooks/useCsvData";
import { CSV_URLS } from "@/lib/csvUrls";
import { LoadingState } from "../LoadingState";
import { ErrorState } from "../ErrorState";
import { MetricCard } from "../MetricCard";
import { DataTable } from "../DataTable";
import { ProgressChart } from "../ProgressChart";
import { ColumnMetrics } from "../ColumnMetrics";
import { Users, FileCheck, CheckCircle2, AlertTriangle } from "lucide-react";

export function SaudeMulherTab() {
  const { data, loading, error } = useCsvData(CSV_URLS.saudeMulher);
  const [filteredRows, setFilteredRows] = useState<CsvRow[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);

  const handleFilteredRowsChange = useCallback((rows: CsvRow[], equipeFilter: string) => {
    setFilteredRows(rows);
    setIsFiltered(equipeFilter !== "all");
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!data) return null;

  const activeRows = isFiltered ? filteredRows : data.rows;
  const total = activeRows.length;
  
  const comColo = activeRows.filter(
    (r) =>
      r["DATA DA ÚLTIMA SOLIC/AVALIAÇÃO DO EXAME DE COLO DE ÚTERO"] &&
      r["DATA DA ÚLTIMA SOLIC/AVALIAÇÃO DO EXAME DE COLO DE ÚTERO"] !== "" &&
      r["DATA DA ÚLTIMA SOLIC/AVALIAÇÃO DO EXAME DE COLO DE ÚTERO"] !== "NÃO SE APLICA"
  ).length;
  const comMamografia = activeRows.filter(
    (r) =>
      r["DATA DA MAMOGRAFIA"] &&
      r["DATA DA MAMOGRAFIA"] !== "" &&
      r["DATA DA MAMOGRAFIA"] !== "NÃO SE APLICA"
  ).length;
  const comConsultaReprod = activeRows.filter(
    (r) =>
      r["DATA DA CONSULTA EM SAÚDE REPRODUTVA"] &&
      r["DATA DA CONSULTA EM SAÚDE REPRODUTVA"] !== ""
  ).length;
  const realizadas = activeRows.filter((r) => r["STATUS DAS BOAS PRÁTICAS"]?.includes("REALIZADAS")).length;
  const faltando = activeRows.filter((r) => r["STATUS DAS BOAS PRÁTICAS"]?.includes("FALTANDO")).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Mulheres"
          value={total}
          icon={Users}
          variant="info"
        />
        <MetricCard
          title="Exame de Colo"
          value={comColo}
          subtitle={total > 0 ? `${Math.round((comColo / total) * 100)}% do total` : "0%"}
          icon={FileCheck}
          variant="success"
        />
        <MetricCard
          title="Boas Práticas Realizadas"
          value={realizadas}
          subtitle={total > 0 ? `${Math.round((realizadas / total) * 100)}% do total` : "0%"}
          icon={CheckCircle2}
          variant="success"
        />
        <MetricCard
          title="Pendências"
          value={faltando}
          subtitle={total > 0 ? `${Math.round((faltando / total) * 100)}% do total` : "0%"}
          icon={AlertTriangle}
          variant="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl border p-5 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Indicadores de Saúde da Mulher
          </h3>
          <div className="space-y-4">
            <ProgressChart
              label="Exame de Colo de Útero"
              value={comColo}
              total={total}
              color="primary"
            />
            <ProgressChart
              label="Mamografia"
              value={comMamografia}
              total={total}
              color="info"
            />
            <ProgressChart
              label="Consulta Saúde Reprodutiva"
              value={comConsultaReprod}
              total={total}
              color="success"
            />
          </div>
        </div>

        <div className="bg-card rounded-xl border p-5 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Status das Boas Práticas
          </h3>
          <div className="space-y-3">
            {[
              { label: "Realizadas", count: realizadas, color: "bg-success" },
              { label: "Faltando", count: faltando, color: "bg-warning" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="font-medium text-foreground">{item.label}</span>
                </div>
                <span className="font-bold text-foreground tabular-nums">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ColumnMetrics 
        rows={activeRows} 
        headers={data.headers} 
        columnStart={1} 
        columnEnd={11} 
      />

      <div className="bg-card rounded-xl border p-5 shadow-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Registro de Saúde da Mulher
        </h3>
        <DataTable 
          headers={data.headers} 
          rows={data.rows}
          columnStart={1}
          columnEnd={11}
          onFilteredRowsChange={handleFilteredRowsChange}
          title="Saúde da Mulher"
        />
      </div>
    </div>
  );
}