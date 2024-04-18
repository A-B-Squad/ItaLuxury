interface addToBasketInput{
    userId:string!,
    productId:string!,
    quantity:number!,
}

interface ProductInputQuantity {
    productId: string;
    quantity: number;
  }
  
  interface AddMultipleToBasketInput {
    userId: string;
    products: ProductInputQuantity[];
  }