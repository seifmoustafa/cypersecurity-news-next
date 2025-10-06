export interface HelperCategory {
  id: string;
  title: string;
  titleEn: string | null;
  imageUrl: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface HelperCategoriesResponse {
  data: HelperCategory[];
  pagination: {
    itemsCount: number;
    pagesCount: number;
    pageSize: number;
    currentPage: number;
  };
}

export interface Helper {
  id: string;
  title: string;
  titleEn: string | null;
  imageUrl: string | null;
  categoryId: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface HelpersResponse {
  data: Helper[];
  pagination: {
    itemsCount: number;
    pagesCount: number;
    pageSize: number;
    currentPage: number;
  };
}
