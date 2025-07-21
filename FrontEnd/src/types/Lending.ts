export type Lending = {
  _id?: string;
  bookId: string;
  readerId: string;
  borrowDate?: string;
  dueDate: string;
  returnDate?: string;
  status?: "borrowed" | "returned" | "overdue";
  createdAt?: string;
  updatedAt?: string;
};
