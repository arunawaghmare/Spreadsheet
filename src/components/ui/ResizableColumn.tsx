"use client";

import React, { useState, useCallback } from "react";

interface ResizableColumnProps {
  width: number;
  onResize: (newWidth: number) => void;
  children: React.ReactNode;
  className?: string;
}

export function ResizableColumn({
  width,
  onResize,
  children,
  className = "",
}: ResizableColumnProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      setStartX(e.clientX);
      setStartWidth(width);
    },
    [width]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const diff = e.clientX - startX;
      const newWidth = startWidth + diff;
      onResize(newWidth);
    },
    [isResizing, startX, startWidth, onResize]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

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
    <div className={`relative ${className}`} style={{ width: `${width}px` }}>
      {children}
      <div
        className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-500 hover:opacity-50"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}
