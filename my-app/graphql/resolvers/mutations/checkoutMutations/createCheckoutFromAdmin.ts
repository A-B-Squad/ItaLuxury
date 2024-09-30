import { Context } from "@/pages/api/graphql";
import nodemailer from "nodemailer";
import { CreateCheckoutFromAdminInput } from "../categoryMutations/types";

const generateCustomId = async (prisma: any) => {
  const currentYear = new Date().getFullYear();
  const prefix = "BON";
  const suffix = currentYear.toString();

  // Obtenez le nombre total de packages pour l'année en cours
  const packagesThisYear = await prisma.package.count({
    where: {
      createdAt: {
        gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
        lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
      },
    },
  });

  // Incrémentez le compteur
  const newCount = packagesThisYear + 1;
  const formattedCount = newCount.toString().padStart(5, "0");

  // Créez l'identifiant customisé
  const customId = `${prefix}${formattedCount}${suffix}`;
  return customId;
};
async function sendCheckoutEmail(
  checkout: any,
  products: any[],
  customId: string,
  deliveryPrice: any
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

  const totalProducts = checkout.productInCheckout.reduce(
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
    to: checkout.User.email,
    subject: "Confirmation de votre commande",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .logo {
            width: 150px;
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
            <img src="https://res.cloudinary.com/dc1cdbirz/image/upload/v1727269189/cz4cuthoiooetsaji7mp.png" alt="ita-luxury Logo" class="logo" />
          </div>
          <h1>ita-luxury</h1>
          <p>Bonjour ${checkout.userName},</p>
          <p>Merci pour votre commande. Voici les détails :</p>
          
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
              <img src="https://app.jax-delivery.com/assets/img/logo.png" alt="Livraison" width="24" />
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
            &copy; ${new Date().getFullYear()} ita-luxury. Tous droits réservés.
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}
export const createCheckoutFromAdmin = async (
  _: any,
  { input }: { input: CreateCheckoutFromAdminInput },
  { prisma }: Context
) => {
  try {
    const {
      userId,
      governorateId,
      address,
      total,
      phone,
      userName,
      products,
      manualDiscount,
      paymentMethod,
      freeDelivery,
    } = input;

    const productInCheckout = products.map((product: any) => {
      const productDiscounts = product.Product?.productDiscounts;

      return {
        productId: product.productId,
        productQuantity: product.productQuantity,
        price: product.price ?? 0,
        discountedPrice:
          productDiscounts && productDiscounts.length > 0
            ? productDiscounts[0].newPrice
            : 0,
      };
    });

    const newCheckout = await prisma.checkout.create({
      data: {
        userId,
        userName,
        governorateId,
        freeDelivery,
        productInCheckout: {
          create: productInCheckout,
        },
        manualDiscount,
        phone,
        address,
        total,
        paymentMethod:"CASH_ON_DELIVERY",
      },
    });

    const customId = await generateCustomId(prisma);
    const companyInfo = await prisma.companyInfo.findFirst();

    const deliveryPrice = companyInfo?.deliveringPrice;
    const newPackage = await prisma.package.create({
      data: {
        checkoutId: newCheckout.id,
        customId,
        status: "PROCESSING",
      },
    });
    const completeCheckout = await prisma.checkout.findUnique({
      where: { id: newCheckout.id },
      include: {
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

    if (completeCheckout) {
      await sendCheckoutEmail(
        completeCheckout,
        completeCheckout.productInCheckout,
        customId,
        deliveryPrice
      );
    }

    return newPackage.id;
  } catch (error) {
    // Handle errors
    console.error("Error creating checkout:", error);
    return error;
  }
};
