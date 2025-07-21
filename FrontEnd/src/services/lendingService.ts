import type { Lending } from "../types/Lending";
import apiClient from "./apiClient";

export const getAllLendings = async (): Promise<Lending[]> => {
  const response = await apiClient.get("/lending");
  return response.data;
};

export const getLendingById = async (id: string): Promise<Lending> => {
  const response = await apiClient.get(`/lending/${id}`);
  return response.data;
};

export const addLending = async (lendingData: Omit<Lending, "_id" | "status" | "borrowDate" | "returnDate" | "createdAt" | "updatedAt">): Promise<Lending> => {
  const response = await apiClient.post("/lending", lendingData);
  return response.data;
};

export const completeLending = async (id: string): Promise<Lending> => {
  const response = await apiClient.patch(`/lending/complete/${id}`);
  return response.data;
};

export const updateLending = async (id: string, lendingData: Partial<Lending>): Promise<Lending> => {
  const response = await apiClient.put(`/lending/${id}`, lendingData);
  return response.data;
};

export const deleteLending = async (id: string): Promise<void> => {
  await apiClient.delete(`/lending/${id}`);
};

export const getLendingHistoryByBook = async (bookId: string): Promise<Lending[]> => {
  const response = await apiClient.get(`/lending/history/book/${bookId}`);
  return response.data;
};

export const getLendingHistoryByReader = async (readerId: string): Promise<Lending[]> => {
  const response = await apiClient.get(`/lending/history/reader/${readerId}`);
  return response.data;
};

export const getOverdueReaders = async () => {
  const response = await apiClient.get("/lending/overdue/readers");
  return response.data;
};

export const getOverdueBooksByReader = async (readerId: string) => {
  const response = await apiClient.get(`/lending/overdue/reader/${readerId}`);
  return response.data;
};

export const sendOverdueNotification = async (mailData: { to: string; subject: string; text: string }) => {
  const response = await apiClient.post("/lending/overdue/notify", mailData);
  return response.data;
};
