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
            return next(new APIError(404, "Book not found"));
        }
        if (book.availableCopies < 1) {
            return next(new APIError(400, "No available copies for this book"));
        }
        // Decrement availableCopies
        book.availableCopies -= 1;
        await book.save();

        // validate Reader ID
        const { readerId } = req.body;
        const Reader = await ReaderModel.findById(readerId);
        if (!Reader) {
            return next(new APIError(404, "Reader not found"));
        }

        // Create lending record
        const lending = new LendingModel(req.body);
        
        // Set default due date to 14 days from now
        lending.dueDate = new Date();
        lending.dueDate.setDate(lending.dueDate.getDate() + 14);

        lending.bookTitle = book.title;
        lending.readerName = Reader.name;
        
        await lending.save();
        res.status(201).json(lending);
    } catch (error: any) {
        next(new APIError(400, error.message));
    }
};


//complete lending 
export const completeLending = async (req: Request, res: Response, next: NextFunction) => {
    try {   
        const lending = await LendingModel.findById(req.params.id);

        if (!lending) return next(new APIError(404, "Lending not found"));

        if (lending.returnDate) {
            return next(new APIError(400, "Lending already completed"));
        }

        // Increment availableCopies of the book
        const book = await BookModel.findById(lending.bookId);
        if (book) {
            book.availableCopies += 1;
            await book.save();
        }

        // Mark lending as completed
        lending.returnDate = new Date();
        lending.status = "returned"; //Set status to returned
        await lending.save();
        
        res.json(lending);

    } catch (error: any) {
        next(new APIError(400, error.message));
    }
};

// Get all lending records
export const getLendings = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const lendings = await LendingModel.find().sort({ _id: -1 });
        res.json(lendings);
    } catch (error: any) {
        next(new APIError(500, error.message));
    }
};

// Get a single lending record by ID
export const getLendingById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lending = await LendingModel.findById(req.params.id);
        if (!lending) return next(new APIError(404, "Lending not found"));
        res.json(lending);
    } catch (error: any) {
        next(new APIError(500, error.message));
    }
};

// Update a lending record by ID
export const updateLending = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lending = await LendingModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!lending) return next(new APIError(404, "Lending not found"));
        res.json(lending);
    } catch (error: any) {
        next(new APIError(400, error.message));
    }
};

// Delete a lending record by ID
export const deleteLending = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lending = await LendingModel.findById(req.params.id);
        if (!lending) return next(new APIError(404, "Lending not found"));
        if (lending.status !== "returned") {
            return next(new APIError(400, "Only lendings with status 'returned' can be deleted"));
        }
        await LendingModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Lending deleted successfully" });
    } catch (error: any) {
        next(new APIError(500, error.message));
    }
};

// Get lending history by book
export const getLendingHistoryByBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lendings = await LendingModel.find({ bookId: req.params.bookId });
        res.json(lendings);
    } catch (error: any) {
        next(new APIError(500, error.message));
    }
};

// Get lending history by reader
export const getLendingHistoryByReader = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lendings = await LendingModel.find({ readerId: req.params.readerId });
        res.json(lendings);
    } catch (error: any) {
        next(new APIError(500, error.message));
    }
};

// Get overdue by reader
export const getOverdueBooksByReader = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reader = await ReaderModel.findById(req.params.readerId);
        if (!reader) return next(new APIError(404, "Reader not found"));
        const now = new Date();
        // Update status to "overdue" for all overdue lendings for this reader
        await LendingModel.updateMany(
            {
                readerId: req.params.readerId,
                dueDate: { $lt: now },
                returnDate: null
            },
            { $set: { status: "overdue" } }
        );
        const overdueBooks = await LendingModel.find({
            readerId: req.params.readerId,
            dueDate: { $lt: now },
            returnDate: null
        });
        res.json(overdueBooks);
    } catch (error: any) {
        next(new APIError(500, error.message));
    }
};

// Send overdue notification email
export const sendOverdueNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { lendingId } = req.params;
        if (!lendingId) {
            return next(new APIError(400, "Missing lendingId"));
        }

        // Find the lending record
        const lending = await LendingModel.findById(lendingId);
        if (!lending) {
            return next(new APIError(404, "Lending not found"));
        }

        // Find the reader
        const reader = await ReaderModel.findById(lending.readerId);
        if (!reader || !reader.email) {
            return next(new APIError(404, "Reader or reader email not found"));
        }

        // Compose subject and text
        const subject = `Overdue Notice: Book "${lending.bookTitle}"`;
        const text = `Dear ${lending.readerName},\n\n` +
            `This is a reminder that the book "${lending.bookTitle}",\n` +
            `you borrowed is overdue.\n` +
            `Due Date: ${lending.dueDate ? new Date(lending.dueDate).toLocaleDateString() : "N/A"}\n\n` +
            `Please return the book as soon as possible.\n\n` +
            `Thank you,\nBook Club Library`;

        // Send the email
        const mailResponse = await sendMail.sendMail(reader.email, subject, text);
        res.status(200).json({ message: "Email sent successfully", response: mailResponse });
    } catch (error: any) {
        next(new APIError(500, error.message));
    }
};

// Get all overdue lending details
export const getOverdueLendings = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const now = new Date();
        // Update status to "overdue" for all matching lendings
        await LendingModel.updateMany(
            { dueDate: { $lt: now }, returnDate: null },
            { $set: { status: "overdue" } }
        );
        const overdueLendings = await LendingModel.find({
            dueDate: { $lt: now },
            returnDate: null
        });
        res.json(overdueLendings);
    } catch (error: any) {
        next(new APIError(500, error.message));
    }
};

// get overdue count
export const getOverdueCount = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const now = new Date();
        const overdueCount = await LendingModel.countDocuments({
            dueDate: { $lt: now },
            returnDate: null
        });
        res.json({ overdueCount });
    } catch (error: any) {
        next(new APIError(500, error.message));
    }
};

export const getLendingCount = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const count = await LendingModel.countDocuments();
        res.json({ count });
    } catch (error: any) {
        next(new APIError(500, error.message));
    }
};

