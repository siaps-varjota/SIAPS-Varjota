import { useState, useMemo } from "react";
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
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTableProps {
  headers: string[];
  rows: CsvRow[];
  maxVisibleColumns?: number;
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

export function DataTable({ headers, rows, maxVisibleColumns = 8 }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const rowsPerPage = 15;

  // Filter out empty or metadata columns
  const visibleHeaders = useMemo(() => {
    return headers
      .filter((h) => h && !h.includes("SEERRO") && !h.includes("ARRAYFORMULA"))
      .slice(0, maxVisibleColumns);
  }, [headers, maxVisibleColumns]);

  const filteredRows = useMemo(() => {
    let result = rows.filter((row) =>
      Object.values(row).some((value) =>
        value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (sortColumn) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortColumn] || "";
        const bVal = b[sortColumn] || "";
        const comparison = aVal.localeCompare(bVal, "pt-BR", { numeric: true });
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [rows, searchTerm, sortColumn, sortDirection]);

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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
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
        <p className="text-sm text-muted-foreground">
          {filteredRows.length.toLocaleString("pt-BR")} registros
        </p>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
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
                    colSpan={visibleHeaders.length}
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
