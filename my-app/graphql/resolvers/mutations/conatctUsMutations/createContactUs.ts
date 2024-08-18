import { Context } from "@/pages/api/graphql";
import nodemailer from "nodemailer";

export const createContactUs = async (
  _: any,
  { input }: { input: ContactUsInput },
  { prisma }: Context
) => {
  try {
    const { subject, email, message, document, userId } = input;

    // Create the company info with the provided data
    const createdContactMessage = await prisma.contactUs.create({
      data: {
        userId: userId || undefined,
        subject,
        email,
        message,
        document: document || undefined,
      },
    });

    // Define the transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.NEXT_PUBLIC_NODEMAILER_EMAIL,
        pass: process.env.NEXT_PUBLIC_NODEMAILER_PASS,
      },
    });

    // Define the email content
    const mailOptions = {
        from: "bilelbourgou@gmail.com",
        to: email,
        subject: "Merci pour votre message",
        html: `
          <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Merci pour votre message</title>
            <style>
              body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
              table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
              img { -ms-interpolation-mode: bicubic; }
              img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
              table { border-collapse: collapse !important; }
              body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
              a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
              div[style*="margin: 16px 0;"] { margin: 0 !important; }
            </style>
          </head>
          <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td bgcolor="#0056b3" align="center">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                      <td align="center" valign="top" style="padding: 40px 10px 40px 10px;">
                        <a href="https://www.maisonng.com" target="_blank">
                          <img alt="Logo" src="https://www.maisonng.com/logo.png" width="100" height="100" style="display: block; width: 100px; max-width: 100px; min-width: 100px; font-family: 'Lato', Helvetica, Arial, sans-serif; color: #ffffff; font-size: 18px;" border="0">
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td bgcolor="#0056b3" align="center" style="padding: 0px 10px 0px 10px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                      <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                        <h1 style="font-size: 32px; font-weight: 400; margin: 0;">Merci pour votre message !</h1>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                      <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                        <p style="margin: 0;">Bonjour,</p>
                        <p style="margin: 20px 0;">Nous avons bien reçu votre message et nous vous remercions pour votre prise de contact.</p>
                        <p style="margin: 20px 0;">Votre message :</p>
                        <p style="margin: 0; padding: 10px; background-color: #f8f8f8; border-left: 4px solid #0056b3;">${message}</p>
                        <p style="margin: 20px 0;">Nous reviendrons vers vous dans les plus brefs délais.</p>
                      </td>
                    </tr>
                    <tr>
                      <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                        <p style="margin: 0;">Cordialement,<br>L'équipe de MaisonNg</p>
                      </td>
                    </tr>
                    <tr>
                      <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                        <p style="margin: 0;"><a href="https://www.maisonng.com" target="_blank" style="color: #0056b3;">www.maisonng.com</a></p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                      <td bgcolor="#FFECD1" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                        <h2 style="font-size: 20px; font-weight: 400; color: #111111; margin: 0;">Besoin d'aide ?</h2>
                        <p style="margin: 0;"><a href="https://www.maisonng.com/contact" target="_blank" style="color: #0056b3;">Nous sommes là pour vous</a></p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                      <td bgcolor="#f4f4f4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;">
                        <p style="margin: 0;">Vous recevez cet email car vous nous avez contacté via notre formulaire. Si vous n'êtes pas à l'origine de cette action, veuillez ignorer cet email.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      };

    // Send the email
    await transporter.sendMail(mailOptions);

    return "Message created and email sent";
  } catch (error) {
    console.error("Error creating Contact Message or sending email:", error);
    return new Error("Error creating Contact Message or sending email");
  }
};
