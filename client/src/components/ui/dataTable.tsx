import * as React from "react";
import
  {
    CellContext,
    ColumnDef,
    HeaderContext,
    Row,
    Table,
    flexRender,
  } from "@tanstack/react-table";
import
  {
    Table as TableData,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter,
  } from "@/components/ui/table";
import { Button } from "./button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  table: Table<TData>;
  footerRows?: FooterRow[];
  detailColumns?: ColumnDef<unknown, unknown>[];
  getDetailData?: ( row: TData ) => unknown[];
  expandedRow?: string | null;
  onRowClick?: (rowId: string) => void;
}

interface FooterRow {
  colSpan: number;
  label: string;
  value: string | number;
}

export function DataTable<TData, TValue>({
  columns,
  table,
  footerRows = [],
  detailColumns = [],
  getDetailData,
  expandedRow,
  onRowClick,
}: DataTableProps<TData, TValue> )
{
  const renderExpandedContent = React.useCallback((row: Row<TData>) => {
    if ( !getDetailData || !detailColumns.length ) return null;

    const details = getDetailData(row.original);

    return (
      <TableData className="min-w-full bg-white">
        <TableHeader className="bg-gray-50">
          <TableRow>
            {detailColumns.map((column) => (
              <TableHead key={column.id}>
                {typeof column.header === "function"
                  ? column.header({ column } as HeaderContext<unknown, unknown>)
                  : column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {details.map((detail, index) => (
            <TableRow key={index}>
              {detailColumns.map((column) => (
                <TableCell key={column.id}>
                  {flexRender(column.cell, { row: { original: detail } } as CellContext<unknown, unknown>)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableData>
    );
  }, [detailColumns, getDetailData])

  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex-grow overflow-y-auto rounded-md h-auto">
        <TableData className="min-w-max overflow-hidden">
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      minWidth: header.column.columnDef.size,
                      maxWidth: header.column.columnDef.size,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="w-auto min-w-full h-1/2 overflow-hidden border-b">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() ? "selected" : undefined}
                    onClick={() => onRowClick && onRowClick(row.id)}
                    className="cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          minWidth: "100%",
                          maxWidth: "100%",
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {expandedRow === row.id && (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="px-2 py-0 relative bg-gray-100"
                      >
                        {renderExpandedContent(row)}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center capitalize"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            {footerRows.map((footerRow, index) => (
              <TableRow key={index}>
                <TableCell colSpan={footerRow.colSpan} className="border-b">
                  {footerRow.label}
                </TableCell>
                <TableCell className="text-right border-b">
                  {footerRow.value}
                </TableCell>
              </TableRow>
            ))}
          </TableFooter>
        </TableData>
      </div>
      <div className="flex items-center justify-end space-x-1 mt-3">
        <Button
          variant="noBorder"
          size="sm"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft />
        </Button>
        <Button
          variant="noBorder"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft />
        </Button>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <Button
          variant="noBorder"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight />
        </Button>
        <Button
          variant="noBorder"
          size="sm"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight />
        </Button>
      </div>
    </div>
  );
}
