import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { getRootFolderId } from "../services/getRootFolderId.js";
import { supabase } from "../services/supabaseClient.js";

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

const deleteFile = async (req: Request, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: "Unauthorized: No user ID." });
  }

  const fileId = req.params?.fileId;

  if (!fileId) {
    return res.status(401).json({ error: "Unauthorized: No file ID." });
  }

  // get file
  const file = await prisma.file.findUnique({ where: { id: fileId } });

  if (!file) return res.status(404).json({ error: "File not found" });

  // Delete from Supabase
  const { error: storageError } = await supabase.storage
    .from("files")
    .remove([`folder-${file.folderId}/${file.name}`]);

  if (storageError) {
    console.error("Failed to delete from storage:", storageError.message);
    return res
      .status(500)
      .json({ error: "Failed to delete file from storage" });
  }

  // Delete from DB
  await prisma.file.delete({ where: { id: fileId } });

  res.status(200).json({ success: true });
};

export { uploadFile, deleteFile };
