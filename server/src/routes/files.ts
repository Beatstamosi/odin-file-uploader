import { Router } from "express";
import { uploadFile } from "../controllers/filesController.js";

const fileRouter = Router();

// Create new folder
fileRouter.post("/upload-new", uploadFile);

export default fileRouter;
