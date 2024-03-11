export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  version: number | null;
}
