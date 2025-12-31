import { cn } from "@/lib/utils";
import { TabKey, TAB_LABELS } from "@/lib/csvUrls";
import {
  Baby,
  Syringe,
  Activity,
  Droplet,
  UserRound,
  Users,
  PersonStanding,
} from "lucide-react";

const TAB_ICON_COMPONENTS: Record<TabKey, React.ComponentType<{ className?: string }>> = {
  desenvolvimentoInfantil: Baby,
  desenvolvimentoInfantilVacinas: Syringe,
  gestacaoPuerperio: PersonStanding,
  hipertensao: Activity,
  diabetes: Droplet,
  saudeMulher: UserRound,
  pessoaIdosa: Users,
};

interface TabNavigationProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = Object.keys(TAB_LABELS) as TabKey[];

  return (
    <div className="bg-card border-b border-border sticky top-0 z-10">
      <div className="container">
        <nav className="flex gap-1 overflow-x-auto py-2 scrollbar-thin" role="tablist">
          {tabs.map((tab) => {
            const Icon = TAB_ICON_COMPONENTS[tab];
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                role="tab"
                aria-selected={isActive}
                onClick={() => onTabChange(tab)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{TAB_LABELS[tab]}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
