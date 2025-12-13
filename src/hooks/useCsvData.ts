import { useState, useEffect } from "react";

export interface CsvRow {
  [key: string]: string;
}

export interface CsvData {
  headers: string[];
  rows: CsvRow[];
  rawRows: string[][];
  summary: Record<string, string | number>;
}

function parseCSV(csvText: string): { headers: string[]; rows: string[][] } {
  const lines = csvText.split("\n").filter((line) => line.trim() !== "");
  const rows: string[][] = [];

  for (const line of lines) {
    const row: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        row.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    rows.push(row);
  }

  return { headers: rows[0] || [], rows: rows.slice(1) };
}

export function useCsvData(url: string) {
  const [data, setData] = useState<CsvData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Falha ao carregar dados");
        }
        const text = await response.text();
        const { headers, rows } = parseCSV(text);

        // Find the header row (usually contains column names like "Nº", "EQUIPE", etc.)
        let headerRowIndex = -1;
        let summaryData: Record<string, string | number> = {};

        for (let i = 0; i < Math.min(10, rows.length); i++) {
          if (
            rows[i].some(
              (cell) =>
                cell.includes("Nº") ||
                cell.includes("EQUIPE") ||
                cell.includes("Nome Completo")
            )
          ) {
            headerRowIndex = i;
            break;
          }
        }

        // Extract summary from header rows
        const summaryRows = headerRowIndex > 0 ? rows.slice(0, headerRowIndex) : [];
        for (const row of summaryRows) {
          for (let i = 0; i < row.length; i++) {
            const value = row[i];
            if (value && !isNaN(Number(value.replace(",", ".")))) {
              const label = headers[i] || `col_${i}`;
              summaryData[label] = value;
            }
          }
        }

        const actualHeaders =
          headerRowIndex >= 0 ? rows[headerRowIndex] : headers;
        const dataRows =
          headerRowIndex >= 0 ? rows.slice(headerRowIndex + 1) : rows;

        const parsedRows: CsvRow[] = dataRows
          .filter((row) => row.some((cell) => cell.trim() !== ""))
          .map((row) => {
            const obj: CsvRow = {};
            actualHeaders.forEach((header, index) => {
              if (header) {
                obj[header] = row[index] || "";
              }
            });
            return obj;
          });

        setData({
          headers: actualHeaders.filter((h) => h),
          rows: parsedRows,
          rawRows: dataRows,
          summary: summaryData,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [url]);

  return { data, loading, error };
}
