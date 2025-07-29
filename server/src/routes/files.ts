import { Router } from "express";
import { deleteFile, uploadFile } from "../controllers/filesController.js";

const fileRouter = Router();

// Create new folder
fileRouter.post("/upload-new", uploadFile);
fileRouter.delete("/delete-file/:fileId", deleteFile);

export default fileRouter;
