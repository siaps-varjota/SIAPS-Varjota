import { useState, useCallback } from "react";
import { useCsvData, CsvRow } from "@/hooks/useCsvData";
import { CSV_URLS } from "@/lib/csvUrls";
import { LoadingState } from "../LoadingState";
import { ErrorState } from "../ErrorState";
import { MetricCard } from "../MetricCard";
import { DataTable } from "../DataTable";
import { ProgressChart } from "../ProgressChart";
import { ColumnMetrics } from "../ColumnMetrics";
import { HeartPulse, Users, Stethoscope, FileCheck } from "lucide-react";

export function GestacaoTab() {
  const { data, loading, error } = useCsvData(CSV_URLS.gestacaoPuerperio);
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
  
  const consultaAte12Sem = activeRows.filter((r) => r["Consultas até 12 semanas (1)"] === "SIM").length;
  const seteConsultas = activeRows.filter((r) => r["Consultas de Pré-natal (7)"] === "SIM").length;
  const consultaOdonto = activeRows.filter((r) => r["Consultas odonto (1)"] === "SIM").length;
  const exames1Tri = activeRows.filter((r) => r["EXAMES 1º TRI (SIM)"] === "SIM").length;
  const visitaPuerperio = activeRows.filter((r) => r["Visita no puerpério (1)"] === "SIM").length;
  const visitaPN = activeRows.filter((r) => r["Visita no PN (3)"] === "SIM").length;
  const consultaPuerperio = activeRows.filter((r) => r["Consultas no puerpério (1)"] === "SIM").length;
  const vacinaDtpa = activeRows.filter((r) => r["dTpa"] && r["dTpa"] !== "" && r["dTpa"] !== "0").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Gestantes"
          value={total}
          icon={HeartPulse}
          variant="info"
        />
        <MetricCard
          title="Consulta ≤12 semanas"
          value={consultaAte12Sem}
          subtitle={total > 0 ? `${Math.round((consultaAte12Sem / total) * 100)}% do total` : "0%"}
          icon={Stethoscope}
          variant="success"
        />
        <MetricCard
          title="7+ Consultas Pré-Natal"
          value={seteConsultas}
          subtitle={total > 0 ? `${Math.round((seteConsultas / total) * 100)}% do total` : "0%"}
          icon={FileCheck}
          variant="default"
        />
        <MetricCard
          title="Visita Puerpério"
          value={visitaPuerperio}
          subtitle={total > 0 ? `${Math.round((visitaPuerperio / total) * 100)}% do total` : "0%"}
          icon={Users}
          variant="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border p-5 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Indicadores de Pré-Natal
          </h3>
          <div className="space-y-4">
            <ProgressChart
              label="Consulta até 12 semanas"
              value={consultaAte12Sem}
              total={total}
              color="primary"
            />
            <ProgressChart
              label="7+ Consultas de Pré-natal"
              value={seteConsultas}
              total={total}
              color="success"
            />
            <ProgressChart
              label="Consulta Odontológica"
              value={consultaOdonto}
              total={total}
              color="info"
            />
            <ProgressChart
              label="Exames 1º Trimestre"
              value={exames1Tri}
              total={total}
              color="warning"
            />
          </div>
        </div>

        <div className="bg-card rounded-xl border p-5 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Indicadores de Puerpério
          </h3>
          <div className="space-y-4">
            <ProgressChart
              label="3+ Visitas no Pré-natal"
              value={visitaPN}
              total={total}
              color="primary"
            />
            <ProgressChart
              label="Visita no Puerpério"
              value={visitaPuerperio}
              total={total}
              color="success"
            />
            <ProgressChart
              label="Consulta Puerpério"
              value={consultaPuerperio}
              total={total}
              color="info"
            />
            <ProgressChart
              label="Vacina dTpa"
              value={vacinaDtpa}
              total={total}
              color="warning"
            />
          </div>
        </div>
      </div>

      <ColumnMetrics 
        rows={activeRows} 
        headers={data.headers} 
        columnStart={1} 
        columnEnd={18} 
      />

      <div className="bg-card rounded-xl border p-5 shadow-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Registro de Gestantes
        </h3>
        <DataTable 
          headers={data.headers} 
          rows={data.rows}
          columnStart={1}
          columnEnd={18}
          onFilteredRowsChange={handleFilteredRowsChange}
          title="Gestação e Puerpério"
        />
      </div>
    </div>
  );
}