import React from "react";
import type { Lending } from "../../types/Lending";
import { MdCheckCircle, MdDelete } from "react-icons/md";

interface LendingTableProps {
  lendings: Lending[];
  onComplete: (lending: Lending) => void;
  onDelete: (lending: Lending) => void;
}

const LendingTable: React.FC<LendingTableProps> = ({ lendings, onComplete, onDelete }) => {
  const handleComplete = (lending: Lending) => {
    onComplete(lending);
  };

  const handleDelete = (lending: Lending) => {
    onDelete(lending);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {/* Removed Book Id and Reader Id columns */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reader Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrow Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {lendings.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                No lending records found
              </td>
            </tr>
          ) : (
            lendings.map((lending) => (
              <tr key={lending._id} className="hover:bg-gray-50">
                {/* Removed Book Id and Reader Id cells */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lending.bookTitle}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lending.readerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lending.borrowDate ? new Date(lending.borrowDate).toLocaleDateString() : ""}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lending.dueDate ? new Date(lending.dueDate).toLocaleDateString() : ""}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lending.returnDate ? new Date(lending.returnDate).toLocaleDateString() : "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm capitalize text-gray-900">{lending.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {["borrowed", "overdue"].includes(lending.status) && (
                      <button
                        onClick={() => handleComplete(lending)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-100 transition duration-150"
                        title="Complete"
                      >
                        <MdCheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(lending)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 transition duration-150"
                      title="Delete"
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LendingTable;
