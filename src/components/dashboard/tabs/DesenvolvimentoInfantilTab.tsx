import { useCsvData } from "@/hooks/useCsvData";
import { CSV_URLS } from "@/lib/csvUrls";
import { LoadingState } from "../LoadingState";
import { ErrorState } from "../ErrorState";
import { MetricCard } from "../MetricCard";
import { DataTable } from "../DataTable";
import { ProgressChart } from "../ProgressChart";
import { Baby, Users, CheckCircle2, Clock, Stethoscope, Scale } from "lucide-react";

export function DesenvolvimentoInfantilTab() {
  const { data, loading, error } = useCsvData(CSV_URLS.desenvolvimentoInfantil);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!data) return null;

  // Calculate metrics from data
  const total = data.rows.length;
  const comPrimeiraConsulta = data.rows.filter(
    (r) => r["IDADE 1ª CONSULTA (<=30 DIAS)"] && r["IDADE 1ª CONSULTA (<=30 DIAS)"] !== ""
  ).length;
  const comPrimeiraVisita = data.rows.filter(
    (r) => r["1ª VISITA ACS (<=30 DIAS)"] && r["1ª VISITA ACS (<=30 DIAS)"] !== ""
  ).length;
  const comNoveConsultas = data.rows.filter(
    (r) => r["TOTAL DE CONSULTAS (9)"] === "SIM"
  ).length;
  const comNovePesoAltura = data.rows.filter(
    (r) => r["TOTAL DE PESO & ALTURA (9)"] === "SIM"
  ).length;
  const realizadas = data.rows.filter(
    (r) => r["STATUS DAS BOAS PRÁTICAS"]?.includes("REALIZADAS")
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
          subtitle={`${Math.round((comPrimeiraConsulta / total) * 100)}% do total`}
          icon={Stethoscope}
          variant="success"
        />
        <MetricCard
          title="9+ Consultas"
          value={comNoveConsultas}
          subtitle={`${Math.round((comNoveConsultas / total) * 100)}% do total`}
          icon={CheckCircle2}
          variant="default"
        />
        <MetricCard
          title="Boas Práticas Realizadas"
          value={realizadas}
          subtitle={`${Math.round((realizadas / total) * 100)}% do total`}
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
              {
                label: "Faltando",
                count: data.rows.filter((r) =>
                  r["STATUS DAS BOAS PRÁTICAS"]?.includes("FALTANDO")
                ).length,
                color: "bg-warning",
              },
              {
                label: "Prioridade",
                count: data.rows.filter((r) =>
                  r["STATUS DAS BOAS PRÁTICAS"]?.includes("PRIORIDADE")
                ).length,
                color: "bg-destructive",
              },
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
          Registro de Crianças
        </h3>
        <DataTable headers={data.headers} rows={data.rows} />
      </div>
    </div>
  );
}
