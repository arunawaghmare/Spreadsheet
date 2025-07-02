"use client";

import { useState, useCallback, useEffect } from "react";
import type { CellPosition, Column, FilterConfig, SortConfig, SpreadsheetRow } from "../types/spreadsheet";


export function useSpreadsheet(
  initialData: SpreadsheetRow[],
  initialColumns: Column[]
) {
  const [data, setData] = useState<SpreadsheetRow[]>(initialData);
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [selectedRange, setSelectedRange] = useState<{
    start: CellPosition;
    end: CellPosition;
  } | null>(null);
  const [editingCell, setEditingCell] = useState<CellPosition | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    direction: null,
  });
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({});
  const [copiedCell, setCopiedCell] = useState<CellPosition | null>(null);

  const visibleColumns = columns.filter((col) => col.visible);
  const filteredData = data.filter((row) => {
    return Object.entries(filterConfig).every(([key, values]) => {
      if (values.length === 0) return true;
      const cellValue = String(row[key as keyof SpreadsheetRow]);
      return values.includes(cellValue);
    });
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key || !sortConfig.direction) return 0;

    const aValue = String(a[sortConfig.key as keyof SpreadsheetRow]);
    const bValue = String(b[sortConfig.key as keyof SpreadsheetRow]);

    if (sortConfig.direction === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  const handleCellClick = useCallback(
    (row: number, col: number, isShiftClick = false) => {
      if (isShiftClick && selectedCell) {
        setSelectedRange({
          start: selectedCell,
          end: { row, col },
        });
      } else {
        setSelectedCell({ row, col });
        setSelectedRange(null);
      }
      setEditingCell(null);
      console.log(`Cell selected: Row ${row}, Col ${col}`);
    },
    [selectedCell]
  );

  const handleCellDoubleClick = useCallback(
    (row: number, col: number) => {
      setEditingCell({ row, col });
      const column = visibleColumns[col];
      const currentValue = String(
        sortedData[row]?.[column.key as keyof SpreadsheetRow] || ""
      );
      setEditValue(currentValue);
      console.log(`Cell editing: Row ${row}, Col ${col}`);
    },
    [sortedData, visibleColumns]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selectedCell) return;

      const maxRow = sortedData.length - 1;
      const maxCol = visibleColumns.length - 1;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setSelectedCell((prev) =>
            prev ? { ...prev, row: Math.max(0, prev.row - 1) } : null
          );
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedCell((prev) =>
            prev ? { ...prev, row: Math.min(maxRow, prev.row + 1) } : null
          );
          break;
        case "ArrowLeft":
          e.preventDefault();
          setSelectedCell((prev) =>
            prev ? { ...prev, col: Math.max(0, prev.col - 1) } : null
          );
          break;
        case "ArrowRight":
          e.preventDefault();
          setSelectedCell((prev) =>
            prev ? { ...prev, col: Math.min(maxCol, prev.col + 1) } : null
          );
          break;
        case "Enter":
          e.preventDefault();
          if (editingCell) {
            handleSaveEdit();
          } else {
            handleCellDoubleClick(selectedCell.row, selectedCell.col);
          }
          break;
        case "Escape":
          e.preventDefault();
          setEditingCell(null);
          setEditValue("");
          break;
        case "Delete":
          e.preventDefault();
          handleDeleteCell();
          break;
        case "c":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleCopy();
          }
          break;
        case "v":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handlePaste();
          }
          break;
      }
    },
    [selectedCell, sortedData.length, visibleColumns.length, editingCell]
  );

  const handleSaveEdit = useCallback(() => {
    if (!editingCell) return;

    const column = visibleColumns[editingCell.col];
    const rowData = sortedData[editingCell.row];

    if (rowData) {
      setData((prevData) =>
        prevData.map((row) =>
          row.id === rowData.id ? { ...row, [column.key]: editValue } : row
        )
      );
    }

    setEditingCell(null);
    setEditValue("");
    console.log(`Cell saved: ${column.key} = ${editValue}`);
  }, [editingCell, editValue, visibleColumns, sortedData]);

  const handleDeleteCell = useCallback(() => {
    if (!selectedCell) return;

    const column = visibleColumns[selectedCell.col];
    const rowData = sortedData[selectedCell.row];

    if (rowData) {
      setData((prevData) =>
        prevData.map((row) =>
          row.id === rowData.id ? { ...row, [column.key]: "" } : row
        )
      );
    }
    console.log(
      `Cell deleted: Row ${selectedCell.row}, Col ${selectedCell.col}`
    );
  }, [selectedCell, visibleColumns, sortedData]);

  const handleCopy = useCallback(() => {
    if (selectedCell) {
      setCopiedCell(selectedCell);
      console.log(
        `Cell copied: Row ${selectedCell.row}, Col ${selectedCell.col}`
      );
    }
  }, [selectedCell]);

  const handlePaste = useCallback(() => {
    if (!selectedCell || !copiedCell) return;

    const sourceColumn = visibleColumns[copiedCell.col];
    const targetColumn = visibleColumns[selectedCell.col];
    const sourceRowData = sortedData[copiedCell.row];
    const targetRowData = sortedData[selectedCell.row];

    if (sourceRowData && targetRowData) {
      const value = sourceRowData[sourceColumn.key as keyof SpreadsheetRow];
      setData((prevData) =>
        prevData.map((row) =>
          row.id === targetRowData.id
            ? { ...row, [targetColumn.key]: value }
            : row
        )
      );
    }
    console.log(
      `Cell pasted from Row ${copiedCell.row}, Col ${copiedCell.col} to Row ${selectedCell.row}, Col ${selectedCell.col}`
    );
  }, [selectedCell, copiedCell, visibleColumns, sortedData]);

  const handleSort = useCallback((columnKey: string) => {
    setSortConfig((prev) => ({
      key: columnKey,
      direction:
        prev.key === columnKey && prev.direction === "asc" ? "desc" : "asc",
    }));
    console.log(`Sorted by ${columnKey}`);
  }, []);

  const handleFilter = useCallback((columnKey: string, values: string[]) => {
    setFilterConfig((prev) => ({
      ...prev,
      [columnKey]: values,
    }));
    console.log(`Filtered ${columnKey}:`, values);
  }, []);

  const handleColumnResize = useCallback(
    (columnIndex: number, newWidth: number) => {
      setColumns((prev) =>
        prev.map((col, index) =>
          index === columnIndex
            ? { ...col, width: Math.max(col.minWidth, newWidth) }
            : col
        )
      );
      console.log(`Column ${columnIndex} resized to ${newWidth}px`);
    },
    []
  );

  const handleColumnToggle = useCallback((columnKey: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === columnKey ? { ...col, visible: !col.visible } : col
      )
    );
    console.log(`Column ${columnKey} visibility toggled`);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return {
    data: sortedData,
    columns,
    visibleColumns,
    selectedCell,
    selectedRange,
    editingCell,
    editValue,
    sortConfig,
    filterConfig,
    copiedCell,
    setEditValue,
    handleCellClick,
    handleCellDoubleClick,
    handleSaveEdit,
    handleSort,
    handleFilter,
    handleColumnResize,
    handleColumnToggle,
  };
}
