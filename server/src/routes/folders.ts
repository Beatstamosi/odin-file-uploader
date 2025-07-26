import { Router } from "express";
import { validateFolderName } from "../middlewares/validateFolder.js";
import { handleValidationErrors } from "../middlewares/handleValidationErrors.js";
import {
  createNewFolder,
  getFolderContent,
} from "../controllers/foldersControllers.js";

const foldersRouter = Router();

// Create new folder
foldersRouter.post(
  "/create-new",
  validateFolderName,
  handleValidationErrors,
  createNewFolder
);

foldersRouter.get("/get-folder/:folderid", getFolderContent);

export default foldersRouter;
