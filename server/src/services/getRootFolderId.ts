import prisma from "../lib/prisma.js";

export const getRootFolderId = async (userId: string) => {
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
