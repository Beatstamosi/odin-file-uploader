export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  folders?: Folder[];
  files?: File[];
};

type Folder = {
  id: string;
  name: string;
  parentFolderId: string | null;
  ownerId: string;
};

type File = {
  id: string;
  name: string;
  size: number;
  uploaded: string;
  url: string;
  folderId: string;
  ownerId: string;
};
