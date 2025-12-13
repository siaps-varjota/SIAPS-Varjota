import { useState, useCallback } from "react";
import { useCsvData, CsvRow } from "@/hooks/useCsvData";
import { CSV_URLS } from "@/lib/csvUrls";
import { LoadingState } from "../LoadingState";
import { ErrorState } from "../ErrorState";
import { MetricCard } from "../MetricCard";
import { DataTable } from "../DataTable";
import { ProgressChart } from "../ProgressChart";
import { ColumnMetrics } from "../ColumnMetrics";
import { Droplet, Users, Stethoscope, CheckCircle2 } from "lucide-react";

export function DiabetesTab() {
  const { data, loading, error } = useCsvData(CSV_URLS.diabetes);
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
  
  const comConsulta = activeRows.filter((r) => r["DATA DA CONSULTA ATUAL"] && r["DATA DA CONSULTA ATUAL"] !== "").length;
  const comHbGlicada = activeRows.filter((r) => r["HB GLICADA"] && r["HB GLICADA"] !== "").length;
  const comAvalPes = activeRows.filter((r) => r["DATA DA AVALIAÇÃO DOS PÉS ATUAL"] && r["DATA DA AVALIAÇÃO DOS PÉS ATUAL"] !== "").length;
  const comPA = activeRows.filter((r) => r["DATA PA ATUAL"] && r["DATA PA ATUAL"] !== "").length;
  const provavel = activeRows.filter((r) => r["TODAS AS BOAS PRÁTICAS"]?.includes("PROVÁVEL")).length;
  const naoProvavel = activeRows.filter((r) => r["TODAS AS BOAS PRÁTICAS"]?.includes("NÃO PROVÁVEL")).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Pacientes"
          value={total}
          icon={Users}
          variant="info"
        />
        <MetricCard
          title="Com Consulta Atualizada"
          value={comConsulta}
          subtitle={total > 0 ? `${Math.round((comConsulta / total) * 100)}% do total` : "0%"}
          icon={Stethoscope}
          variant="success"
        />
        <MetricCard
          title="Hemoglobina Glicada"
          value={comHbGlicada}
          subtitle={total > 0 ? `${Math.round((comHbGlicada / total) * 100)}% do total` : "0%"}
          icon={Droplet}
          variant="default"
        />
        <MetricCard
          title="Boas Práticas Prováveis"
          value={provavel}
          subtitle={total > 0 ? `${Math.round((provavel / total) * 100)}% do total` : "0%"}
          icon={CheckCircle2}
          variant="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl border p-5 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Indicadores de Acompanhamento
          </h3>
          <div className="space-y-4">
            <ProgressChart
              label="Consulta Atualizada"
              value={comConsulta}
              total={total}
              color="primary"
            />
            <ProgressChart
              label="PA Aferida"
              value={comPA}
              total={total}
              color="info"
            />
            <ProgressChart
              label="Hemoglobina Glicada"
              value={comHbGlicada}
              total={total}
              color="success"
            />
            <ProgressChart
              label="Avaliação dos Pés"
              value={comAvalPes}
              total={total}
              color="warning"
            />
          </div>
        </div>

        <div className="bg-card rounded-xl border p-5 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Status das Boas Práticas
          </h3>
          <div className="space-y-3">
            {[
              { label: "Provável", count: provavel, color: "bg-success" },
              { label: "Não Provável", count: naoProvavel, color: "bg-destructive" },
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
        columnEnd={13} 
      />

      <div className="bg-card rounded-xl border p-5 shadow-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Registro de Pacientes Diabéticos
        </h3>
        <DataTable 
          headers={data.headers} 
          rows={data.rows}
          columnStart={1}
          columnEnd={13}
          onFilteredRowsChange={handleFilteredRowsChange}
          title="Diabetes"
        />
      </div>
    </div>
  );
}