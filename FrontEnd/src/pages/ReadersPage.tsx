import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import Dialog from "../components/Dialog";
import type { Reader } from "../types/Reader";
import ReaderTable from "../components/tables/ReaderTable";
import ReaderForm from "../components/forms/ReaderForm";
import axios from "axios";
import toast from "react-hot-toast";
import { addReader, deleteReader, getAllReaders, updateReader } from "../services/readerService";

const ReadersPage: React.FC = () => {
  const [readers, setReaders] = useState<Reader[]>([]);
  const [isReadersLoading, setIsReadersLoading] = useState<boolean>(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReader, setSelectedReader] = useState<Reader | null>(null);

  const fetchAllReaders = async () => {
    try {
      setIsReadersLoading(true);
      const result = await getAllReaders();
      setReaders(result);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsReadersLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReaders();
  }, []);

  const removeReader = async (id: string) => {
    await deleteReader(id);
  };

  const handleAddReader = () => {
    setSelectedReader(null);
    setIsAddDialogOpen(true);
  };

  const handleEditReader = (reader: Reader) => {
    setSelectedReader(reader);
    setIsEditDialogOpen(true);
  };

  const handleDeleteReader = (reader: Reader) => {
    setSelectedReader(reader);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (readerData: Omit<Reader, "_id">) => {
    if (selectedReader) {
      try {
        const updatedReader = await updateReader(selectedReader._id, readerData);
        setReaders((prev) =>
          prev.map((reader) => (reader._id === selectedReader._id ? updatedReader : reader))
        );
        setIsEditDialogOpen(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong");
        }
      }
    } else {
      // Add new reader
      try {
        const newReader = await addReader(readerData);
        setReaders((prev) => [...prev, newReader]);
        setIsAddDialogOpen(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong");
        }
      }
    }
    setSelectedReader(null);
  };

  const confirmDelete = async () => {
    if (selectedReader) {
      try {
        await removeReader(selectedReader._id);
        fetchAllReaders();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong");
        }
      } finally {
        setIsDeleteDialogOpen(false);
        setSelectedReader(null);
      }
    }
  };

  const cancelDialog = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedReader(null);
  };

  if (isReadersLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className="max-w-full md:max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Readers Management</h1>
          <button
            onClick={handleAddReader}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-150"
          >
            <MdAdd className="w-5 h-5" />
            <span>Add Reader</span>
          </button>
        </div>

        {/* Readers Table */}
        <ReaderTable readers={readers} onEdit={handleEditReader} onDelete={handleDeleteReader} />

        {/* Add Reader Dialog */}
        <Dialog
          isOpen={isAddDialogOpen}
          onCancel={cancelDialog}
          onConfirm={() => {
            const form = document.querySelector("form") as HTMLFormElement;
            if (form) {
              form.requestSubmit();
            }
          }}
          title="Add New Reader"
        >
          <ReaderForm onSubmit={handleFormSubmit} />
        </Dialog>

        {/* Edit Reader Dialog */}
        <Dialog
          isOpen={isEditDialogOpen}
          onCancel={cancelDialog}
          onConfirm={() => {
            const form = document.querySelector("form") as HTMLFormElement;
            if (form) {
              form.requestSubmit();
            }
          }}
          title="Edit Reader"
        >
          <ReaderForm reader={selectedReader} onSubmit={handleFormSubmit} />
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog isOpen={isDeleteDialogOpen} onCancel={cancelDialog} onConfirm={confirmDelete} title="Delete Reader">
          <p className="text-gray-700">
            Are you sure you want to delete <strong>{selectedReader?.name}</strong>? This action cannot be undone.
          </p>
        </Dialog>
      </div>
    </div>
  );
};

export default ReadersPage;