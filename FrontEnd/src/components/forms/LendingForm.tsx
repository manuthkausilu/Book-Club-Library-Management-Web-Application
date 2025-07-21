import React, { useState } from "react";
import type { Lending } from "../../types/Lending";

interface LendingFormProps {
  onSubmit: (data: Omit<Lending, "_id" | "status" | "borrowDate" | "returnDate" | "createdAt" | "updatedAt">) => void;
  books: { _id: string; title: string }[];
  readers: { _id: string; name: string }[];
}

const LendingForm: React.FC<LendingFormProps> = ({ onSubmit, books, readers }) => {
  const [formData, setFormData] = useState({
    bookId: "",
    readerId: "",
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // default 14 days from now
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bookId || !formData.readerId || !formData.dueDate) {
      window.alert("Please fill all fields.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Book</label>
        <select name="bookId" value={formData.bookId} onChange={handleChange} required className="w-full border px-2 py-1 rounded">
          <option value="">Select Book</option>
          {books.map((book) => (
            <option key={book._id} value={book._id}>{book.title}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1">Reader</label>
        <select name="readerId" value={formData.readerId} onChange={handleChange} required className="w-full border px-2 py-1 rounded">
          <option value="">Select Reader</option>
          {readers.map((reader) => (
            <option key={reader._id} value={reader._id}>{reader.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1">Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
          required
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        Lend Book
      </button>
    </form>
  );
};

export default LendingForm;
