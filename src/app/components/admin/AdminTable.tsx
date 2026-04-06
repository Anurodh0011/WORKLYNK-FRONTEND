"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/app/components/ui/table";
import { cn } from "@/src/lib/utils";

interface Column {
  header: string;
  accessor: string | ((row: any) => React.ReactNode);
  className?: string;
  headerClassName?: string;
}

interface AdminTableProps {
  columns: Column[];
  data: any[];
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export default function AdminTable({
  columns,
  data,
  isLoading,
  emptyMessage = "No records found.",
  className,
}: AdminTableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <Table className="w-full text-left border-collapse">
        <TableHeader className="bg-slate-50 border-b hover:bg-transparent">
          <TableRow className="hover:bg-transparent">
            {columns.map((col, idx) => (
              <TableHead
                key={idx}
                className={cn(
                  "font-bold text-slate-500 py-4 px-6 uppercase text-[11px] tracking-wider whitespace-nowrap",
                  col.headerClassName
                )}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y bg-white">
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="p-16 text-center text-slate-500 font-medium animate-pulse"
              >
                Loading table data...
              </TableCell>
            </TableRow>
          ) : data.length > 0 ? (
            data.map((row, rowIdx) => (
              <TableRow
                key={rowIdx}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                {columns.map((col, colIdx) => (
                  <TableCell
                    key={colIdx}
                    className={cn("p-6 align-middle", col.className)}
                  >
                    {typeof col.accessor === "function"
                      ? col.accessor(row)
                      : row[col.accessor]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="p-16 text-center text-slate-400 font-medium italic"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
