export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  password?: string;
  folders?: Folder[];
  files?: File[];
}

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
  uploaded: Date;
  url: string;
  folderId: string;
  ownerId: string;
};
