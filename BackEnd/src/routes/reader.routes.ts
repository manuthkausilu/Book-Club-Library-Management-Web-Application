import { Router } from "express";
import { 
     createReader,
     getReaders,
     getReaderById,
     updateReader,
     deleteReader } from "../controllers/reader.controller";
import { authenticateToken } from "../middlewares/authenticateToken";

const readerRouter = Router();

readerRouter.post("/", authenticateToken, createReader);
readerRouter.get("/", authenticateToken, getReaders);
readerRouter.get("/:id", authenticateToken, getReaderById);
readerRouter.put("/:id", authenticateToken, updateReader);
readerRouter.delete("/:id", authenticateToken, deleteReader);

export default readerRouter;   