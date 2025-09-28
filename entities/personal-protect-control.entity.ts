export interface PersonalProtectControl {
  id: string
  name: string
  nameEn: string | null
  description: string | null
  descriptionEn: string | null
  imageUrl: string
  personalProtectSubCategoryId: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface PersonalProtectControlsResponse {
  data: PersonalProtectControl[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}
