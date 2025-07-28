import { Request, Response } from "express";
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
      req.params.folderid ?? (await getRootFolderId(req.user.id));

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

export { createNewFolder, getFolderContent };
