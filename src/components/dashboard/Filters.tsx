import { FilterState } from "@/types/health";
import { Filter, FileDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MultiSelectFilter } from "./MultiSelectFilter";

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string[]) => void;
  onResetFilters: () => void;
  onExportPDF: () => void;
  activeTabId: string;
  options: {
    equipes: string[];
    microareas: string[];
    statusBoasPraticas: string[];
    statusVacinas: string[];
    prioridades: string[];
    quadrimestres: string[];
  };
}

export const Filters = ({
  filters,
  onFilterChange,
  onResetFilters,
  onExportPDF,
  activeTabId,
  options,
}: FiltersProps) => {
  const hasActiveFilters = 
    (filters.equipe?.length || 0) > 0 ||
    (filters.microarea?.length || 0) > 0 ||
    (filters.statusBoasPraticas?.length || 0) > 0 ||
    (filters.statusVacinas?.length || 0) > 0 ||
    (filters.prioridade?.length || 0) > 0 ||
    (filters.quadrimestre?.length || 0) > 0;

  // Aba 2 (tab2) mostra Status Vacinas, as demais mostram Boas Práticas
  const showStatusVacinas = activeTabId === "tab2";
  const showBoasPraticas = activeTabId !== "tab2";
  // Quadrimestre só aparece nas Abas 1, 2 e 3
  const showQuadrimestre = activeTabId === "tab1" || activeTabId === "tab2" || activeTabId === "tab3";

  return (
    <div className="bg-card rounded-xl p-4 shadow-card border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-primary" />
        <span className="font-medium text-sm">Filtros</span>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Limpar
          </button>
        )}
      </div>

      <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 ${showQuadrimestre ? 'lg:grid-cols-6' : 'lg:grid-cols-5'}`}>
        <MultiSelectFilter
          label="Equipe"
          options={options.equipes}
          selected={filters.equipe}
          onChange={(values) => onFilterChange("equipe", values)}
          placeholder="Todas"
        />

        <MultiSelectFilter
          label="Microárea"
          options={options.microareas}
          selected={filters.microarea}
          onChange={(values) => onFilterChange("microarea", values)}
          placeholder="Todas"
        />

        {showBoasPraticas && (
          <MultiSelectFilter
            label="Boas Práticas"
            options={options.statusBoasPraticas}
            selected={filters.statusBoasPraticas}
            onChange={(values) => onFilterChange("statusBoasPraticas", values)}
            placeholder="Todos"
          />
        )}

        {showStatusVacinas && (
          <MultiSelectFilter
            label="Status Vacinas"
            options={options.statusVacinas}
            selected={filters.statusVacinas}
            onChange={(values) => onFilterChange("statusVacinas", values)}
            placeholder="Todos"
          />
        )}

        {showQuadrimestre && (
          <MultiSelectFilter
            label="Quadrimestre"
            options={options.quadrimestres || []}
            selected={filters.quadrimestre || []}
            onChange={(values) => onFilterChange("quadrimestre", values)}
            placeholder="Todos"
          />
        )}

        <MultiSelectFilter
          label="Prioridade"
          options={options.prioridades}
          selected={filters.prioridade}
          onChange={(values) => onFilterChange("prioridade", values)}
          placeholder="Todas"
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground font-medium">&nbsp;</label>
          <Button
            onClick={onExportPDF}
            variant="default"
            size="sm"
            className="h-10 gap-2"
          >
            <FileDown className="w-4 h-4" />
            Gerar PDF
          </Button>
        </div>
      </div>
    </div>
  );
};
