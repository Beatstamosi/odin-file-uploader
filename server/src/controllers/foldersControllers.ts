import { Request, response, Response } from "express";
import prisma from "../lib/prisma.js";

const getRootFolderId = async (userId: string) => {
  try {
    const result = await prisma.folder.findFirst({
      where: {
        ownerId: userId,
        parentFolderId: null,
      },
      select: {
        id: true,
      },
    });

    if (result) {
      return result.id;
    } else {
      throw new Error("Folder could not be created");
    }
  } catch (err) {
    console.error("Error creating folder: ", err);
    throw err;
  }
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
    let folders = [];

    let current = await prisma.folder.findUnique({
      where: {
        id: req.params.folderid,
      },
    });

    folders.push(current?.name);

    while (current?.parentFolderId) {
      let parent = await prisma.folder.findUnique({
        where: {
          id: current.parentFolderId,
        },
      });

      folders.push(parent?.name);
      current = parent;
    }

    const path = folders.reverse().join(" / ");

    res.status(200).json({ path });
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

const deleteFolder = async (req: Request, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: "Unauthorized: No user ID." });
  }

  if (!req.params?.folderid) {
    return res.status(401).json({ error: "Missing folder id" });
  }

  try {
    const result = await prisma.folder.delete({
      where: {
        ownerId: req.user?.id,
        id: req.params.folderid,
      },
    });

    if (result) {
      res.status(201).json({ folder: result });
    } else {
      throw new Error("Folder could not be deleted.");
    }
  } catch (err) {
    console.error("Error deleting folder: ", err);
    throw err;
  }
};

export {
  createNewFolder,
  getFolderContent,
  getFolderPath,
  getRootFolder,
  deleteFolder,
};
