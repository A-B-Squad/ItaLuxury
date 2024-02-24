interface CreateCategoryInput {
  name: string;
  parentId: any;
}
interface UpdateCategoryInput {
  name: string;
}

interface CreateCheckoutInput {
  userId: string
  phone: number[]
  governorateId: string
  address: string
  productIds: string[]
  total: number
}
