export interface PersonalProtectCategory {
  id: string
  name: string
  nameEn: string | null
  description: string | null
  descriptionEn: string | null
  imageUrl: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface PersonalProtectCategoriesResponse {
  data: PersonalProtectCategory[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}
