"use client";

import { useState } from "react";

import { Filter, Check } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./DropdownMenu";
import { Button } from "./Button";

interface FilterDropdownProps {
  columnKey: string;
  data: any[];
  currentFilter: string[];
  onFilter: (columnKey: string, values: string[]) => void;
}

export function FilterDropdown({
  columnKey,
  data,
  currentFilter,
  onFilter,
}: FilterDropdownProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>(currentFilter);

  const uniqueValues = Array.from(
    new Set(data.map((row) => String(row[columnKey])))
  )
    .filter(Boolean)
    .sort();

  const handleToggleValue = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    setSelectedValues(newValues);
    onFilter(columnKey, newValues);
  };

  const handleClearAll = () => {
    setSelectedValues([]);
    onFilter(columnKey, []);
  };

  const handleSelectAll = () => {
    setSelectedValues(uniqueValues);
    onFilter(columnKey, uniqueValues);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="p-1">
          <Filter
            className={`w-3 h-3 ${
              currentFilter.length > 0 ? "text-blue-600" : "text-gray-400"
            }`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <div className="p-2 border-b">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              className="text-xs"
            >
              Select All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-xs"
            >
              Clear
            </Button>
          </div>
        </div>
        <div className="max-h-48 overflow-y-auto">
          {uniqueValues.map((value) => (
            <DropdownMenuItem
              key={value}
              onClick={() => handleToggleValue(value)}
              className="flex items-center gap-2"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                {selectedValues.includes(value) && (
                  <Check className="w-3 h-3" />
                )}
              </div>
              <span className="truncate">{value}</span>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
