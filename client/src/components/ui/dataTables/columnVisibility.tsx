import React from 'react'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../dropdown-menu'
import { Button } from '../button'
import { ListFilter } from 'lucide-react'
import { Table } from '@tanstack/react-table';
import { cn } from '@/lib/utils';

interface DropdownVisibilityProps<TData> {
  table: Table<TData>;
  size?: "default" | "icon" | "sm" | "lg";
  className?: string;
} 

const columnVisibility = <TData,>({ table, size, className }: DropdownVisibilityProps<TData>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="dropdown" size={size} className={cn(className, "font-medium")}>
          <ListFilter className="pe-2" size={25} />Hide Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent  style={{ maxHeight: '15rem', overflowY: 'auto' }} className="w-56 max-h-60 overflow-y-auto">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) =>
                column.toggleVisibility(!!value)
              }
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default columnVisibility
