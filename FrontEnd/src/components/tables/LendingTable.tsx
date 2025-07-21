import React from "react";
import type { Lending } from "../../types/Lending";

interface LendingTableProps {
  lendings: Lending[];
  onComplete: (lending: Lending) => void;
  onDelete: (lending: Lending) => void;
}

const LendingTable: React.FC<LendingTableProps> = ({ lendings, onComplete, onDelete }) => {
  // No alert/confirm, just call the handlers directly
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reader</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrow Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Return Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {lendings.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-gray-500">No lending records found</td>
            </tr>
          ) : (
            lendings.map((lending) => (
              <tr key={lending._id}>
                <td className="px-6 py-4">{lending.bookId}</td>
                <td className="px-6 py-4">{lending.readerId}</td>
                <td className="px-6 py-4">{lending.borrowDate ? new Date(lending.borrowDate).toLocaleDateString() : ""}</td>
                <td className="px-6 py-4">{lending.dueDate ? new Date(lending.dueDate).toLocaleDateString() : ""}</td>
                <td className="px-6 py-4">{lending.returnDate ? new Date(lending.returnDate).toLocaleDateString() : "-"}</td>
                <td className="px-6 py-4 capitalize">{lending.status}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    {lending.status === "borrowed" && (
                      <button
                        onClick={() => handleComplete(lending)}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(lending)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
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
