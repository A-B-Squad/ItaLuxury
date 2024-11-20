
import { Context } from "@/pages/api/graphql";
import nodemailer from "nodemailer";
import { CreateCheckoutInput } from "../categoryMutations/types";

// Improved type definitions
interface ProductInCheckout {
  productId: string;
  productQuantity: number;
  price: number;
  discountedPrice: number;
}

interface CheckoutItem {
  product: {
    reference: string;
    name: string;
  };

  price: number;
  total: number;
  discountedPrice: number;
  productQuantity: number;
}

// Utility function to validate email if provided
const isValidEmail = (email?: string): boolean => {
  if (!email) return true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const generateCustomId = async (prisma: any) => {
  const currentYear = new Date().getFullYear();
  const prefix = "BON";
  const suffix = currentYear.toString();

  let isUnique = false;
  let customId = "";
  let attempts = 0;

  while (!isUnique && attempts < 100) {
    // Get the total number of packages for the current year
    const packagesThisYear = await prisma.package.count({
      where: {
        createdAt: {
          gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
        },
      },
    });

    // Increment the counter
    const newCount = packagesThisYear + attempts + 1;
    const formattedCount = newCount.toString().padStart(5, "0");

    // Create the custom ID
    customId = `${prefix}${formattedCount}${suffix}`;

    // Check if this customId already exists
    const existingPackage = await prisma.package.findUnique({
      where: { customId },
    });

    if (!existingPackage) {
      isUnique = true;
    } else {
      attempts++;
    }
  }

  if (!isUnique) {
    throw new Error("Unable to generate a unique custom ID after 100 attempts");
  }

  return customId;
};

const calculateTotals = (checkout: {
  productInCheckout: CheckoutItem[],
  Coupons?: { discount: number },
  freeDelivery: boolean
  total: number
}, deliveryPrice: number) => {
  const totalProducts = checkout.productInCheckout.reduce(
    (acc: number, item: CheckoutItem) =>
      acc + (item.discountedPrice || item.price) * item.productQuantity,
    0
  );

  const couponDiscount = checkout.Coupons?.discount || 0;
  const discountAmount = (totalProducts * couponDiscount) / 100;
  const totalAfterDiscount = totalProducts - discountAmount;
  const deliveryCost = checkout.freeDelivery ? 0 : deliveryPrice;
  const totalToPay = checkout.total;

  return {
    totalProducts,
    couponDiscount,
    discountAmount,
    totalAfterDiscount,
    deliveryCost, totalToPay
  };
};

// Optional email sending function
async function tryToSendCheckoutEmail(
  checkout: any,
  customId: string,
  deliveryPrice: number
): Promise<void> {
  const recipientEmail = checkout.isGuest ? checkout.guestEmail : checkout.User?.email;
  
  // Skip if no email is provided or configuration is missing
  if (!recipientEmail || !process.env.NEXT_PUBLIC_NODEMAILER_EMAIL || !process.env.NEXT_PUBLIC_NODEMAILER_PASS) {
    return;
  }

  // Validate email format if provided
  if (!isValidEmail(recipientEmail)) {
    console.warn("Invalid email format provided, skipping email send");
    return;
  }

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

  const totals = calculateTotals(checkout, deliveryPrice);
  const mailOptions = {
    from: '"ita-luxury" <no-reply@ita-luxury.com>',
    to: recipientEmail,
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
            <img src="https://www.ita-luxury.com/_next/image?url=https%3A%2F%2Fwww.ita-luxury.com%2F_next%2Fimage%3Furl%3Dhttp%253A%252F%252Fres.cloudinary.com%252Fdc1cdbirz%252Fimage%252Fupload%252Fv1727269305%252Fita-luxury%252FLOGO_hhpyix.png%26w%3D1920%26q%3D75&w=1200&q=75" alt="ita-luxury Logo" class="logo" />
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
                  <td >${item.product.name}</td>
                  <td>${item.price.toFixed(3)} TND</td>
                  <td>${item.productQuantity}</td>
                  <td>${(item.discountedPrice ? item.discountedPrice : item.price * item.productQuantity).toFixed(3)} TND</td>
                </tr>
              `
        )
        .join("")}
              <tr class="totals-row">
                <td colspan="4" class="label">Total des produits</td>
                <td>${totals.totalProducts
        .toFixed(3)} TND</td>
              </tr>
              <tr class="totals-row">
                <td colspan="4" class="label">Coupon</td>
                <td>${totals.couponDiscount} %</td>
              </tr>
              <tr class="totals-row">
                <td colspan="4" class="label">Réduction du coupon</td>
                <td>${totals.discountAmount.toFixed(3)} TND</td>
              </tr>
              <tr class="totals-row">
                <td colspan="4" class="label">Total après réduction</td>
                <td>${totals.totalAfterDiscount.toFixed(3)} TND</td>
              </tr>
              <tr class="totals-row">
                <td colspan="4" class="label">Livraison</td>
                <td>${totals.deliveryCost.toFixed(3)} TND</td>
              </tr>
              <tr class="totals-row">
                <td colspan="4" class="label">Total payé</td>
                <td>${totals.totalToPay.toFixed(3)} TND</td>
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
                <p>${checkout.phone[1] && checkout.phone[1]}</p>
              </div>
              <div class="address-box">
                <div class="address-header">
                  <span>Adresse de facturation</span>
                </div>
                <p>${checkout.User?.fullName || checkout.userName}</p>
                <p>${checkout.User?.fullName || checkout.address}</p>
                <p>Tunisie</p>
                <p>${checkout.User?.phone || checkout.phone[0]}</p>
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





























export const createCheckout = async (
  _: any,
  { input }: { input: CreateCheckoutInput },
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
      couponsId,
      freeDelivery,
      isGuest,
      guestEmail,
      deliveryComment,
      paymentMethod,
      products,
    } = input;

    // Validate required fields
    if (!address || !userName || !phone || (!isGuest && !userId)) {
      throw new Error("Missing required fields");
    }

    // Validate email format if provided
    if (guestEmail && !isValidEmail(guestEmail)) {
      throw new Error("Invalid email format provided");
    }

    let productsInCheckout: ProductInCheckout[];

    if (isGuest) {
      if (!products?.length) {
        throw new Error("Products are required for guest checkout");
      }

      productsInCheckout = products.map((product) => ({
        productId: product.productId,
        productQuantity: product.productQuantity,
        price: product.price,
        discountedPrice: product.discountedPrice || 0,
      }));
    } else {
      const userBasket = await prisma.basket.findMany({
        where: { userId },
        include: {
          Product: {
            include: {
              productDiscounts: {
                include: {
                  Discount: true,
                },
              },
            },
          },
        },
      });

      if (!userBasket.length) {
        throw new Error("User's basket is empty");
      }

      productsInCheckout = userBasket.map((basket) => ({
        productId: basket.productId,
        productQuantity: basket.quantity,
        price: basket.Product?.price ?? 0,
        discountedPrice:
          basket.Product?.productDiscounts?.[0]?.newPrice || 0,
      }));
    }

    // Create checkout in a transaction
    const result = await prisma.$transaction(async (tx) => {

      const newCheckout = await tx.checkout.create({
        data: {
          userId: isGuest ? null : userId,
          userName,
          governorateId,
          freeDelivery,
          isGuest,
          productInCheckout: {
            create: productsInCheckout,
          },
          phone,
          address,
          total,
          couponsId: couponsId || null,
          guestEmail: guestEmail || null,
          deliveryComment,
          paymentMethod,
        },
      });

      if (couponsId) {
        await tx.coupons.update({
          where: { id: couponsId },
          data: { available: false },
        });
      }

      if (!isGuest) {
        await tx.basket.deleteMany({
          where: { userId },
        });
      }

      const customId = await generateCustomId(tx);
      const companyInfo = await tx.companyInfo.findFirst();

      if (!companyInfo?.deliveringPrice) {
        throw new Error("Delivery price not configured");
      }

      const packageRecord = await tx.package.create({
        data: {
          checkoutId: newCheckout.id,
          customId,
          status: "PROCESSING",
        },
      });

      return {
        checkout: newCheckout,
        customId,
        deliveryPrice: companyInfo.deliveringPrice,
      };
    });

    const completeCheckout = await prisma.checkout.findUnique({
      where: { id: result.checkout.id },
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

    if (!completeCheckout) {
      throw new Error("Failed to retrieve complete checkout information");
    }

    // Try to send email if provided, but don't block the checkout process
    await tryToSendCheckoutEmail(completeCheckout, result.customId, result.deliveryPrice);

    return {
      customId: result.customId,
      orderId: completeCheckout.id,
    };
  } catch (error) {
    console.error("Error creating checkout:", error);
    throw error;
  }
};