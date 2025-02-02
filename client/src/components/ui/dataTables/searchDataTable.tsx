import { Search } from "lucide-react";
import React from "react";

interface SearchDataTableProps {
  table: any; // Tipe yang sesuai
  placeholder: string;
  columnAccessor: string;
}

const SearchDataTable: React.FC<SearchDataTableProps> = ({
  table,
  placeholder,
  columnAccessor,
}) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="text-gray-500" size={20} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => {
          const column = table.getColumn(columnAccessor);
          if (column) {
            console.log('Setting filter value:', e.target.value);
            column.setFilterValue(e.target.value);
          } else {
            console.error('Column not found:', columnAccessor);
          }
        }}
        className="bg-secondary w-full py-2 pl-10 pr-3 rounded-lg focus:border-secondary focus:outline-none"
      />
    </div>
  );
};


export default SearchDataTable;
