import { useState, useCallback } from "react";
import { useCsvData, CsvRow } from "@/hooks/useCsvData";
import { CSV_URLS } from "@/lib/csvUrls";
import { LoadingState } from "../LoadingState";
import { ErrorState } from "../ErrorState";
import { MetricCard } from "../MetricCard";
import { DataTable } from "../DataTable";
import { ProgressChart } from "../ProgressChart";
import { Users, Stethoscope, Syringe, CheckCircle2 } from "lucide-react";

export function PessoaIdosaTab() {
  const { data, loading, error } = useCsvData(CSV_URLS.pessoaIdosa);
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
  
  const comConsulta = activeRows.filter((r) => r["ÚLTIMA CONSULTA"] && r["ÚLTIMA CONSULTA"] !== "").length;
  const comPesoAltura = activeRows.filter((r) => r["TOTAL DE PESO/ALTURA (2)"] === "SIM").length;
  const comInfluenza = activeRows.filter((r) => r["INFLUENZA"] && r["INFLUENZA"] !== "").length;
  const realizadas = activeRows.filter((r) => r["STATUS DAS BOAS PRÁTICAS"]?.includes("REALIZADAS")).length;
  const faltando = activeRows.filter((r) => r["STATUS DAS BOAS PRÁTICAS"]?.includes("FALTANDO")).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Idosos"
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
          title="Vacina Influenza"
          value={comInfluenza}
          subtitle={total > 0 ? `${Math.round((comInfluenza / total) * 100)}% do total` : "0%"}
          icon={Syringe}
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
            Indicadores de Saúde do Idoso
          </h3>
          <div className="space-y-4">
            <ProgressChart
              label="Consulta Atualizada"
              value={comConsulta}
              total={total}
              color="primary"
            />
            <ProgressChart
              label="Peso/Altura (2 registros)"
              value={comPesoAltura}
              total={total}
              color="info"
            />
            <ProgressChart
              label="Vacina Influenza"
              value={comInfluenza}
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

      <div className="bg-card rounded-xl border p-5 shadow-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Registro de Pessoas Idosas
        </h3>
        <DataTable 
          headers={data.headers} 
          rows={data.rows}
          columnStart={1}
          columnEnd={11}
          onFilteredRowsChange={handleFilteredRowsChange}
          title="Pessoa Idosa"
        />
      </div>
    </div>
  );
}