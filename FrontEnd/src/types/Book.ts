export type Book = {
    _id: string;
    title: string;
    author: string;
    publishedDate: Date;
    genre: string;
    availableCopies: number;
};

export type BookFormData = {
    title: string;
    author: string;
    publishedDate: string;
    genre: string;
    availableCopies: number;
};