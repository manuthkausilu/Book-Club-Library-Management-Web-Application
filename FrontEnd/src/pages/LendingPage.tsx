import React, { useEffect, useState } from "react";
import LendingTable from "../components/tables/LendingTable";
import LendingForm from "../components/forms/LendingForm";
import Dialog from "../components/Dialog";
import type { Lending } from "../types/Lending";
import type { Book } from "../types/Book";
import type { Reader } from "../types/Reader";
import {
  getAllLendings,
  addLending,
  completeLending,
  deleteLending,
} from "../services/lendingService";
import { getAllBooks } from "../services/bookService";
import { getAllReaders } from "../services/readerService";
import toast from "react-hot-toast";

const LendingPage: React.FC = () => {
  const [lendings, setLendings] = useState<Lending[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [readers, setReaders] = useState<Reader[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "complete" | "delete" | null;
    lending: Lending | null;
  }>({ open: false, type: null, lending: null });

  const fetchAll = async () => {
    try {
      const [lendingsRes, booksRes, readersRes] = await Promise.all([
        getAllLendings(),
        getAllBooks(),
        getAllReaders(),
      ]);
      setLendings(lendingsRes);
      setBooks(booksRes);
      setReaders(readersRes);
    } catch (error) {
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAddLending = () => setIsAddDialogOpen(true);

  const handleFormSubmit = async (data: Omit<Lending, "_id" | "status" | "borrowDate" | "returnDate" | "createdAt" | "updatedAt">) => {
    try {
      await addLending(data);
      fetchAll();
      setIsAddDialogOpen(false);
      toast.success("Lending created");
    } catch (error) {
      toast.error("Failed to create lending");
    }
  };

  const handleComplete = (lending: Lending) => {
    setConfirmDialog({ open: true, type: "complete", lending });
  };

  const handleDelete = (lending: Lending) => {
    setConfirmDialog({ open: true, type: "delete", lending });
  };

  const handleConfirm = async () => {
    if (!confirmDialog.lending) return;
    try {
      if (confirmDialog.type === "complete") {
        await completeLending(confirmDialog.lending._id!);
        toast.success("Lending completed");
      } else if (confirmDialog.type === "delete") {
        await deleteLending(confirmDialog.lending._id!);
        toast.success("Lending deleted");
      }
      fetchAll();
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setConfirmDialog({ open: false, type: null, lending: null });
    }
  };

  const handleCancel = () => {
    setConfirmDialog({ open: false, type: null, lending: null });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Lending Management</h1>
          <button
            onClick={handleAddLending}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-150"
          >
            <span>Add Lending</span>
          </button>
        </div>
        <LendingTable lendings={lendings} onComplete={handleComplete} onDelete={handleDelete} />
        <Dialog
          isOpen={isAddDialogOpen}
          onCancel={() => setIsAddDialogOpen(false)}
          onConfirm={() => {
            const form = document.querySelector("form") as HTMLFormElement;
            if (form) form.requestSubmit();
          }}
          title="Add New Lending"
        >
          <LendingForm
            onSubmit={handleFormSubmit}
            books={books}
            readers={readers}
          />
        </Dialog>
        <Dialog
          isOpen={confirmDialog.open}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
          title={
            confirmDialog.type === "complete"
              ? "Complete Lending"
              : "Delete Lending"
          }
        >
          <p className="text-gray-700">
            {confirmDialog.type === "complete"
              ? "Are you sure you want to mark this lending as completed?"
              : "Are you sure you want to delete this lending record? This action cannot be undone."}
          </p>
        </Dialog>
      </div>
    </div>
  );
};

export default LendingPage;