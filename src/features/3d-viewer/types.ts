export interface IObjectDetail {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  thumbnailUrl: string;
  categories: string[];
  theory: string;
  components: IComponent[];
}

export interface IComponent {
  id: number;
  name: string;
  nameEn: string;
  modelFileUrl: string;
  material: string;
  role: string;
}

export interface IComponentList {
  content: IComponent[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

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

export interface IApiResponse<T> {
  message: string;
  data: T;
  timestamp: string;
}
