import { Context } from "@apollo/client";
import nodemailer from "nodemailer";
import { CreateCheckoutFromAdminInput } from "../categoryMutations/types";

// Utility function to validate email if provided
interface ProductInCheckout {
  productId: string;
  productQuantity: number;
  price: number;
  discountedPrice: number;
  Product?: {
    productDiscounts?: Array<{ newPrice: number }>;
  };
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

  // Base URL for your website
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://www.ita-luxury.com';

  // Logo and other image paths - using images from public folder
  const logoUrl = `${baseUrl}/images/logos/LOGO.png`;
  const jaxDeliveryLogo = `${baseUrl}/images/delivery/jax-delivery.png`;

  const totals = calculateTotals(checkout, deliveryPrice);

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
            <img src="${logoUrl}" alt="ita-luxury Logo" class="logo" />
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
                <td>${totals.totalProducts.toFixed(3)} TND</td>
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
      userName,
      governorateId,
      freeDelivery,
      manualDiscount,
      phone,
      address,
      total,
      products,
    } = input;

    // Determine if this is a guest checkout by checking if userId is null or undefined
    const isGuest = !userId;

    // Prepare products for the checkout
    const productInCheckout = products.map((product: ProductInCheckout) => ({
      productId: product.productId,
      productQuantity: product.productQuantity,
      price: product.price ?? 0,
      discountedPrice: product.Product?.productDiscounts?.[0]?.newPrice ?? 0,
    }));

    const result = await prisma.$transaction(async (tx: any) => {
      // Create a new checkout record
      const newCheckout = await tx.checkout.create({
        data: {
          userId: isGuest ? null : userId,
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
          paymentMethod: "CASH_ON_DELIVERY",
          isGuest,
          guestEmail: null,
        },
      });

      const customId = await generateCustomId(tx);
      const companyInfo = await tx.companyInfo.findFirst();

      if (!companyInfo?.deliveringPrice) {
        throw new Error("Delivery price not configured");
      }

      const newPackage = await tx.package.create({
        data: {
          checkoutId: newCheckout.id,
          customId,
          status: "PROCESSING",
        },
      });

      return {
        checkout: newCheckout,
        package: newPackage,
        customId,
        deliveryPrice: companyInfo.deliveringPrice,
      };
    });

    const completeCheckout = await prisma.checkout.findUnique({
      where: { id: result.checkout.id },
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

    if (!completeCheckout) {
      throw new Error("Failed to retrieve complete checkout information");
    }

    // Try sending a checkout email if applicable
    await tryToSendCheckoutEmail(completeCheckout, result.customId, result.deliveryPrice);

    return result.package.id;
  } catch (error) {
    console.error("Error creating checkout:", error);
    throw error;
  }
};
