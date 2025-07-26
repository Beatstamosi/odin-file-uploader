import { Request, Response } from "express";
import prisma from "../lib/prisma.js";

const createNewFolder = async (req: Request, res: Response) => {
  console.log(req.user);
  console.log(req.body.name);
  console.log(req.params.folderid);

  if (!req.user?.id) {
    return res.status(401).json({ error: "Unauthorized: No user ID." });
  }

  try {
    const parentFolderId = req.params.folderid ?? null;

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

export { createNewFolder };
