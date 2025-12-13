import { useState, useMemo, useCallback } from "react";
import { CsvRow } from "@/hooks/useCsvData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronLeft, ChevronRight, FileDown, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface DataTableProps {
  headers: string[];
  rows: CsvRow[];
  columnStart?: number; // 0-indexed (B=1 in Excel, so B=1 means index 1)
  columnEnd?: number;   // 0-indexed inclusive
  onFilteredRowsChange?: (filteredRows: CsvRow[], equipeFilter: string) => void;
  title?: string;
}

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  REALIZADAS: "default",
  FALTANDO: "secondary",
  PRIORIDADE: "destructive",
  ATRASADAS: "destructive",
  "NÃO PROVÁVEL": "secondary",
  PROVÁVEL: "default",
};

function getStatusVariant(value: string): "default" | "secondary" | "destructive" | "outline" {
  const upperValue = value.toUpperCase();
  for (const [key, variant] of Object.entries(STATUS_VARIANTS)) {
    if (upperValue.includes(key)) return variant;
  }
  return "outline";
}

function isStatusColumn(header: string): boolean {
  const statusHeaders = ["STATUS", "BOAS PRÁTICAS", "PRIORIDADE"];
  return statusHeaders.some((h) => header.toUpperCase().includes(h));
}

// Helper to find column by possible names
function findColumn(headers: string[], possibleNames: string[]): string | null {
  return headers.find((h) =>
    possibleNames.some((name) => h.toUpperCase().includes(name.toUpperCase()))
  ) || null;
}

// Extract unique values from a column
function getUniqueValues(rows: CsvRow[], column: string | null): string[] {
  if (!column) return [];
  const values = new Set<string>();
  rows.forEach((row) => {
    const val = row[column]?.trim();
    if (val) values.add(val);
  });
  return Array.from(values).sort();
}

export function DataTable({ 
  headers, 
  rows, 
  columnStart = 1, 
  columnEnd,
  onFilteredRowsChange,
  title = "Relatório de Dados"
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [equipeFilter, setEquipeFilter] = useState<string>("all");
  const [microareaFilter, setMicroareaFilter] = useState<string>("all");
  const [boasPraticasFilter, setBoasPraticasFilter] = useState<string>("all");
  const [vacinasFilter, setVacinasFilter] = useState<string>("all");
  const [prioridadeFilter, setPrioridadeFilter] = useState<string>("all");

  const rowsPerPage = 15;

  // Detect columns dynamically
  const columnMapping = useMemo(() => ({
    equipe: findColumn(headers, ["EQUIPE", "Equipe"]),
    microarea: findColumn(headers, ["MICROÁREA", "MICROAREA", "Microárea", "Microarea"]),
    boasPraticas: findColumn(headers, ["BOAS PRÁTICAS", "BOAS PRATICAS", "Status Boas Práticas", "TODAS AS BOAS PRÁTICAS"]),
    vacinas: findColumn(headers, ["VACINAS", "STATUS VACINAS", "Status Vacinas", "STATUS DAS VACINAS"]),
    prioridade: findColumn(headers, ["PRIORIDADE", "Prioridade"]),
  }), [headers]);

  // Get unique values for each filter
  const filterOptions = useMemo(() => ({
    equipe: getUniqueValues(rows, columnMapping.equipe),
    microarea: getUniqueValues(rows, columnMapping.microarea),
    boasPraticas: getUniqueValues(rows, columnMapping.boasPraticas),
    vacinas: getUniqueValues(rows, columnMapping.vacinas),
    prioridade: getUniqueValues(rows, columnMapping.prioridade),
  }), [rows, columnMapping]);

  // Calculate visible headers based on column range (B to X means starting from index 1)
  const visibleHeaders = useMemo(() => {
    const cleanHeaders = headers.filter((h) => h && !h.includes("SEERRO") && !h.includes("ARRAYFORMULA"));
    const endIndex = columnEnd !== undefined ? columnEnd : cleanHeaders.length - 1;
    return cleanHeaders.slice(columnStart, endIndex + 1);
  }, [headers, columnStart, columnEnd]);

  const filteredRows = useMemo(() => {
    let result = rows.filter((row) => {
      // Text search
      const matchesSearch = Object.values(row).some((value) =>
        value.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (!matchesSearch) return false;

      // Apply filters
      if (equipeFilter !== "all" && columnMapping.equipe) {
        if (row[columnMapping.equipe] !== equipeFilter) return false;
      }
      if (microareaFilter !== "all" && columnMapping.microarea) {
        if (row[columnMapping.microarea] !== microareaFilter) return false;
      }
      if (boasPraticasFilter !== "all" && columnMapping.boasPraticas) {
        if (row[columnMapping.boasPraticas] !== boasPraticasFilter) return false;
      }
      if (vacinasFilter !== "all" && columnMapping.vacinas) {
        if (row[columnMapping.vacinas] !== vacinasFilter) return false;
      }
      if (prioridadeFilter !== "all" && columnMapping.prioridade) {
        if (row[columnMapping.prioridade] !== prioridadeFilter) return false;
      }

      return true;
    });

    if (sortColumn) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortColumn] || "";
        const bVal = b[sortColumn] || "";
        const comparison = aVal.localeCompare(bVal, "pt-BR", { numeric: true });
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [rows, searchTerm, sortColumn, sortDirection, equipeFilter, microareaFilter, boasPraticasFilter, vacinasFilter, prioridadeFilter, columnMapping]);

  // Notify parent about filtered rows changes
  useMemo(() => {
    if (onFilteredRowsChange) {
      onFilteredRowsChange(filteredRows, equipeFilter);
    }
  }, [filteredRows, equipeFilter, onFilteredRowsChange]);

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (header: string) => {
    if (sortColumn === header) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(header);
      setSortDirection("asc");
    }
  };

  const clearFilters = () => {
    setEquipeFilter("all");
    setMicroareaFilter("all");
    setBoasPraticasFilter("all");
    setVacinasFilter("all");
    setPrioridadeFilter("all");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const hasActiveFilters = equipeFilter !== "all" || microareaFilter !== "all" || 
    boasPraticasFilter !== "all" || vacinasFilter !== "all" || prioridadeFilter !== "all";

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    
    // Title
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    
    // Filter info
    doc.setFontSize(10);
    let filterText = "Filtros aplicados: ";
    const filters: string[] = [];
    if (equipeFilter !== "all") filters.push(`Equipe: ${equipeFilter}`);
    if (microareaFilter !== "all") filters.push(`Microárea: ${microareaFilter}`);
    if (boasPraticasFilter !== "all") filters.push(`Boas Práticas: ${boasPraticasFilter}`);
    if (vacinasFilter !== "all") filters.push(`Vacinas: ${vacinasFilter}`);
    if (prioridadeFilter !== "all") filters.push(`Prioridade: ${prioridadeFilter}`);
    if (searchTerm) filters.push(`Busca: "${searchTerm}"`);
    
    filterText += filters.length > 0 ? filters.join(" | ") : "Nenhum";
    doc.text(filterText, 14, 22);
    doc.text(`Total de registros: ${filteredRows.length}`, 14, 28);
    
    // Table - with row numbers
    const tableHeaders = ["Nº", ...visibleHeaders];
    const tableBody = filteredRows.map((row, idx) => [
      String(idx + 1),
      ...visibleHeaders.map((h) => row[h] || "—")
    ]);
    
    autoTable(doc, {
      head: [tableHeaders],
      body: tableBody,
      startY: 35,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [20, 83, 90], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Página ${i} de ${pageCount} | Gerado em ${new Date().toLocaleDateString("pt-BR")}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
    }
    
    doc.save(`relatorio-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="space-y-4">
      {/* Search and actions bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
        
        <Button
          variant={showFilters ? "default" : "outline"}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Filtros
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
              {[equipeFilter, microareaFilter, boasPraticasFilter, vacinasFilter, prioridadeFilter]
                .filter((f) => f !== "all").length}
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
            <X className="w-4 h-4" />
            Limpar
          </Button>
        )}

        <Button variant="outline" size="sm" onClick={generatePDF} className="gap-2 ml-auto">
          <FileDown className="w-4 h-4" />
          Gerar PDF
        </Button>

        <p className="text-sm text-muted-foreground">
          {filteredRows.length.toLocaleString("pt-BR")} registros
        </p>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 p-4 bg-muted/50 rounded-lg border animate-fade-in">
          {columnMapping.equipe && filterOptions.equipe.length > 0 && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Equipe</label>
              <Select value={equipeFilter} onValueChange={(v) => { setEquipeFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {filterOptions.equipe.map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {columnMapping.microarea && filterOptions.microarea.length > 0 && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Microárea</label>
              <Select value={microareaFilter} onValueChange={(v) => { setMicroareaFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {filterOptions.microarea.map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {columnMapping.boasPraticas && filterOptions.boasPraticas.length > 0 && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Boas Práticas</label>
              <Select value={boasPraticasFilter} onValueChange={(v) => { setBoasPraticasFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {filterOptions.boasPraticas.map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {columnMapping.vacinas && filterOptions.vacinas.length > 0 && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Vacinas</label>
              <Select value={vacinasFilter} onValueChange={(v) => { setVacinasFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {filterOptions.vacinas.map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {columnMapping.prioridade && filterOptions.prioridade.length > 0 && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Prioridade</label>
              <Select value={prioridadeFilter} onValueChange={(v) => { setPrioridadeFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {filterOptions.prioridade.map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12 text-center font-semibold text-xs">Nº</TableHead>
                {visibleHeaders.map((header) => (
                  <TableHead
                    key={header}
                    onClick={() => handleSort(header)}
                    className="cursor-pointer hover:bg-muted/80 transition-colors whitespace-nowrap font-semibold text-xs"
                  >
                    <div className="flex items-center gap-1">
                      {header}
                      {sortColumn === header && (
                        <span className="text-primary">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={visibleHeaders.length + 1}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Nenhum registro encontrado
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRows.map((row, idx) => (
                  <TableRow
                    key={idx}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="text-sm py-3 text-center font-medium text-muted-foreground">
                      {(currentPage - 1) * rowsPerPage + idx + 1}
                    </TableCell>
                    {visibleHeaders.map((header) => (
                      <TableCell key={header} className="text-sm py-3">
                        {isStatusColumn(header) && row[header] ? (
                          <Badge variant={getStatusVariant(row[header])}>
                            {row[header]}
                          </Badge>
                        ) : (
                          <span className="truncate max-w-[200px] block">
                            {row[header] || "—"}
                          </span>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}