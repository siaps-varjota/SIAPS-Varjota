import { Activity } from "lucide-react";

export function Header() {
  return (
    <header className="gradient-header text-primary-foreground">
      <div className="container py-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Indicadores de Saúde
            </h1>
            <p className="text-primary-foreground/80 text-sm md:text-base font-medium">
              Município de Varjota — Monitoramento em Tempo Real
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
