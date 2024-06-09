interface CreateCategoryInput {
  name: string;
  parentId: any;
}
interface UpdateCategoryInput {
  name: string;
}

interface CreateCheckoutInput {
  userId: string
  userName: string
  phone: number[]
  governorateId: string
  address: string
  productIds: any
  total: number
  couponsId: string | null
}

