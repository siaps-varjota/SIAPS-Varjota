import { HealthRecord } from "@/types/health";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataTableProps {
  data: HealthRecord[];
  headers: string[];
  sortColumn?: string | null;
  sortDirection?: "asc" | "desc" | null;
  onSortChange?: (column: string | null, direction: "asc" | "desc" | null) => void;
  searchName?: string;
  onSearchNameChange?: (value: string) => void;
  selectedEquipes?: string[];
}

type SortDirection = "asc" | "desc" | null;

const ITEMS_PER_PAGE = 50;

const getStatusStyle = (value: string) => {
  const upper = value.toUpperCase();
  if (upper === "REALIZADAS" || upper === "SIM" || upper === "PROVÁVEL") {
    return "bg-health-success/20 text-health-success";
  }
  if (upper === "FALTANDO" || upper === "ATRASADAS" || upper === "NÃO PROVÁVEL") {
    return "bg-health-warning/20 text-health-warning";
  }
  if (upper === "PRIORIDADE") {
    return "bg-health-danger/20 text-health-danger";
  }
  return "";
};

export const DataTable = ({ 
  data, 
  headers, 
  sortColumn: externalSortColumn, 
  sortDirection: externalSortDirection,
  onSortChange,
  searchName = "",
  onSearchNameChange,
  selectedEquipes = []
}: DataTableProps) => {
  const [internalSortColumn, setInternalSortColumn] = useState<string | null>(null);
  const [internalSortDirection, setInternalSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Use external state if provided, otherwise use internal state
  const sortColumn = externalSortColumn !== undefined ? externalSortColumn : internalSortColumn;
  const sortDirection = externalSortDirection !== undefined ? externalSortDirection : internalSortDirection;

  // Hide "Equipe" column when only 1 team is selected
  const hideEquipeColumn = selectedEquipes.length === 1;

  const displayHeaders = headers.filter(h => {
    if (!h) return false;
    if (["QUADRIMESTRE", "PONTUAÇÃO", "PONTOS"].includes(h.toUpperCase())) return false;
    if (hideEquipeColumn && h.toUpperCase() === "EQUIPE") return false;
    return true;
  });

  const handleSort = (header: string) => {
    // Não ordenar a coluna Nº
    if (header.toLowerCase().startsWith("nº") || header.toLowerCase() === "n°") return;
    
    let newColumn: string | null = header;
    let newDirection: SortDirection = "asc";
    
    if (sortColumn === header) {
      if (sortDirection === "asc") {
        newDirection = "desc";
      } else if (sortDirection === "desc") {
        newColumn = null;
        newDirection = null;
      }
    }
    
    if (onSortChange) {
      onSortChange(newColumn, newDirection);
    } else {
      setInternalSortColumn(newColumn);
      setInternalSortDirection(newDirection);
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;
    
    const aVal = String(a[sortColumn] || "").trim();
    const bVal = String(b[sortColumn] || "").trim();
    
    // Tentar ordenar como número
    const aNum = parseFloat(aVal);
    const bNum = parseFloat(bVal);
    
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
    }
    
    // Ordenar como string
    const comparison = aVal.localeCompare(bVal, "pt-BR", { sensitivity: "base" });
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const getSortIcon = (header: string) => {
    if (header.toLowerCase().startsWith("nº") || header.toLowerCase() === "n°") return null;
    
    if (sortColumn === header) {
      if (sortDirection === "asc") return <ChevronUp className="w-3 h-3" />;
      if (sortDirection === "desc") return <ChevronDown className="w-3 h-3" />;
    }
    return <ChevronsUpDown className="w-3 h-3 opacity-50" />;
  };

  const hasData = data.length > 0;

  return (
    <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-display font-semibold text-lg">Dados Detalhados</h2>
          <p className="text-sm text-muted-foreground">
            {hasData 
              ? `Mostrando ${startIndex + 1}-${Math.min(endIndex, sortedData.length)} de ${sortedData.length} registros`
              : "Nenhum registro encontrado"
            }
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Localizar..."
            value={searchName}
            onChange={(e) => onSearchNameChange?.(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {displayHeaders.map((header, idx) => {
                const isFirstCol = idx === 0 && (header.toLowerCase().startsWith("nº") || header.toLowerCase() === "n°");
                return (
                  <TableHead 
                    key={header} 
                    className={cn(
                      "font-semibold text-xs whitespace-nowrap text-center",
                      !isFirstCol && "cursor-pointer hover:bg-muted/70 transition-colors select-none"
                    )}
                    onClick={() => handleSort(header)}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {isFirstCol ? "Nº" : header}
                      {getSortIcon(header)}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {hasData ? (
              paginatedData.map((record, idx) => (
                <TableRow key={idx} className="hover:bg-muted/30 transition-colors">
                  {displayHeaders.map((header, colIdx) => {
                    const isFirstCol = colIdx === 0 && (header.toLowerCase().startsWith("nº") || header.toLowerCase() === "n°");
                    const value = isFirstCol ? String(startIndex + idx + 1) : String(record[header] || "");
                    const statusStyle = getStatusStyle(value);
                    
                    return (
                      <TableCell key={header} className="text-sm py-3 text-center">
                        {statusStyle ? (
                          <span className={cn("px-2 py-1 rounded-md text-xs font-medium", statusStyle)}>
                            {value}
                          </span>
                        ) : (
                          <span className="truncate max-w-[200px] block mx-auto" title={value}>
                            {value}
                          </span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={displayHeaders.length} className="text-center py-8 text-muted-foreground">
                  Nenhum registro encontrado. Limpe a busca ou ajuste os filtros.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Próxima
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
