import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { getRootFolderId } from "../services/getRootFolderId.js";

const uploadFile = async (req: Request, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: "Unauthorized: No user ID." });
  }

  try {
    const FolderId = req.body.folderId ?? (await getRootFolderId(req.user.id));

    const result = await prisma.file.create({
      data: {
        name: req.body.name,
        size: req.body.size,
        url: req.body.url,
        folderId: FolderId,
        ownerId: req.user.id,
      },
    });

    if (result) {
      res.status(200).json({ file: result });
    } else {
      throw new Error("Uploading File");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

export { uploadFile };
