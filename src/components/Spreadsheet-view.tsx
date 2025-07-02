"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Badge } from "./ui/Badge";
import profileImage from "../assets/man1.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";

import { useSpreadsheet } from "../hooks/useSpreadsheet";
import {
  Search,
  Bell,
  ChevronDown,
  Eye,
  EyeOff,
  ArrowUpDown,
  Filter,
  Grid3X3,
  Download,
  Upload,
  Share,
  Plus,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type { SpreadsheetRow, Column } from "../types/spreadsheet";
import { FilterDropdown } from "./ui/FilterDropdown";
import { ResizableColumn } from "./ui/ResizableColumn";

const mockData: SpreadsheetRow[] = [
  {
    id: 1,
    request: "Launch social media campaign for pro...",
    submission: "15-11-2024",
    status: "In-process",
    submitter: "Alaha Patel",
    url: "www.alahapatel...",
    assistant: "Sophie Choudhury",
    priority: "Medium",
    dueDate: "20-11-2024",
    estValue: "6,200,000",
  },
  {
    id: 2,
    request: "Update press kit for company redesign",
    submission: "28-10-2024",
    status: "Need to start",
    submitter: "Irfan Khan",
    url: "www.irfankhan...",
    assistant: "Tejas Pandey",
    priority: "High",
    dueDate: "30-10-2024",
    estValue: "3,500,000",
  },
  {
    id: 3,
    request: "Finalize user testing feedback for app...",
    submission: "05-12-2024",
    status: "In-process",
    submitter: "Mark Johnson",
    url: "www.markjohns...",
    assistant: "Rachel Lee",
    priority: "Medium",
    dueDate: "10-12-2024",
    estValue: "4,750,000",
  },
  {
    id: 4,
    request: "Design new features for the website",
    submission: "10-01-2025",
    status: "Complete",
    submitter: "Emily Green",
    url: "www.emilygreen...",
    assistant: "Tom Wright",
    priority: "Low",
    dueDate: "15-01-2025",
    estValue: "5,900,000",
  },
  {
    id: 5,
    request: "Prepare financial report for Q4",
    submission: "25-01-2025",
    status: "Blocked",
    submitter: "Jessica Brown",
    url: "www.jessicabro...",
    assistant: "Kevin Smith",
    priority: "Low",
    dueDate: "30-01-2025",
    estValue: "2,800,000",
  },
];

const initialColumns: Column[] = [
  {
    key: "request",
    label: "Request",
    width: 300,
    minWidth: 150,
    visible: true,
    sortable: true,
  },
  {
    key: "submission",
    label: "Submission63",
    width: 120,
    minWidth: 100,
    visible: true,
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    width: 120,
    minWidth: 100,
    visible: true,
    sortable: true,
  },
  {
    key: "submitter",
    label: "Submitter",
    width: 150,
    minWidth: 120,
    visible: true,
    sortable: true,
  },
  {
    key: "url",
    label: "URL",
    width: 150,
    minWidth: 120,
    visible: true,
    sortable: false,
  },
  {
    key: "assistant",
    label: "Assistant",
    width: 150,
    minWidth: 120,
    visible: true,
    sortable: true,
  },
  {
    key: "priority",
    label: "Priority",
    width: 100,
    minWidth: 80,
    visible: true,
    sortable: true,
  },
  {
    key: "dueDate",
    label: "Due Date",
    width: 120,
    minWidth: 100,
    visible: true,
    sortable: true,
  },
  {
    key: "estValue",
    label: "Est. Value",
    width: 120,
    minWidth: 100,
    visible: true,
    sortable: true,
  },
];

const statusColors = {
  "In-process": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Need to start": "bg-blue-100 text-blue-800 border-blue-200",
  Complete: "bg-green-100 text-green-800 border-green-200",
  Blocked: "bg-red-100 text-red-800 border-red-200",
};

const priorityColors = {
  High: "bg-red-100 text-red-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Low: "bg-green-100 text-green-800",
};

export function SpreadsheetView() {
  const [activeTab, setActiveTab] = useState("All Orders");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data,
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
  } = useSpreadsheet(mockData, initialColumns);

  const tabs = ["All Orders", "Pending", "Reviewed", "Arrived"];

  const filteredBySearch = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey)
      return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-3 h-3 text-blue-600" />
    ) : (
      <ArrowDown className="w-3 h-3 text-blue-600" />
    );
  };

  const isCellSelected = (rowIndex: number, colIndex: number) => {
    if (selectedRange) {
      const { start, end } = selectedRange;
      const minRow = Math.min(start.row, end.row);
      const maxRow = Math.max(start.row, end.row);
      const minCol = Math.min(start.col, end.col);
      const maxCol = Math.max(start.col, end.col);
      return (
        rowIndex >= minRow &&
        rowIndex <= maxRow &&
        colIndex >= minCol &&
        colIndex <= maxCol
      );
    }
    return selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
  };

  const isCellCopied = (rowIndex: number, colIndex: number) => {
    return copiedCell?.row === rowIndex && copiedCell?.col === colIndex;
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
          <span>Workspace</span>
          <span>/</span>
          <span>Folder 2</span>
          <span>/</span>
          <span className="bg-pink-500 text-white px-2 py-1 rounded text-xs font-medium">
            Spreadsheet 3
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search within sheet"
              className="pl-10 w-64 h-8 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Bell
            className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800"
            onClick={() => console.log("Notifications clicked")}
          />
          <Avatar
            className="w-8 h-8 cursor-pointer"
            onClick={() => console.log("Profile clicked")}
          >
            <AvatarImage src={profileImage} alt="User" />
            <AvatarFallback className="text-xs">JD</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">John Doe</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Tool bar</span>
            <ChevronDown className="w-4 h-4" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-sm">
                <EyeOff className="w-4 h-4 mr-1" />
                Hide fields
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {columns.map((col) => (
                <DropdownMenuItem
                  key={col.key}
                  onClick={() => handleColumnToggle(col.key)}
                >
                  {col.visible ? (
                    <Eye className="w-4 h-4 mr-2" />
                  ) : (
                    <EyeOff className="w-4 h-4 mr-2" />
                  )}
                  {col.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log("Sort menu opened")}
          >
            <ArrowUpDown className="w-4 h-4 mr-1" />
            Sort
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log("Filter menu opened")}
          >
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Grid3X3 className="w-4 h-4 mr-1" />
                Cell view
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => console.log("Compact view selected")}
              >
                Compact
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Comfortable view selected")}
              >
                Comfortable
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Spacious view selected")}
              >
                Spacious
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log("Import clicked")}
          >
            <Upload className="w-4 h-4 mr-1" />
            Import
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log("Export clicked")}
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log("Share clicked")}
          >
            <Share className="w-4 h-4 mr-1" />
            Share
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
            onClick={() => console.log("New Action clicked")}
          >
            <Plus className="w-4 h-4 mr-1" />
            New Action
          </Button>
        </div>
      </div>

      {/* Column Headers */}
      {/* Column Headers */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="flex">
          <div className="w-8 h-8 bg-gray-200 border-r border-gray-300 flex items-center justify-center text-xs font-medium">
            #
          </div>
          {visibleColumns.map((column, index) => (
            <ResizableColumn
              key={column.key}
              width={column.width}
              onResize={(newWidth) => handleColumnResize(index, newWidth)}
              className="border-r border-gray-300 bg-gray-100"
            >
              <div className="group px-3 py-2 text-xs font-medium text-gray-700 flex items-center justify-between h-full">
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-gray-900"
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <span>{column.label}</span>
                  {column.sortable && getSortIcon(column.key)}
                </div>

                {/* Hidden icons until hover */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <FilterDropdown
                    columnKey={column.key}
                    data={data}
                    currentFilter={filterConfig[column.key] || []}
                    onFilter={handleFilter}
                  />
                  <MoreHorizontal className="w-3 h-3 text-gray-400" />
                </div>
              </div>
            </ResizableColumn>
          ))}
        </div>
      </div>

      {/* Spreadsheet Body */}
      <div className="flex-1 overflow-auto">
        <div className="relative">
          {filteredBySearch.map((row, rowIndex) => (
            <div
              key={row.id}
              className="flex border-b border-gray-200 hover:bg-gray-50"
            >
              <div className="w-8 h-10 bg-gray-50 border-r border-gray-300 flex items-center justify-center text-xs text-gray-500">
                {row.id}
              </div>
              {visibleColumns.map((column, colIndex) => {
                const isSelected = isCellSelected(rowIndex, colIndex);
                const isCopied = isCellCopied(rowIndex, colIndex);
                const isEditing =
                  editingCell?.row === rowIndex &&
                  editingCell?.col === colIndex;

                return (
                  <div
                    key={`${row.id}-${column.key}`}
                    className={`border-r border-gray-200 px-3 py-2 text-sm cursor-cell relative ${
                      isSelected ? "bg-blue-100 border-blue-500" : ""
                    } ${
                      isCopied ? "border-2 border-dashed border-green-500" : ""
                    }`}
                    style={{ width: `${column.width}px` }}
                    onClick={(e) =>
                      handleCellClick(rowIndex, colIndex, e.shiftKey)
                    }
                    onDoubleClick={() =>
                      handleCellDoubleClick(rowIndex, colIndex)
                    }
                  >
                    {isEditing ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleSaveEdit}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSaveEdit();
                          } else if (e.key === "Escape") {
                            setEditValue("");
                          }
                        }}
                        className="w-full h-full border-none outline-none bg-transparent"
                        autoFocus
                      />
                    ) : (
                      <>
                        {column.key === "status" && (
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              statusColors[
                                row[
                                  column.key as keyof SpreadsheetRow
                                ] as keyof typeof statusColors
                              ]
                            }`}
                          >
                            {row[column.key as keyof SpreadsheetRow]}
                          </Badge>
                        )}
                        {column.key === "priority" && (
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              priorityColors[
                                row[
                                  column.key as keyof SpreadsheetRow
                                ] as keyof typeof priorityColors
                              ]
                            }`}
                          >
                            {row[column.key as keyof SpreadsheetRow]}
                          </Badge>
                        )}
                        {column.key === "url" && (
                          <a
                            href="#"
                            className="text-blue-600 hover:underline"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log(
                                `URL clicked: ${
                                  row[column.key as keyof SpreadsheetRow]
                                }`
                              );
                            }}
                          >
                            {row[column.key as keyof SpreadsheetRow]}
                          </a>
                        )}
                        {!["status", "priority", "url"].includes(
                          column.key
                        ) && (
                          <span
                            className={
                              column.key === "request" ? "truncate block" : ""
                            }
                          >
                            {row[column.key as keyof SpreadsheetRow]}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Empty rows */}
          {Array.from({ length: 15 }, (_, index) => (
            <div
              key={`empty-${index}`}
              className="flex border-b border-gray-200"
            >
              <div className="w-8 h-10 bg-gray-50 border-r border-gray-300 flex items-center justify-center text-xs text-gray-400">
                {filteredBySearch.length + index + 1}
              </div>
              {visibleColumns.map((column, colIndex) => (
                <div
                  key={`empty-${index}-${column.key}`}
                  className={`border-r border-gray-200 px-3 py-2 text-sm cursor-cell ${
                    isCellSelected(filteredBySearch.length + index, colIndex)
                      ? "bg-blue-100 border-blue-500"
                      : ""
                  }`}
                  style={{ width: `${column.width}px` }}
                  onClick={(e) =>
                    handleCellClick(
                      filteredBySearch.length + index,
                      colIndex,
                      e.shiftKey
                    )
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Tabs */}
      <div className="border-t border-gray-200 bg-white">
        <div className="flex items-center">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => {
                setActiveTab(tab);
                console.log(`Tab clicked: ${tab}`);
              }}
            >
              {tab}
            </button>
          ))}
          <button
            className="px-2 py-2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => console.log("Add tab clicked")}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-50 px-4 py-1 text-xs text-gray-600 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>{filteredBySearch.length} rows</span>
            {selectedCell && (
              <span>
                Selected: R{selectedCell.row + 1}C{selectedCell.col + 1}
              </span>
            )}
            {selectedRange && (
              <span>
                Range: R{selectedRange.start.row + 1}C
                {selectedRange.start.col + 1}:R{selectedRange.end.row + 1}C
                {selectedRange.end.col + 1}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span>Use Ctrl+C to copy, Ctrl+V to paste, Delete to clear</span>
          </div>
        </div>
      </div>
    </div>
  );
}
