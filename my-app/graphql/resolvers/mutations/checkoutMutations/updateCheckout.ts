import { Context } from "@/pages/api/graphql";
import nodemailer from "nodemailer";

interface UpdateCheckoutInput {
  orderStatus?: string
  checkoutId: string;
  total?: number;
  manualDiscount: GLfloat;
  freeDelivery: boolean;
  productInCheckout?: Array<{
    productId: string;
    productQuantity: number;
    price: number;
    discountedPrice: number;
  }>;
}

async function sendCheckoutEmail(
  checkout: any,
  productInCheckout: any[],
  customId: string,
  deliveryPrice: any,
  Email: string
) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
      user: process.env.NEXT_PUBLIC_NODEMAILER_EMAIL,
      pass: process.env.NEXT_PUBLIC_NODEMAILER_PASS,
    },
  });

  // Base URL for your website
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://www.ita-luxury.com';

  // Logo and other image paths - using images from public folder
  const logoUrl = `${baseUrl}/LOGO.png`;
  const jaxDeliveryLogo = `${baseUrl}/jaxDelivery.png`;

  const totalProducts = productInCheckout.reduce(
    (
      acc: number,
      item: { discountedPrice: any; price: any; productQuantity: number }
    ) =>
      acc +
      (item.discountedPrice ? item.discountedPrice : item.price) *
      item.productQuantity,
    0
  );

  const couponDiscount = checkout.Coupons?.discount || 0;
  const discountAmount = (totalProducts * couponDiscount) / 100;
  const totalAfterDiscount = totalProducts - discountAmount;
  const deliveryCost = checkout.freeDelivery ? 0.0 : deliveryPrice;
  const totalToPay = checkout.total;

  const mailOptions = {
    from: '"ita-luxury" <no-reply@ita-luxury.com>',
    to: Email,
    subject: "Mise à jour de votre commande",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background-color: #f2f2f2;
            margin: 0;
            padding: 0;
            color: #333;
            line-height: 1.6;
          }
          .container {
            width: 100%;
            max-width: 650px;
            margin: 0 auto;
            background-color: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #e0e0e0;
            margin-bottom: 30px;
          }
          .logo {
            max-width: 180px;
            height: auto;
          }
          h1 {
            color: #c7ae91; /* Changed main color */
          }
          p {
            font-size: 16px;
            line-height: 1.5;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #c7ae91; /* Changed main color */
            color: white;
          }
          td {
            background-color: #f9f9f9;
          }
          .totals-row td {
            font-weight: bold;
            text-align: right;
            background-color: #f1f1f1;
          }
          .totals-row .label {
            text-align: left;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #777;
          }
          .delivery-section {
            margin-bottom: 20px;
          }
          .delivery-header {
            font-weight: bold;
            display: flex;
            align-items: center;
          }
          .delivery-header img {
            margin-right: 10px;
          }
          .addresses {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
          }
          .address-box {
            width: 48%;
            padding: 10px;
            border: 1px solid #ddd;
            background-color: #f9f9f9;
            border-radius: 4px;
          }
          .address-header {
            font-weight: bold;
            margin-bottom: 5px;
            display: flex;
            align-items: center;
          }
          .address-header img {
            margin-right: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${logoUrl}" alt="ita-luxury Logo" class="logo" />
          </div>
          <h1>ita-luxury</h1>
          <p>Bonjour ${checkout.userName},</p>
        <p>Votre commande a été mise à jour. Voici les nouveaux détails :</p>
          
          <div class="section">
            <h2>Détails de la commande</h2>
            <p>Commande : ${customId} passée le ${new Date(checkout.createdAt).toLocaleString()}</p>
            <table>
              <tr>
                <th>Référence</th>
                <th>Produit</th>
                <th>Prix unitaire</th>
                <th>Quantité</th>
                <th>Prix total</th>
              </tr>
              ${checkout.productInCheckout
        .map(
          (item: {
            product: { reference: any; name: any };
            price: number;
            discountedPrice: number;
            productQuantity: number;
          }) => `
                <tr>
                  <td>${item.product.reference}</td>
                  <td>${item.product.name}</td>
                  <td>${item.price.toFixed(3)} TND</td>
                  <td>${item.productQuantity}</td>
                  <td>${(item.discountedPrice ? item.discountedPrice : item.price * item.productQuantity).toFixed(3)} TND</td>
                </tr>
              `
        )
        .join("")}
              <tr class="totals-row">
                <td colspan="4" class="label">Total des produits</td>
                <td>${totalProducts.toFixed(3)} TND</td>
              </tr>
              <tr class="totals-row">
                <td colspan="4" class="label">Coupon</td>
                <td>${couponDiscount} %</td>
              </tr>
              <tr class="totals-row">
                <td colspan="4" class="label">Réduction du coupon</td>
                <td>${discountAmount.toFixed(3)} TND</td>
              </tr>
              <tr class="totals-row">
                <td colspan="4" class="label">Total après réduction</td>
                <td>${totalAfterDiscount.toFixed(3)} TND</td>
              </tr>
              <tr class="totals-row">
                <td colspan="4" class="label">Livraison</td>
                <td>${deliveryCost.toFixed(3)} TND</td>
              </tr>
              <tr class="totals-row">
                <td colspan="4" class="label">Total payé</td>
                <td>${totalToPay.toFixed(3)} TND</td>
              </tr>
            </table>
          </div>
          
          <!-- Section Livraison -->
          <div class="delivery-section">
            <div class="delivery-header">
              <img src="${jaxDeliveryLogo}" alt="Livraison" width="24" />
              <span>Livraison</span>
            </div>
            <p>Transporteur : JAX Delivery</p>
            <p>Paiement : Paiement comptant à la livraison (Cash on delivery) (en attente de validation)</p>
            
            <div class="addresses">
              <div class="address-box">
                <div class="address-header">
                  <span>Adresse de livraison</span>
                </div>
                <p>${checkout.userName}</p>
                <p>${checkout.address}</p>
                <p>Tunisie</p>
                <p>${checkout.phone[0]}</p>
              </div>
              <div class="address-box">
                <div class="address-header">
                  <span>Adresse de facturation</span>
                </div>
                <p>${checkout.userName}</p>
                <p>${checkout.address}</p>
                <p>Tunisie</p>
                <p>${checkout.phone[0]}</p>
              </div>
            </div>
          </div>
  
          <p>Merci d'avoir choisi ita-luxury !</p>
  
          <div class="footer">
            <p>Contact: 23 212 892 | Instagram: <a href="https://www.instagram.com/ita_luxury" style="color: #9a7b5f; text-decoration: none;">@ita_luxury</a></p>
            <p>&copy; ${new Date().getFullYear()} ita-luxury. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export const updateCheckout = async (
  _: any,
  { input }: { input: UpdateCheckoutInput },
  { prisma }: Context
) => {
  try {
    const {
      checkoutId,
      total,
      productInCheckout,
      manualDiscount,
      freeDelivery,
      orderStatus
    } = input;

    // Fetch the existing checkout
    const existingCheckout = await prisma.checkout.findUnique({
      where: { id: checkoutId },
      include: {
        productInCheckout: true,
        package: true
      },
    });

    if (!existingCheckout) {
      throw new Error("Checkout not found");
    }

    // Prepare the update data
    const updateData: any = {};

    if (total !== undefined) updateData.total = total;
    if (manualDiscount !== undefined)
      updateData.manualDiscount = manualDiscount;
    if (freeDelivery !== undefined) updateData.freeDelivery = freeDelivery;

    const companyInfo = await prisma.companyInfo.findFirst();
    const deliveryPrice = companyInfo?.deliveringPrice;

    // Handle product updates
    if (productInCheckout) {
      // Only adjust inventory if the order status is CONFIRMED
      if (orderStatus === "CONFIRMED" && existingCheckout.productInCheckout && existingCheckout.productInCheckout.length > 0) {
        // First, adjust inventory and sales for existing products before deleting them
        await prisma.$transaction(async (tx: any) => {
          for (const existingProduct of existingCheckout.productInCheckout) {
            // Restore inventory and sales counts for products being removed or updated
            await tx.product.update({
              where: { id: existingProduct.productId },
              data: {
                inventory: { increment: existingProduct.productQuantity },
                solde: { decrement: existingProduct.productQuantity },
              },
            });
          }
        });
      }

      // Delete existing productInCheckout entries
      await prisma.productInCheckout.deleteMany({
        where: { checkoutId },
      });

      // Create new productInCheckout entries
      updateData.productInCheckout = {
        create: productInCheckout.map((product) => ({
          productId: product.productId,
          productQuantity: product.productQuantity,
          price: product.price,
          discountedPrice: product.discountedPrice,
        })),
      };

      // Only update inventory for new products if the order status is CONFIRMED
      if (orderStatus === "CONFIRMED") {
        await prisma.$transaction(async (tx: any) => {
          for (const newProduct of productInCheckout) {
            await tx.product.update({
              where: { id: newProduct.productId },
              data: {
                inventory: { decrement: newProduct.productQuantity },
                solde: { increment: newProduct.productQuantity },
              },
            });
          }
        });
      }
    }


    // Perform the update
    const updatedCheckout = await prisma.checkout.update({
      where: { id: checkoutId },
      data: updateData,
      include: {
        Governorate: true,
        package: true,
        Coupons: true,
        productInCheckout: {
          include: {
            product: true,
          },
        },
        User: true,
      },
    });

    if (updatedCheckout) {
      const emailToUse = updatedCheckout.isGuest
        ? updatedCheckout.guestEmail
        : updatedCheckout.User?.email;

      if (emailToUse) {
        await sendCheckoutEmail(
          updatedCheckout,
          updatedCheckout.productInCheckout,
          updatedCheckout.package[0]?.customId,
          deliveryPrice, emailToUse
        );
      } else {
        console.log(
          "No valid email address found. Skipping email send for updated checkout."
        );
      }
    }

    return "Updated Checkout";
  } catch (error) {
    console.error("Error updating checkout:", error);
    throw error;
  }
};
