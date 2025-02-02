import React from "react";
import {
  RowSelectionState,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { DataTable } from "../../../components/ui/dataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { fetcher } from "@/lib/utils";
import ColumnVisibility from "@/components/ui/dataTables/columnVisibility";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "react-router-dom";
import ShowEntries from "@/components/ui/dataTables/showEntries";
import SearchDataTable from "@/components/ui/dataTables/searchDataTable";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import useSWR from "swr";
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  PlusCircle,
  SquarePen,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type Header = {
  _id: string;
  name: string;
  stok: number;
  harga: number;
};

export const Report = () => {
  const navigate = useNavigate();
  const {
    data: products,
    error,
    mutate,
  } = useSWR("http://localhost:7700/api/product/", fetcher);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const productColumns: ColumnDef<Header>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          variant="primary"
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          variant="primary"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 30,
    },
    {
      id: "Product Code",
      accessorKey: "_id",
      header: ({ column }) => {
        return (
          <Button
            className="px-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Product Code
            {column.getIsSorted() === "asc" ? (
              <ArrowUpWideNarrow className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const id = row.original._id;
        return <div className="uppercase">{id}</div>;
      },
    },
    {
      id: "Product Name",
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            className="px-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Product Name
            {column.getIsSorted() === "asc" ? (
              <ArrowUpWideNarrow className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const name = row.original.name;
        return <div className="uppercase">{name}</div>;
      },
    },
    {
      id: "Stok",
      accessorKey: "stok",
      header: ({ column }) => {
        return (
          <Button
            className="px-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Stok
            {column.getIsSorted() === "asc" ? (
              <ArrowUpWideNarrow className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const stok = row.original.stok.toLocaleString();
        return <div className="uppercase">{stok}</div>;
      },
    },
    {
      id: "Product Price",
      accessorKey: "harga",
      header: ({ column }) => {
        return (
          <Button
            className="px-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Product Price
            {column.getIsSorted() === "asc" ? (
              <ArrowUpWideNarrow className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const harga = row.original.harga.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        });
        return <div className="uppercase">{harga}</div>;
      },
    },
  ];

  const selectedRowIds = Object.keys(rowSelection);
  const selectedProductId =
    selectedRowIds.length === 1 ? products[selectedRowIds[0]]?._id : undefined;

  const selectedData = products || [];
  const columns = productColumns || [];

  const table = useReactTable({
    data: selectedData || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });
  return (
    <>
      {error ? (
        <div
          className="bg-white w-full h-full rounded-lg shadow-lg p-5 items-center justify-center overflow-hidden flex flex-col"
          style={{ maxHeight: "100vh" }}
        >
          <div className="flex items-center gap-2">
            <p>Failed to load data</p>
            <TriangleAlert size={30} color="white" fill="orange" />
          </div>
        </div>
      ) : (
        <>
          {products ? (
            <div
              className="bg-white w-full h-full rounded-lg shadow-lg p-5 items-center overflow-hidden flex flex-col"
              style={{ maxHeight: "100vh" }}
            >
              <div className="grid grid-cols-12 w-full mb-4">
                <div className="col-span-4">
                  <SearchDataTable
                    table={table}
                    placeholder="Search by Product Name"
                    columnAccessor={"Product Name"}
                  />
                </div>
                <div className="col-span-5"></div>
                <div className="col-span-3">
                  <a
                    href="/admin/product/save"
                    className="flex items-center gap-2 px-4 py-2 bg-dark text-white text-sm font-medium rounded-md"
                  >
                    <PlusCircle size={20} />
                    Add New Product
                  </a>
                </div>
              </div>
              <div className="flex-none w-full flex justify-between items-center mb-2">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="flex items-center gap-2 text-sm font-medium text-black">
                    {Object.keys(rowSelection).length} Selected
                  </div>
                  |
                  <Link
                    to="/admin/product/save"
                    state={{ productId: selectedProductId }}
                  >
                    <button
                      className={`flex items-center gap-2 text-sm font-medium ${
                        selectedProductId
                          ? "text-black"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!selectedProductId}
                    >
                      <SquarePen size={15} />
                      Edit
                    </button>
                  </Link>
                </div>
                <div className="flex gap-3">
                  {/* <DatePicker
                    daterange
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                  /> */}
                  <ColumnVisibility table={table} />
                  <ShowEntries table={table} />
                </div>
              </div>
              <div className="w-full overflow-auto h-full">
                <DataTable table={table} columns={columns} />
              </div>
            </div>
          ) : (
            <div
              className="bg-white w-full h-full rounded-lg shadow-lg p-5 items-center overflow-hidden flex flex-col"
              style={{ maxHeight: "100vh" }}
            >
              <div className="grid grid-cols-12 w-full mb-4">
                <div className="col-span-4">
                  <Skeleton className="h-12 w-full" />
                </div>
                <div className="col-span-5"></div>
                <div className="col-span-3">
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
              <div className="flex-none w-full flex justify-between items-center mb-2">
                <div className="flex w-full gap-2 text-gray-500">
                  <Skeleton className="h-6 w-[70px]" />
                  <Skeleton className="h-6 w-[3px]" />
                  <Skeleton className="h-6 w-[70px]" />
                </div>
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-[150px]" />
                  <Skeleton className="h-10 w-[150px]" />
                </div>
              </div>
              <div className="w-full h-full">
                <div className="">
                  <Skeleton className="h-10 w-1/3 mb-4" />
                </div>
                <div className="">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Report;
