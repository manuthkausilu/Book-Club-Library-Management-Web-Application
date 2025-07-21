import { Request, Response, NextFunction } from "express";
import { LendingModel } from "../models/Lending";
import { BookModel } from "../models/Book"; 
import { APIError } from "../errors/ApiError"; 
import { ReaderModel } from "../models/Reader";
import sendMail from "../service/mail.service";

// Create a new lending record
export const createLending = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bookId } = req.body;
        // Check book availability
        const book = await BookModel.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        if (book.availableCopies < 1) {
            return res.status(400).json({ error: "No available copies for this book" });
        }
        // Decrement availableCopies
        book.availableCopies -= 1;
        await book.save();

        // validate Reader ID
        const { readerId } = req.body;
        const Reader = await ReaderModel.findById(readerId);
        if (!Reader) {
            return res.status(404).json({ error: "Reader not found" });
        }

        // Create lending record
        const lending = new LendingModel(req.body);
        
        // Set default due date to 14 days from now
        lending.dueDate = new Date();
        lending.dueDate.setDate(lending.dueDate.getDate() + 14);
        await lending.save();
        res.status(201).json(lending);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};


//complete lending 
export const completeLending = async (req: Request, res: Response, next: NextFunction) => {
    try {   
        const lending = await LendingModel.findById(req.params.id);

        if (!lending) return res.status(404).json({ error: "Lending not found" });

        if (lending.returnDate) {
            return res.status(400).json({ error: "Lending already completed" });
        }

        // Increment availableCopies of the book
        const book = await BookModel.findById(lending.bookId);
        if (book) {
            book.availableCopies += 1;
            await book.save();
        }

        // Mark lending as completed
        lending.returnDate = new Date();
        lending.status = "returned"; // <-- Set status to 'returned'
        await lending.save();
        
        res.json(lending);

    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Get all lending records
export const getLendings = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const lendings = await LendingModel.find().sort({ _id: -1 });
        res.json(lendings);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single lending record by ID
export const getLendingById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lending = await LendingModel.findById(req.params.id);
        if (!lending) return res.status(404).json({ error: "Lending not found" });
        res.json(lending);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Update a lending record by ID
export const updateLending = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lending = await LendingModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!lending) return res.status(404).json({ error: "Lending not found" });
        res.json(lending);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a lending record by ID
export const deleteLending = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lending = await LendingModel.findByIdAndDelete(req.params.id);
        if (!lending) return res.status(404).json({ error: "Lending not found" });
        res.json({ message: "Lending deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get lending history by book
export const getLendingHistoryByBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lendings = await LendingModel.find({ bookId: req.params.bookId });
        res.json(lendings);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get lending history by reader
export const getLendingHistoryByReader = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lendings = await LendingModel.find({ readerId: req.params.readerId });
        res.json(lendings);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get readers with overdue books
export const getOverdueReaders = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const now = new Date();
        const overdue = await LendingModel.aggregate([
            { $match: { dueDate: { $lt: now }, returnDate: null } },
            { $group: { _id: "$readerId", overdueCount: { $sum: 1 } } }
        ]);
        res.json(overdue);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get overdue books for a reader
export const getOverdueBooksByReader = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reader = await ReaderModel.findById(req.params.readerId);
        if (!reader) return res.status(404).json({ error: "Reader not found" });
        const now = new Date();
        const overdueBooks = await LendingModel.find({
            readerId: req.params.readerId,
            dueDate: { $lt: now },
            returnDate: null
        });
        res.json(overdueBooks);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const sendOverdueNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { to, subject, text } = req.body;
        if (!to || !subject || !text) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Call the sendMail function from mail.service
        const mailResponse = await sendMail.sendMail(to, subject, text);
        res.status(200).json({ message: "Email sent successfully", response: mailResponse });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

