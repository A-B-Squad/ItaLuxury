interface CreateCategoryInput {
  name: string;
  parentId: string;
  bigImage:string
  smallImage:string
  description:string
}
interface UpdateCategoryInput {
  name: string;
  parentId: string;
  bigImage:string
  smallImage:string
  description:string
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

