import React from "react";
import type { Lending } from "../../types/Lending";
import { MdEmail } from "react-icons/md";

interface OverdueTableProps {
  lendings: Lending[];
  sendingId: string | null;
  onSendMail: (lendingId: string) => void;
}

const OverdueTable: React.FC<OverdueTableProps> = ({ lendings, sendingId, onSendMail }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Title</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reader Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {lendings.length === 0 ? (
          <tr>
            <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
              No overdue lendings found.
            </td>
          </tr>
        ) : (
          lendings.map((lending) => (
            <tr key={lending._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lending.bookTitle}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lending.readerName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lending.dueDate ? new Date(lending.dueDate).toLocaleDateString() : "-"}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm capitalize text-gray-900">{lending.status}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onSendMail(lending._id!)}
                  disabled={sendingId === lending._id}
                  className={`p-1 rounded transition duration-150 ${
                    sendingId === lending._id
                      ? "bg-blue-100 text-blue-400"
                      : "text-blue-600 hover:text-blue-900 hover:bg-blue-100"
                  }`}
                  title="Send Mail"
                >
                  <MdEmail className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default OverdueTable;
