export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  folders?: FolderType[];
  files?: FileType[];
};

export type FolderType = {
  id: string;
  name: string;
  parentFolderId: string | null;
  ownerId: string;
  parentFolder?: FolderType;
  children?: FolderType[];
  files?: FileType[];
};

export type FileType = {
  id: string;
  name: string;
  size: number;
  uploaded: string;
  url: string;
  folderId: string;
  ownerId: string;
};
