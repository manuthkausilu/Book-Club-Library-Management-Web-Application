import React from "react";
import type { User } from "../../types/User";
import { MdDelete } from "react-icons/md";

interface UserTableProps {
  users: User[];
  loading?: boolean;
  onDelete: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, loading, onDelete }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {loading ? (
          <tr>
            <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
              Loading...
            </td>
          </tr>
        ) : users.length === 0 ? (
          <tr>
            <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
              No users found
            </td>
          </tr>
        ) : (
          users.map((user) => (
            <tr key={user._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm capitalize text-gray-900">{user.role}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onDelete(user._id!)}
                  className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 transition duration-150"
                  title="Delete"
                >
                  <MdDelete className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default UserTable;
