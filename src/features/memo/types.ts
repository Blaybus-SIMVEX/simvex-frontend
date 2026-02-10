export interface IMemo {
  id: number;
  objectId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMemoList {
  content: IMemo[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
