import { useState, useCallback } from "react";
import { useCsvData, CsvRow } from "@/hooks/useCsvData";
import { CSV_URLS } from "@/lib/csvUrls";
import { LoadingState } from "../LoadingState";
import { ErrorState } from "../ErrorState";
import { MetricCard } from "../MetricCard";
import { DataTable } from "../DataTable";
import { ProgressChart } from "../ProgressChart";
import { Syringe, CheckCircle2, AlertTriangle, Users } from "lucide-react";

export function VacinasTab() {
  const { data, loading, error } = useCsvData(CSV_URLS.desenvolvimentoInfantilVacinas);
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
  
  const comPenta = activeRows.filter((r) => r["3ª PENTA"] && r["3ª PENTA"] !== "").length;
  const comPolio = activeRows.filter((r) => r["3ª PÓLIO"] && r["3ª PÓLIO"] !== "").length;
  const comPneumo = activeRows.filter((r) => r["2ª PNEUMO10"] && r["2ª PNEUMO10"] !== "").length;
  const comTriplice = activeRows.filter((r) => r["2ª TRÍPLICE VIRAL"] && r["2ª TRÍPLICE VIRAL"] !== "").length;
  const realizadas = activeRows.filter((r) => r["STATUS DAS VACINAS"]?.includes("REALIZADAS")).length;
  const atrasadas = activeRows.filter((r) => r["STATUS DAS VACINAS"]?.includes("ATRASADAS")).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Crianças"
          value={total}
          icon={Users}
          variant="info"
        />
        <MetricCard
          title="Vacinas Completas"
          value={realizadas}
          subtitle={total > 0 ? `${Math.round((realizadas / total) * 100)}% do total` : "0%"}
          icon={CheckCircle2}
          variant="success"
        />
        <MetricCard
          title="Vacinas Atrasadas"
          value={atrasadas}
          subtitle={total > 0 ? `${Math.round((atrasadas / total) * 100)}% do total` : "0%"}
          icon={AlertTriangle}
          variant="destructive"
        />
        <MetricCard
          title="3ª Dose Penta"
          value={comPenta}
          subtitle={total > 0 ? `${Math.round((comPenta / total) * 100)}% do total` : "0%"}
          icon={Syringe}
          variant="default"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl border p-5 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Cobertura Vacinal
          </h3>
          <div className="space-y-4">
            <ProgressChart
              label="3ª Dose Pentavalente (DTP/HEPB/HIB)"
              value={comPenta}
              total={total}
              color="primary"
            />
            <ProgressChart
              label="3ª Dose Pólio Injetável"
              value={comPolio}
              total={total}
              color="info"
            />
            <ProgressChart
              label="2ª Dose Pneumo 10"
              value={comPneumo}
              total={total}
              color="success"
            />
            <ProgressChart
              label="2ª Dose Tríplice Viral"
              value={comTriplice}
              total={total}
              color="warning"
            />
          </div>
        </div>

        <div className="bg-card rounded-xl border p-5 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Status Vacinal
          </h3>
          <div className="space-y-3">
            {[
              { label: "Realizadas", count: realizadas, color: "bg-success" },
              { label: "Atrasadas", count: atrasadas, color: "bg-destructive" },
              { label: "Em andamento", count: Math.max(0, total - realizadas - atrasadas), color: "bg-warning" },
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
          Registro de Vacinação
        </h3>
        <DataTable 
          headers={data.headers} 
          rows={data.rows} 
          columnStart={1}
          columnEnd={12}
          onFilteredRowsChange={handleFilteredRowsChange}
          title="Desenvolvimento Infantil - Vacinas"
        />
      </div>
    </div>
  );
}