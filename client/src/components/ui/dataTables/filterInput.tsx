import React from 'react';

interface FilterInputProps {
  placeholder: string;
  columnAccessor: string;
  table: any; // Adjust the type according to your table type if needed
}

const FilterInput: React.FC<FilterInputProps> = ({ placeholder, columnAccessor, table }) => {
  const column = table.getColumn(columnAccessor);

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={(column?.getFilterValue() as string) ?? ""}
      onChange={(event) => column?.setFilterValue(event.target.value)}
      className="bg-secondary w-full py-2 pl-10 pr-3 rounded-lg focus:border-secondary focus:outline-none"
    />
  );
};

export default FilterInput;
