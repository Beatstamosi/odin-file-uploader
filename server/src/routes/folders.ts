import { Router } from "express";
import { validateFolderName } from "../middlewares/validateFolder.js";
import { handleValidationErrors } from "../middlewares/handleValidationErrors.js";
import {
  createNewFolder,
  deleteFolder,
  getFolderContent,
  getFolderPath,
  getRootFolder,
  getRootFolderIdPublic,
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

foldersRouter.get("/:folderid/path", getFolderPath);
foldersRouter.get("/get-home-folder", getRootFolder);
foldersRouter.get("/get-home-folder-id", getRootFolderIdPublic);

foldersRouter.delete("/delete-folder/:folderid", deleteFolder);

export default foldersRouter;
