import { useState, useCallback } from "react";
import { useCsvData, CsvRow } from "@/hooks/useCsvData";
import { CSV_URLS } from "@/lib/csvUrls";
import { LoadingState } from "../LoadingState";
import { ErrorState } from "../ErrorState";
import { DataTable } from "../DataTable";
import { IndicatorCard } from "../IndicatorCard";

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
  const exames3Tri = activeRows.filter((r) => r["Exames 3º TRI"] === "SIM").length;
  const visitaPuerperio = activeRows.filter((r) => r["Visita no puerpério (1)"] === "SIM").length;
  const visitaPN = activeRows.filter((r) => r["Visita no PN (3)"] === "SIM").length;
  const consultaPuerperio = activeRows.filter((r) => r["Consultas no puerpério (1)"] === "SIM").length;
  const vacinaDtpa = activeRows.filter((r) => r["dTpa"] && r["dTpa"] !== "" && r["dTpa"] !== "0").length;
  const pesoAltura = activeRows.filter((r) => r["Peso + Altura (7)"] === "SIM").length;
  const afericoesPA = activeRows.filter((r) => r["Aferições de PA (7)"] === "SIM").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <IndicatorCard
          title="Consultas 1º Trimestre (1+)"
          value={consultaAte12Sem}
          total={total}
        />
        <IndicatorCard
          title="Pré-natal (7+)"
          value={seteConsultas}
          total={total}
        />
        <IndicatorCard
          title="Consultas odonto (1+)"
          value={consultaOdonto}
          total={total}
        />
        <IndicatorCard
          title="Aferições de PA (7+)"
          value={afericoesPA}
          total={total}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <IndicatorCard
          title="Peso + Altura (7+)"
          value={pesoAltura}
          total={total}
        />
        <IndicatorCard
          title="Exames 1º TRI (SIM)"
          value={exames1Tri}
          total={total}
        />
        <IndicatorCard
          title="Exames 3º TRI (SIM)"
          value={exames3Tri}
          total={total}
        />
        <IndicatorCard
          title="Visita no PN (3+)"
          value={visitaPN}
          total={total}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <IndicatorCard
          title="Visita no puerpério (1+)"
          value={visitaPuerperio}
          total={total}
        />
        <IndicatorCard
          title="Consultas no puerpério (1+)"
          value={consultaPuerperio}
          total={total}
        />
        <IndicatorCard
          title="dTpa"
          value={vacinaDtpa}
          total={total}
        />
      </div>

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
