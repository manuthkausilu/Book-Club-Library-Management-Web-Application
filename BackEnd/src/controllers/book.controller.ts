import { NextFunction, Request, Response } from "express";
import { BookModel } from "../models/Book";
import { APIError } from "../errors/ApiError";

// Create a new book
export const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = new BookModel(req.body);
        await book.save();
        res.status(201).json(book);
    } catch (error: any) {
        next(new APIError(400, error.message));
    }
};

// Get all books
export const getBooks = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await BookModel.find().sort({ _id: -1 }); // Descending order
        res.json(books);
    } catch (error: any) {
        next(new APIError(500, error.message));
    }
};

// Get a single book by ID
export const getBookById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await BookModel.findById(req.params.id);
        if (!book) return res.status(404).json({ error: "Book not found" });
        res.json(book);
    } catch (error: any) {
        next(new APIError(500, error.message));
    }
};

// Update a book by ID
export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await BookModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!book) return res.status(404).json({ error: "Book not found" });
        res.json(book);
    } catch (error: any) {
        next(new APIError(400, error.message));
    }
};

// Delete a book by ID
export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await BookModel.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ error: "Book not found" });
        res.json({ message: "Book deleted successfully" });
    } catch (error: any) {
        next(new APIError(500, error.message));
    }
};