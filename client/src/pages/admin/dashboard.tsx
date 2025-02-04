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
import { DataTable } from "../../components/ui/dataTable";
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
  Boxes,
  PlusCircle,
  SquarePen,
  TriangleAlert,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type Header = {
  _id: string;
  name: string;
  stok: number;
  harga: number;
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const { data: products } = useSWR(
    "http://localhost:7700/api/product/",
    fetcher
  );
  const { data: users } = useSWR("http://localhost:7700/api/users", fetcher);

  const { data: user } = useSWR("http://localhost:7700/api/auth/token", fetcher);

  console.log(user);

  const handleProductCardClick = () => {
    navigate("/admin/product");
  };

  const handleUserCardClick = () => {
    navigate("/admin/users");
  };

  return (
    <div className="bg-white h-full w-full rounded-lg shadow-md p-5 overflow-hidden flex flex-col">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <p>Welcome, {}</p>
        </div>
        <div className="col-span-6">
          <Card
            onClick={handleProductCardClick}
            className="hover:cursor-pointer hover:scale-105 hover:translate-x-3 hover:translate-y-1 hover:bg-primary hover:text-lighter transition"
          >
            <CardHeader>
              <CardTitle>
                <div className="flex gap-3 items-center text-xl font-semibold">
                  <Boxes size={30} />
                  Product
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold">
                {products ? products.length : "0"}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-6">
          <Card
            onClick={handleUserCardClick}
            className="hover:cursor-pointer hover:scale-105 hover:translate-x-3 hover:translate-y-1 hover:bg-primary hover:text-lighter transition"
          >
            <CardHeader>
              <CardTitle>
                <div className="flex gap-3 items-center text-xl font-semibold">
                  <Users size={30} />
                  Users
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold">
                {users ? users.length : "0"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* {error ? (
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
                    placeholder="Search by Bank Number"
                    columnAccessor={"Bank Number"}
                  />
                </div>
                <div className="col-span-5"></div>
                <div className="col-span-3">
                  <a
                    href="/finance/bank-account/save"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md"
                  >
                    <PlusCircle size={20} />
                    Add New Rekening
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
                    to="/finance/bank-account/save"
                    state={{ bankId: selectedProductId }}
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
                  <ColumnVisibility table={table} />
                  <ShowEntries table={table} />
                </div>
              </div>
              <div className="w-full overflow-auto h-full">
                <DataTable table={table} columns={columns} />
              </div>
            </div>
          ) : (
            ""
          )}
        </>
      )} */}
    </div>
  );
};

export default Dashboard;
