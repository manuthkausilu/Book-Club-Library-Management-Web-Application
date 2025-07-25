import React, { useEffect, useState } from "react";
import AdminForm from "../components/forms/AdminForm";
import UserTable from "../components/tables/UserTable";
import Dialog from "../components/Dialog";
import { getAllUsers, deleteUser, adminSignUp } from "../services/authService";
import type { User } from "../types/User";
import toast from "react-hot-toast";

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    userId: string | null;
  }>({ open: false, userId: null });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (userId: string) => {
    setConfirmDialog({ open: true, userId });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.userId) return;
    try {
      await deleteUser(confirmDialog.userId);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setConfirmDialog({ open: false, userId: null });
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ open: false, userId: null });
  };

  const handleAdminSignUp = async (values: Omit<User, "role">) => {
    try {
      await adminSignUp(values);
      toast.success("Admin created");
      fetchUsers();
    } catch {
      toast.error("Failed to create admin");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Create Admin</h2>
        <AdminForm onSubmit={handleAdminSignUp} />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">All Users</h2>
        <UserTable users={users} loading={loading} onDelete={handleDelete} />
      </div>
      <Dialog
        isOpen={confirmDialog.open}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete User"
      >
        <p className="text-gray-700">
          Are you sure you want to delete this user? This action cannot be undone.
        </p>
      </Dialog>
    </div>
  );
};

export default UserPage;