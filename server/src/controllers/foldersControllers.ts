import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { getRootFolderId } from "../services/getRootFolderId.js";
import { supabase } from "../services/supabaseClient.js";

// Helper function to recursively collect all file paths inside folder
const collectAllFilePaths = async (prefix: string): Promise<string[]> => {
  const allFilePaths: string[] = [];

  // Get list of items (both files and subfolders)
  const { data: items, error } = await supabase.storage
    .from("files")
    .list(prefix, { limit: 1000 });

  if (error) {
    throw new Error(`Error listing files in ${prefix}: ${error.message}`);
  }

  for (const item of items) {
    if (item.name) {
      if (item.metadata?.mimetype) {
        // This is a file
        allFilePaths.push(`${prefix}${item.name}`);
      } else {
        // This is a folder — recurse
        const subfolderPrefix = `${prefix}${item.name}/`;
        const nestedPaths = await collectAllFilePaths(subfolderPrefix);
        allFilePaths.push(...nestedPaths);
      }
    }
  }

  return allFilePaths;
};

const createNewFolder = async (req: Request, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: "Unauthorized: No user ID." });
  }

  try {
    const parentFolderId =
      req.body.parentFolder ?? (await getRootFolderId(req.user.id));

    const result = await prisma.folder.create({
      data: {
        name: req.body.name,
        parentFolderId: parentFolderId,
        ownerId: req.user?.id,
      },
    });

    if (result) {
      res.status(200).json({ folder: result });
    } else {
      throw new Error("Folder could not be created");
    }
  } catch (err) {
    console.error("Error creating folder: ", err);
    res.status(500).json({ error: err });
  }
};

const getFolderContent = async (req: Request, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: "Unauthorized: No user ID." });
  }

  try {
    const result = await prisma.folder.findUnique({
      where: {
        id: req.params.folderid,
      },
      include: {
        files: true,
        children: true,
      },
    });

    if (result) {
      res.status(200).json({ folder: result });
    } else {
      throw new Error("Folder could not be fetched");
    }
  } catch (err) {
    console.error("Server Error fetching folder: ", err);
    res.status(500).json({ error: err });
  }
};

const getFolderPath = async (req: Request, res: Response) => {
  if (!req.params?.folderid) {
    return res.status(401).json({ error: "Missing folder Id." });
  }

  try {
    let folders: {
      name: string | undefined;
      id: string | undefined;
    }[] = [];

    let current = await prisma.folder.findUnique({
      where: {
        id: req.params.folderid,
      },
    });

    folders.push({ name: current?.name, id: current?.id });

    while (current?.parentFolderId) {
      let parent = await prisma.folder.findUnique({
        where: {
          id: current.parentFolderId,
        },
      });

      folders.push({ name: parent?.name, id: parent?.id });
      current = parent;
    }

    folders = folders.reverse();

    res.status(200).json({ folders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch folder path" });
  }
};

const getRootFolder = async (req: Request, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: "Unauthorized: No user ID." });
  }

  try {
    const result = await prisma.folder.findFirst({
      where: {
        ownerId: req.user?.id,
        parentFolderId: null,
      },
      include: {
        files: true,
        children: true,
      },
    });

    if (result) {
      res.status(201).json({ folder: result });
    } else {
      throw new Error("Root Folder could not be fetched.");
    }
  } catch (err) {
    console.error("Error fetching root folder: ", err);
    throw err;
  }
};

const getRootFolderIdPublic = async (req: Request, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: "Unauthorized: No user ID." });
  }

  try {
    const rootFolderId = await getRootFolderId(req.user.id);

    if (rootFolderId) {
      res.status(200).json({ rootFolderId });
    } else {
      throw new Error("Error getting rootFolderId");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

const deleteFolder = async (req: Request, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: "Unauthorized: No user ID." });
  }

  const folderId = req.params?.folderid;
  if (!folderId) {
    return res.status(400).json({ error: "Missing folder id" });
  }

  const folderPrefix = `folder-${folderId}/`;

  try {
    // Recursively collect all file paths inside folder
    const allFilePaths = await collectAllFilePaths(folderPrefix);

    // 🧹 Delete all files
    if (allFilePaths.length > 0) {
      const { error: deleteError } = await supabase.storage
        .from("files")
        .remove(allFilePaths);

      if (deleteError) {
        console.error(
          "Failed to delete files from storage:",
          deleteError.message
        );
        return res
          .status(500)
          .json({ error: "Failed to delete files from storage" });
      }
    }

    // Delete folder record from database
    const result = await prisma.folder.delete({
      where: {
        ownerId: req.user?.id,
        id: folderId,
      },
    });

    return res.status(200).json({ folder: result });
  } catch (err) {
    console.error("Error deleting folder recursively:", err);
    return res.status(500).json({ error: "Failed to delete folder" });
  }
};

const getSharedFolder = async (req: Request, res: Response) => {
  try {
    const result = await prisma.folder.findUnique({
      where: {
        id: req.params.folderid,
      },
      include: {
        files: true,
        children: true,
      },
    });

    if (result) {
      res.status(200).json({ folder: result });
    } else {
      throw new Error("Folder could not be fetched");
    }
  } catch (err) {
    console.error("Server Error fetching folder: ", err);
    res.status(500).json({ error: err });
  }
};

export {
  createNewFolder,
  getFolderContent,
  getFolderPath,
  getRootFolder,
  deleteFolder,
  getRootFolderIdPublic,
  getSharedFolder,
};
