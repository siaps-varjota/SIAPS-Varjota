import { useState } from "react";
import { TabKey } from "@/lib/csvUrls";
import { Header } from "./dashboard/Header";
import { TabNavigation } from "./dashboard/TabNavigation";
import { DesenvolvimentoInfantilTab } from "./dashboard/tabs/DesenvolvimentoInfantilTab";
import { VacinasTab } from "./dashboard/tabs/VacinasTab";
import { GestacaoTab } from "./dashboard/tabs/GestacaoTab";
import { HipertensaoTab } from "./dashboard/tabs/HipertensaoTab";
import { DiabetesTab } from "./dashboard/tabs/DiabetesTab";
import { SaudeMulherTab } from "./dashboard/tabs/SaudeMulherTab";
import { PessoaIdosaTab } from "./dashboard/tabs/PessoaIdosaTab";

const TAB_COMPONENTS: Record<TabKey, React.ComponentType> = {
  desenvolvimentoInfantil: DesenvolvimentoInfantilTab,
  desenvolvimentoInfantilVacinas: VacinasTab,
  gestacaoPuerperio: GestacaoTab,
  hipertensao: HipertensaoTab,
  diabetes: DiabetesTab,
  saudeMulher: SaudeMulherTab,
  pessoaIdosa: PessoaIdosaTab,
};

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("desenvolvimentoInfantil");

  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container py-6">
        <ActiveComponent />
      </main>
      <footer className="border-t bg-card">
        <div className="container py-4">
          <p className="text-center text-sm text-muted-foreground">
            Sistema de Indicadores de Saúde — Município de Varjota
          </p>
        </div>
      </footer>
    </div>
  );
}
