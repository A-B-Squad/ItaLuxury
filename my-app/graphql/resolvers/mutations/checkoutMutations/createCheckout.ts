
import { Context } from "@apollo/client";
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

  // Base URL for your website
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://www.ita-luxury.com';

  // Logo and other image paths - using images from public folder
  const logoUrl = `${baseUrl}/images/logos/LOGO.png`;
  const jaxDeliveryLogo = `${baseUrl}/images/delivery/jax-delivery.webp`;

  const mailOptions = {
    from: '"Ita Luxury" <no-reply@ita-luxury.com>',
    to: recipientEmail,
    subject: `Confirmation de votre commande #${customId}`,
    html: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation de Commande - Ita Luxury</title>
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
          .order-number {
            background-color: #e8e1d9;
            border-left: 4px solid #9a7b5f;
            padding: 12px 15px;
            margin: 20px 0;
            font-size: 16px;
            color: #4a4a4a;
          }
          h1 {
            color: #9a7b5f;
            font-size: 24px;
            font-weight: 600;
            margin-top: 0;
          }
          h2 {
            color: #4a4a4a;
            font-size: 20px;
            font-weight: 600;
            margin-top: 30px;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e0e0e0;
          }
          p {
            font-size: 16px;
            line-height: 1.6;
            color: #4a4a4a;
          }
          .highlight {
            color: #9a7b5f;
            font-weight: 600;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
            font-size: 15px;
          }
          th {
            background-color: #9a7b5f;
            color: white;
            font-weight: 600;
            text-align: left;
            padding: 12px 15px;
            border-radius: 4px 4px 0 0;
          }
          td {
            padding: 12px 15px;
            border-bottom: 1px solid #e0e0e0;
          }
          tr:last-child td {
            border-bottom: none;
          }
          tr:nth-child(even) {
            background-color: #f5f5f5;
          }
          .product-name {
            font-weight: 500;
          }
          .totals-table {
            width: 100%;
            margin-top: 20px;
          }
          .totals-table td {
            padding: 8px 15px;
          }
          .totals-table .label {
            text-align: right;
            font-weight: 500;
            width: 70%;
          }
          .totals-table .value {
            text-align: right;
            font-weight: 600;
            width: 30%;
          }
          .grand-total {
            background-color: #e8e1d9;
            color: #9a7b5f;
            font-weight: 700;
            font-size: 16px;
          }
          .delivery-section {
            background-color: #f5f5f5;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
            border: 1px solid #e0e0e0;
          }
          .section-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
          }
          .section-header h3 {
            margin: 0;
            color: #4a4a4a;
            font-size: 18px;
            font-weight: 600;
          }
          .addresses {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 20px;
          }
          .address-box {
            flex: 1;
            min-width: 250px;
            background-color: white;
            border-radius: 6px;
            padding: 15px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.08);
            border: 1px solid #e0e0e0;
          }
          .address-header {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e0e0e0;
          }
          .address-header span {
            font-weight: 600;
            color: #4a4a4a;
          }
          .address-content p {
            margin: 5px 0;
            font-size: 15px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #777;
            font-size: 14px;
          }
          .jax-logo {
            height: 30px;
            width: auto;
            margin-right: 10px;
            vertical-align: middle;
          }
          @media only screen and (max-width: 600px) {
            .container {
              padding: 20px;
            }
            .addresses {
              flex-direction: column;
            }
            .address-box {
              width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${logoUrl}" alt="Ita Luxury" class="logo" />
          </div>
          
          <h1>Merci pour votre commande!</h1>
          <p>Bonjour <span class="highlight">${checkout.userName}</span>,</p>
          <p>Nous avons bien reçu votre commande et nous vous en remercions. Votre commande est actuellement en cours de traitement.</p>
          
          <div class="order-number">
            <strong>Commande:</strong> #${customId} | <strong>Date:</strong> ${new Date(checkout.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
          
          <h2>Détails de votre commande</h2>
          <table>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Prix</th>
                <th>Qté</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${checkout.productInCheckout
        .map((item: any) => `
                <tr>
                  <td class="product-name">
                    <div><strong>${item.product.name}</strong></div>
                    <div style="color: #888; font-size: 13px;">Réf: ${item.product.reference}</div>
                  </td>
                  <td>${item.price.toFixed(2)} TND</td>
                  <td>${item.productQuantity}</td>
                  <td><strong>${(item.discountedPrice || (item.price * item.productQuantity)).toFixed(2)} TND</strong></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          
          <table class="totals-table">
            <tr>
              <td class="label">Sous-total:</td>
              <td class="value">${totals.totalProducts.toFixed(2)} TND</td>
            </tr>
            ${totals.couponDiscount > 0 ? `
              <tr>
                <td class="label">Coupon (${totals.couponDiscount}%):</td>
                <td class="value">-${totals.discountAmount.toFixed(2)} TND</td>
              </tr>
              <tr>
                <td class="label">Sous-total après réduction:</td>
                <td class="value">${totals.totalAfterDiscount.toFixed(2)} TND</td>
              </tr>
            ` : ''}
            <tr>
              <td class="label">Frais de livraison:</td>
              <td class="value">${totals.deliveryCost.toFixed(2)} TND</td>
            </tr>
            <tr class="grand-total">
              <td class="label">Total:</td>
              <td class="value">${totals.totalToPay.toFixed(2)} TND</td>
            </tr>
          </table>
          
          <div class="delivery-section">
            <div class="section-header">
              <img src="${jaxDeliveryLogo}" alt="JAX Delivery" class="jax-logo" />
              <h3>Informations de livraison</h3>
            </div>
            <p><strong>Transporteur:</strong> JAX Delivery</p>
            <p><strong>Mode de paiement:</strong> ${checkout.paymentMethod === 'CASH_ON_DELIVERY' ? 'Paiement à la livraison' : checkout.paymentMethod}</p>
            ${checkout.deliveryComment ? `<p><strong>Instructions:</strong> ${checkout.deliveryComment}</p>` : ''}
            
            <div class="addresses">
              <div class="address-box">
                <div class="address-header">
                  <span>Adresse de livraison</span>
                </div>
                <div class="address-content">
                  <p><strong>${checkout.userName}</strong></p>
                  <p>${checkout.address}</p>
                  <p>${checkout.Governorate?.name || 'Tunisie'}</p>
                  <p>Tél: ${checkout.phone[0]}</p>
                  ${checkout.phone[1] ? `<p>Tél 2: ${checkout.phone[1]}</p>` : ''}
                </div>
              </div>
              
              <div class="address-box">
                <div class="address-header">
                  <span>Adresse de facturation</span>
                </div>
                <div class="address-content">
                  <p><strong>${checkout.User?.fullName || checkout.userName}</strong></p>
                  <p>${checkout.address}</p>
                  <p>${checkout.Governorate?.name || 'Tunisie'}</p>
                  <p>Tél: ${checkout.User?.phone || checkout.phone[0]}</p>
                </div>
              </div>
            </div>
          </div>
          
          <p>Vous recevrez une notification lorsque votre commande sera expédiée. Si vous avez des questions concernant votre commande, n'hésitez pas à nous contacter.</p>
          
          <div class="footer">
            <p>Merci d'avoir choisi Ita Luxury pour vos achats de meubles et décoration.</p>
            <p>Contact: 23 212 892 | Instagram: <a href="https://www.instagram.com/ita_luxury" style="color: #9a7b5f; text-decoration: none;">@ita_luxury</a></p>
            <p>&copy; ${new Date().getFullYear()} Ita Luxury. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${recipientEmail}`);
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    // Don't throw the error to prevent blocking the checkout process
  }
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
              productDiscounts: true,
            },
          },
        },
      });

      if (!userBasket.length) {
        throw new Error("User's basket is empty");
      }

      productsInCheckout = userBasket.map((basket: any) => ({
        productId: basket.productId,
        productQuantity: basket.quantity,
        price: basket.Product?.price ?? 0,
        discountedPrice:
          basket.Product?.productDiscounts?.[0]?.newPrice || 0,
      }));
    }

    // Create checkout in a transaction
    const result = await prisma.$transaction(async (tx: any) => {

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