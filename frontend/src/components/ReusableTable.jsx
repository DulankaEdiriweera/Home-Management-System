import React, { useState } from "react";

const ReusableTable = ({ columns, data, onRowClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Calculate total pages
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Get current page rows
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = data.slice(startIndex, startIndex + rowsPerPage);

  // Function to determine row background color based on stock and expiry date
  const getRowClassName = (row) => {
    const today = new Date();
    const expiryDate = new Date(row.expiryDate);
    const timeDiff = expiryDate - today;
    const daysToExpiry = timeDiff / (1000 * 3600 * 24);

    if ((row.quantity <= row.minimumLevel) && (daysToExpiry <= 3)) {
      return "bg-gradient-to-r from-red-100 to-orange-100"; 
      ;  
    } else if (daysToExpiry <= 3) {
      return "bg-gradient-to-r from-red-300 via-red-400 to-red-300"; // Close to expiry
    } else if (row.quantity <= row.minimumLevel) {
      return "bg-gradient-to-r from-orange-100 via-orange-300 to-orange-100"; // Low stock
    }
    return ""; // Default (no color)
    
    
    
    
    
  };


  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
        {/* Table Header */}
        <thead className="bg-gradient-to-r from-blue-400 to-blue-400 text-white">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left font-semibold uppercase tracking-wide"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {currentRows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`border-b last:border-b-0 ${
                getRowClassName(row) || (rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white")
              } hover:bg-indigo-50 transition-all ${
                onRowClick ? "cursor-pointer" : ""
              }`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4 text-gray-800">
                  {row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReusableTable;
