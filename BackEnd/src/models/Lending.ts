import mongoose from "mongoose";

const lendingSchema = new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }, // <-- single book
    readerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reader', required: true },
    borrowDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date },
    status: { type: String, enum: ['borrowed', 'returned', 'overdue'], default: 'borrowed' },
}, {
    timestamps: true
});

export const LendingModel = mongoose.model("Lending", lendingSchema);
