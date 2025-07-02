"use client";

import React, { useState, useCallback, useRef } from "react";

interface ResizableColumnProps {
  width: number;
  onResize: (newWidth: number) => void;
  children: React.ReactNode;
  className?: string;
  minWidth?: number;
}

export function ResizableColumn({
  width,
  onResize,
  children,
  className = "",
  minWidth = 80,
}: ResizableColumnProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const columnRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      setStartX(e.clientX);
      setStartWidth(width);
      document.body.style.cursor = "col-resize";
      console.log("Column resize started");
    },
    [width]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const diff = e.clientX - startX;
      const newWidth = Math.max(minWidth, startWidth + diff);
      onResize(newWidth);
    },
    [isResizing, startX, startWidth, onResize, minWidth]
  );

  const handleMouseUp = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
      document.body.style.cursor = "default";
      console.log("Column resize ended");
    }
  }, [isResizing]);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={columnRef}
      className={`relative ${className}`}
      style={{ width: `${width}px` }}
    >
      {children}
      {/* Resize handle */}
      <div
        className="absolute right-0 top-0 w-2 h-full cursor-col-resize hover:bg-blue-400 hover:opacity-50 transition-colors z-10 flex items-center justify-center"
        onMouseDown={handleMouseDown}
      >
        <div className="w-0.5 h-4 bg-gray-400 hover:bg-blue-500"></div>
      </div>
      {/* Visual feedback during resize */}
      {isResizing && (
        <div className="absolute right-0 top-0 w-0.5 h-full bg-blue-500 z-20"></div>
      )}
    </div>
  );
}
