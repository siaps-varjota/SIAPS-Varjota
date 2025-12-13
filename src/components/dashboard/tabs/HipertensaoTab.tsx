import { useCsvData } from "@/hooks/useCsvData";
import { CSV_URLS } from "@/lib/csvUrls";
import { LoadingState } from "../LoadingState";
import { ErrorState } from "../ErrorState";
import { MetricCard } from "../MetricCard";
import { DataTable } from "../DataTable";
import { ProgressChart } from "../ProgressChart";
import { Activity, Users, Stethoscope, Scale, CheckCircle2 } from "lucide-react";

export function HipertensaoTab() {
  const { data, loading, error } = useCsvData(CSV_URLS.hipertensao);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!data) return null;

  const total = data.rows.length;
  const comConsulta = data.rows.filter((r) => r["DATA DA CONSULTA ATUAL"] && r["DATA DA CONSULTA ATUAL"] !== "").length;
  const comPA = data.rows.filter((r) => r["DATA PA ATUAL"] && r["DATA PA ATUAL"] !== "").length;
  const comPesoAltura = data.rows.filter((r) => r["DATA PESO/ALTURA ATUAL"] && r["DATA PESO/ALTURA ATUAL"] !== "").length;
  const provavel = data.rows.filter((r) => r["TODAS AS BOAS PRÁTICAS"]?.includes("PROVÁVEL")).length;

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
          subtitle={`${Math.round((comConsulta / total) * 100)}% do total`}
          icon={Stethoscope}
          variant="success"
        />
        <MetricCard
          title="Com PA Aferida"
          value={comPA}
          subtitle={`${Math.round((comPA / total) * 100)}% do total`}
          icon={Activity}
          variant="default"
        />
        <MetricCard
          title="Boas Práticas Prováveis"
          value={provavel}
          subtitle={`${Math.round((provavel / total) * 100)}% do total`}
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
              { label: "Provável", count: provavel, color: "bg-success" },
              {
                label: "Não Provável",
                count: data.rows.filter((r) =>
                  r["TODAS AS BOAS PRÁTICAS"]?.includes("NÃO PROVÁVEL")
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
          Registro de Pacientes Hipertensos
        </h3>
        <DataTable headers={data.headers} rows={data.rows} />
      </div>
    </div>
  );
}
