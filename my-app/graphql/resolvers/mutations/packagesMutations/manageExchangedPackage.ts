import { Context } from "@/pages/api/graphql";

export const exchangePackage = async (
  _: any,
  { input }: { input: manageExchangePackageInput },
  { prisma }: Context
) => {
  const { packageId, cause, description } = input;

  try {
    const findPackage = await prisma.package.findFirst({
      where: { id: packageId },
      include: {
        Checkout: {
          include: {
            products: true,
          },
        },
      },
    });

    const products = findPackage?.Checkout?.products;
    if (findPackage?.status === "EXCHANGE") {
          if (cause === "BROKEN"&& products && products.length > 0) {
            const products = findPackage?.Checkout?.products;
    
            if (products && products.length > 0) {
              for (const product of products) {
                await prisma.product.update({
                  where: {
                    id: product.productId,
                  },
                  data: {
                    solde: {
                      decrement: product.productQuantity,
                    },
                    inventory: {
                      increment: product.productQuantity,
                    },
                  },
                });
              }
            }
    
            const productData = (products || []).map((product) => ({
              productId: product.productId,
              cause: cause,
              description: description,
              
            }));
    
          

            await prisma.backOrExchange.createMany({
              data: productData
            });
            await prisma.package.update({
              where: { id: packageId },
              data: {
                status: "PROCESSING",
              },
            });
            return "Successfully added to Back or Exchange"

          }
        


      
      }
 
    }catch(error){
      return "Error exchanging package";
    }
  
  }