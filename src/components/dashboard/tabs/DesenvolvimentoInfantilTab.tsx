import { useState, useCallback } from "react";
import { useCsvData, CsvRow } from "@/hooks/useCsvData";
import { CSV_URLS } from "@/lib/csvUrls";
import { LoadingState } from "../LoadingState";
import { ErrorState } from "../ErrorState";
import { MetricCard } from "../MetricCard";
import { DataTable } from "../DataTable";
import { ProgressChart } from "../ProgressChart";
import { ColumnMetrics } from "../ColumnMetrics";
import { Baby, Users, CheckCircle2, Stethoscope } from "lucide-react";

export function DesenvolvimentoInfantilTab() {
  const { data, loading, error } = useCsvData(CSV_URLS.desenvolvimentoInfantil);
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
  
  const comPrimeiraConsulta = activeRows.filter(
    (r) => r["IDADE 1ª CONSULTA (<=30 DIAS)"] && r["IDADE 1ª CONSULTA (<=30 DIAS)"] !== ""
  ).length;
  const comPrimeiraVisita = activeRows.filter(
    (r) => r["1ª VISITA ACS (<=30 DIAS)"] && r["1ª VISITA ACS (<=30 DIAS)"] !== ""
  ).length;
  const comNoveConsultas = activeRows.filter(
    (r) => r["TOTAL DE CONSULTAS (9)"] === "SIM"
  ).length;
  const comNovePesoAltura = activeRows.filter(
    (r) => r["TOTAL DE PESO & ALTURA (9)"] === "SIM"
  ).length;
  const realizadas = activeRows.filter(
    (r) => r["STATUS DAS BOAS PRÁTICAS"]?.includes("REALIZADAS")
  ).length;
  const faltando = activeRows.filter(
    (r) => r["STATUS DAS BOAS PRÁTICAS"]?.includes("FALTANDO")
  ).length;
  const prioridade = activeRows.filter(
    (r) => r["STATUS DAS BOAS PRÁTICAS"]?.includes("PRIORIDADE")
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Crianças"
          value={total}
          icon={Baby}
          variant="info"
        />
        <MetricCard
          title="1ª Consulta ≤30 dias"
          value={comPrimeiraConsulta}
          subtitle={total > 0 ? `${Math.round((comPrimeiraConsulta / total) * 100)}% do total` : "0%"}
          icon={Stethoscope}
          variant="success"
        />
        <MetricCard
          title="9+ Consultas"
          value={comNoveConsultas}
          subtitle={total > 0 ? `${Math.round((comNoveConsultas / total) * 100)}% do total` : "0%"}
          icon={CheckCircle2}
          variant="default"
        />
        <MetricCard
          title="Boas Práticas Realizadas"
          value={realizadas}
          subtitle={total > 0 ? `${Math.round((realizadas / total) * 100)}% do total` : "0%"}
          icon={Users}
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
              label="1ª Consulta (≤30 dias)"
              value={comPrimeiraConsulta}
              total={total}
              color="primary"
            />
            <ProgressChart
              label="1ª Visita ACS (≤30 dias)"
              value={comPrimeiraVisita}
              total={total}
              color="info"
            />
            <ProgressChart
              label="9+ Consultas"
              value={comNoveConsultas}
              total={total}
              color="success"
            />
            <ProgressChart
              label="9+ Peso & Altura"
              value={comNovePesoAltura}
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
              { label: "Realizadas", count: realizadas, color: "bg-success" },
              { label: "Faltando", count: faltando, color: "bg-warning" },
              { label: "Prioridade", count: prioridade, color: "bg-destructive" },
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
        columnEnd={14} 
      />

      <div className="bg-card rounded-xl border p-5 shadow-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Registro de Crianças
        </h3>
        <DataTable 
          headers={data.headers} 
          rows={data.rows} 
          columnStart={1}
          columnEnd={14}
          onFilteredRowsChange={handleFilteredRowsChange}
          title="Desenvolvimento Infantil - Boas Práticas"
        />
      </div>
    </div>
  );
}