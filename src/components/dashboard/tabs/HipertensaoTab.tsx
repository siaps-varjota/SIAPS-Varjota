import { useState, useCallback } from "react";
import { useCsvData, CsvRow } from "@/hooks/useCsvData";
import { CSV_URLS } from "@/lib/csvUrls";
import { LoadingState } from "../LoadingState";
import { ErrorState } from "../ErrorState";
import { MetricCard } from "../MetricCard";
import { DataTable } from "../DataTable";
import { ProgressChart } from "../ProgressChart";
import { Activity, Users, Stethoscope, CheckCircle2 } from "lucide-react";

export function HipertensaoTab() {
  const { data, loading, error } = useCsvData(CSV_URLS.hipertensao);
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
  const comPA = activeRows.filter((r) => r["DATA PA ATUAL"] && r["DATA PA ATUAL"] !== "").length;
  const comPesoAltura = activeRows.filter((r) => r["DATA PESO/ALTURA ATUAL"] && r["DATA PESO/ALTURA ATUAL"] !== "").length;
  const realizadas = activeRows.filter((r) => r["TODAS AS BOAS PRÁTICAS"]?.toUpperCase().includes("REALIZADA")).length;
  const faltando = activeRows.filter((r) => r["TODAS AS BOAS PRÁTICAS"]?.toUpperCase().includes("FALTANDO")).length;

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
          title="Com PA Aferida"
          value={comPA}
          subtitle={total > 0 ? `${Math.round((comPA / total) * 100)}% do total` : "0%"}
          icon={Activity}
          variant="default"
        />
        <MetricCard
          title="Boas Práticas Realizadas"
          value={realizadas}
          subtitle={total > 0 ? `${Math.round((realizadas / total) * 100)}% do total` : "0%"}
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
              label="Pressão Arterial Aferida"
              value={comPA}
              total={total}
              color="success"
            />
            <ProgressChart
              label="Peso/Altura Registrado"
              value={comPesoAltura}
              total={total}
              color="info"
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
              { label: "Faltando", count: faltando, color: "bg-destructive" },
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

      <div className="bg-card rounded-xl border p-5 shadow-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Registro de Pacientes Hipertensos
        </h3>
        <DataTable 
          headers={data.headers} 
          rows={data.rows}
          columnStart={1}
          columnEnd={11}
          onFilteredRowsChange={handleFilteredRowsChange}
          title="Hipertensão"
        />
      </div>
    </div>
  );
}