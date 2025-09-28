export interface PersonalProtectSubCategory {
  id: string
  name: string
  nameEn: string | null
  description: string | null
  descriptionEn: string | null
  imageUrl: string
  personalProtectCategoryId: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface PersonalProtectSubCategoriesResponse {
  data: PersonalProtectSubCategory[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}
