import type { Book } from "../types/Book";
import apiClient from "./apiClient";

export const getAllBooks = async (): Promise<Book[]> => {
  const response = await apiClient.get("/book");
  return response.data;
};

export const deleteBook = async (_id: string): Promise<void> => {
  await apiClient.delete(`/book/${_id}`);
};

export const addBook = async (bookData: Omit<Book, "_id">): Promise<Book> => {
  const response = await apiClient.post("/book", bookData);
  return response.data;
};

export const updateBook = async (_id: string, bookData: Omit<Book, "_id">) => {
  const response = await apiClient.put(`/book/${_id}`, bookData);
  return response.data;
};
