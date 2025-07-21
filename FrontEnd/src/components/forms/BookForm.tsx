import React, { useState, useEffect } from "react";
import type { Book } from "../../types/Book";

interface BookFormProps {
  book?: Book | null;
  onSubmit: (bookData: Omit<Book, "_id">) => void;
}

interface FormErrors {
  title?: string;
  author?: string;
  publishedDate?: string;
  genre?: string;
  availableCopies?: string;
}

const BookForm = ({ book, onSubmit }: BookFormProps) => {
  const [formData, setFormData] = useState<{
    title: string;
    author: string;
    publishedDate: string;
    genre: string;
    availableCopies: number;
  }>({
    title: "",
    author: "",
    publishedDate: new Date().toISOString().split("T")[0],
    genre: "",
    availableCopies: 1,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        publishedDate: typeof book.publishedDate === "string"
          ? book.publishedDate
          : new Date(book.publishedDate).toISOString().split("T")[0],
        genre: book.genre,
        availableCopies: book.availableCopies,
      });
    } else {
      setFormData({
        title: "",
        author: "",
        publishedDate: new Date().toISOString().split("T")[0],
        genre: "",
        availableCopies: 1,
      });
    }
    setErrors({});
  }, [book]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.author.trim()) {
      newErrors.author = "Author is required";
    }
    if (!formData.publishedDate) {
      newErrors.publishedDate = "Published date is required";
    }
    if (!formData.genre.trim()) {
      newErrors.genre = "Genre is required";
    }
    if (
      formData.availableCopies === undefined ||
      formData.availableCopies === null ||
      isNaN(Number(formData.availableCopies)) ||
      Number(formData.availableCopies) < 0
    ) {
      newErrors.availableCopies = "Available copies must be a non-negative number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        availableCopies: Number(formData.availableCopies),
        publishedDate: formData.publishedDate,
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "availableCopies" ? Number(value) : value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.title ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Enter book title"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
          Author
        </label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.author ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Enter author name"
        />
        {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author}</p>}
      </div>

      <div>
        <label htmlFor="publishedDate" className="block text-sm font-medium text-gray-700 mb-1">
          Published Date
        </label>
        <input
          type="date"
          id="publishedDate"
          name="publishedDate"
          value={formData.publishedDate}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.publishedDate ? "border-red-300" : "border-gray-300"
          }`}
          required
        />
        {errors.publishedDate && <p className="mt-1 text-sm text-red-600">{errors.publishedDate}</p>}
      </div>

      <div>
        <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
          Genre
        </label>
        <input
          type="text"
          id="genre"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.genre ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Enter genre"
        />
        {errors.genre && <p className="mt-1 text-sm text-red-600">{errors.genre}</p>}
      </div>

      <div>
        <label htmlFor="availableCopies" className="block text-sm font-medium text-gray-700 mb-1">
          Available Copies
        </label>
        <input
          type="number"
          id="availableCopies"
          name="availableCopies"
          value={formData.availableCopies}
          onChange={handleChange}
          min={0}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.availableCopies ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Enter available copies"
        />
        {errors.availableCopies && <p className="mt-1 text-sm text-red-600">{errors.availableCopies}</p>}
      </div>

      <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        Submit
      </button>
    </form>
  );
};

export default BookForm;