"use client";

import { useState } from "react";
import profileImage from "../assets/man1.jpg";
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
import { Input } from "./ui/Input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";
import { Button } from "./ui/Button";
import { FilterDropdown } from "./ui/FilterDropdown";
import { Badge } from "./ui/Badge";

interface SpreadsheetRow {
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

const columns = [
  { key: "request", label: "Request", width: 300, sortable: true },
  { key: "submission", label: "Submission", width: 120, sortable: true },
  { key: "status", label: "Status", width: 120, sortable: true },
  { key: "submitter", label: "Submitter", width: 150, sortable: true },
  { key: "url", label: "URL", width: 150, sortable: false },
  { key: "assistant", label: "Assistant", width: 150, sortable: true },
  { key: "priority", label: "Priority", width: 100, sortable: true },
  { key: "dueDate", label: "Due Date", width: 120, sortable: true },
  { key: "estValue", label: "Est. Value", width: 120, sortable: true },
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
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("All Orders");
  const [data, setData] = useState(mockData);
  const [hiddenFields, setHiddenFields] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({
    key: "",
    direction: null,
  });
  const [filterConfig, setFilterConfig] = useState<{ [key: string]: string[] }>(
    {}
  );

  const tabs = ["All Orders", "Pending", "Reviewed", "Arrived"];
  const visibleColumns = columns.filter(
    (col) => !hiddenFields.includes(col.key)
  );

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setSelectedCell({ row: rowIndex, col: colIndex });
    console.log(`Cell clicked: Row ${rowIndex}, Col ${colIndex}`);
  };

  const handleSort = (columnKey: string) => {
    setSortConfig((prev) => ({
      key: columnKey,
      direction:
        prev.key === columnKey && prev.direction === "asc" ? "desc" : "asc",
    }));
    console.log(`Sorted by ${columnKey}`);
  };

  const handleFilter = (columnKey: string, values: string[]) => {
    setFilterConfig((prev) => ({
      ...prev,
      [columnKey]: values,
    }));
    console.log(`Filtered ${columnKey}:`, values);
  };

  const handleColumnResize = (columnIndex: number, newWidth: number) => {
    console.log(`Column ${columnIndex} resized to ${newWidth}px`);
  };

  const toggleFieldVisibility = (fieldKey: string) => {
    setHiddenFields((prev) =>
      prev.includes(fieldKey)
        ? prev.filter((f) => f !== fieldKey)
        : [...prev, fieldKey]
    );
    console.log(`Toggled field visibility: ${fieldKey}`);
  };

  const getSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey)
      return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-3 h-3 text-blue-600" />
    ) : (
      <ArrowDown className="w-3 h-3 text-blue-600" />
    );
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
            />
          </div>
          <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
          <Avatar className="w-8 h-8">
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
                  onClick={() => toggleFieldVisibility(col.key)}
                >
                  {hiddenFields.includes(col.key) ? (
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
            onClick={() => console.log("Sort clicked")}
          >
            <ArrowUpDown className="w-4 h-4 mr-1" />
            Sort
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log("Filter clicked")}
          >
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log("Cell view clicked")}
          >
            <Grid3X3 className="w-4 h-4 mr-1" />
            Cell view
          </Button>
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

      {/* Column Headers - Beautiful styling matching screenshot */}
      <div className="bg-gray-50 border-b border-gray-300 shadow-sm">
        <div className="flex">
          {/* Row number header */}
          <div className="w-12 h-10 bg-gray-100 border-r border-gray-300 flex items-center justify-center text-xs font-semibold text-gray-600 shadow-sm">
            #
          </div>

          {/* Column headers */}
          {visibleColumns.map((column, index) => (
            <div
              key={column.key}
              className="relative border-r border-gray-300 bg-gradient-to-b from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 transition-colors"
              style={{ width: `${column.width}px` }}
            >
              <div className="h-10 px-4 py-2 flex items-center justify-between group">
                {/* Left side - Label and sort */}
                <div
                  className={`flex items-center gap-2 cursor-pointer select-none ${
                    column.sortable ? "hover:text-gray-900" : ""
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <span className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
                    {column.label}
                  </span>
                  {column.sortable && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {getSortIcon(column.key)}
                    </div>
                  )}
                </div>

                {/* Right side - Filter and more options */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <FilterDropdown
                    columnKey={column.key}
                    data={data}
                    currentFilter={filterConfig[column.key] || []}
                    onFilter={handleFilter}
                  />
                  <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                    <MoreHorizontal className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Resize handle */}
              <div className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-400 hover:opacity-75 transition-colors group">
                <div className="w-full h-full opacity-0 group-hover:opacity-100 bg-blue-500"></div>
              </div>

              {/* Bottom border highlight */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Spreadsheet Body */}
      <div className="flex-1 overflow-auto">
        <div className="relative">
          {data.map((row, rowIndex) => (
            <div
              key={row.id}
              className="flex border-b border-gray-200 hover:bg-gray-50"
            >
              <div className="w-12 h-10 bg-gray-50 border-r border-gray-300 flex items-center justify-center text-xs text-gray-500 font-medium">
                {row.id}
              </div>
              {visibleColumns.map((column, colIndex) => {
                const isSelected =
                  selectedCell?.row === rowIndex &&
                  selectedCell?.col === colIndex;
                return (
                  <div
                    key={`${row.id}-${column.key}`}
                    className={`border-r border-gray-200 px-3 py-2 text-sm cursor-cell ${
                      isSelected ? "bg-blue-100 border-blue-500" : ""
                    }`}
                    style={{ width: `${column.width}px` }}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
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
                    {!["status", "priority", "url"].includes(column.key) && (
                      <span
                        className={
                          column.key === "request" ? "truncate block" : ""
                        }
                      >
                        {row[column.key as keyof SpreadsheetRow]}
                      </span>
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
              <div className="w-12 h-10 bg-gray-50 border-r border-gray-300 flex items-center justify-center text-xs text-gray-400">
                {data.length + index + 1}
              </div>
              {visibleColumns.map((column, colIndex) => (
                <div
                  key={`empty-${index}-${column.key}`}
                  className={`border-r border-gray-200 px-3 py-2 text-sm cursor-cell ${
                    selectedCell?.row === data.length + index &&
                    selectedCell?.col === colIndex
                      ? "bg-blue-100 border-blue-500"
                      : ""
                  }`}
                  style={{ width: `${column.width}px` }}
                  onClick={() => handleCellClick(data.length + index, colIndex)}
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
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
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
            className="px-2 py-2 text-gray-400 hover:text-gray-600"
            onClick={() => console.log("Add tab clicked")}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
