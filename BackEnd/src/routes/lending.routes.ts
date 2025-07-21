import { Router } from "express";
import {
    createLending,
    completeLending,
    getLendings,
    getLendingById,
    updateLending,
    deleteLending,
    getLendingHistoryByBook,
    getLendingHistoryByReader,
    getOverdueReaders,
    getOverdueBooksByReader,
    sendOverdueNotification
} from "../controllers/lending.controller";

const router = Router();

// Lending CRUD
router.post("/", createLending);
router.patch("/complete/:id", completeLending);
router.get("/", getLendings);
router.get("/:id", getLendingById);
router.put("/:id", updateLending);
router.delete("/:id", deleteLending);

// Lending history
router.get("/history/book/:bookId", getLendingHistoryByBook);
router.get("/history/reader/:readerId", getLendingHistoryByReader);

// Overdue management
router.get("/overdue/readers", getOverdueReaders);
router.get("/overdue/reader/:readerId", getOverdueBooksByReader);
router.post("/overdue/notify", sendOverdueNotification);

export default router;
