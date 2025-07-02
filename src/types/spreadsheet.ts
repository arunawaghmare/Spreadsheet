export interface SpreadsheetRow {
  id: number;
  request: string;
  submission: string;
  status: "In-process" | "Need to start" | "Complete" | "Blocked";
  submitter: string;
  url: string;
  assistant: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  estValue: string;
}

export interface Column {
  key: string;
  label: string;
  width: number;
  minWidth: number;
  visible: boolean;
  sortable: boolean;
}

export interface CellPosition {
  row: number;
  col: number;
}

export interface SortConfig {
  key: string;
  direction: "asc" | "desc" | null;
}

export interface FilterConfig {
  [key: string]: string[];
}
