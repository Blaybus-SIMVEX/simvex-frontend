export interface ObjectData {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  thumbnailUrl: string;
  category: string[];
}

export interface IObjects {
  message: string;
  data: {
    content: ObjectData[];
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
  };
}
