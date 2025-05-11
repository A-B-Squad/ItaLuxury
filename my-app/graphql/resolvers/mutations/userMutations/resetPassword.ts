import bcrypt from 'bcryptjs';
import { Context } from "../../../../pages/api/graphql";
import nodemailer from "nodemailer";

// Function to send password reset confirmation email
const sendPasswordResetConfirmationEmail = async (email: string) => {
  try {
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

    // Base URL for your website
    const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://www.ita-luxury.com';

    // Logo path - using image from public folder
    const logoUrl = `${baseUrl}/LOGO.png`;

    await transporter.sendMail({
      from: '"ita-luxury" <no-reply@ita-luxury.com>',
      to: email,
      subject: "Confirmation de réinitialisation de mot de passe",
      html: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Confirmation de réinitialisation de mot de passe</title>
    <style>
        /* Base styles */
        body, html {
            margin: 0;
            padding: 0;
            font-family: 'Helvetica Neue', Arial, sans-serif;
            color: #333;
            line-height: 1.6;
            background-color: #f5f5f5;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        }
        
        .header {
            background-color: #ffffff;
            padding: 25px 0;
            text-align: center;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .logo {
            max-width: 150px;
            height: auto;
        }
        
        .content {
            padding: 30px 40px;
            background-color: #ffffff;
        }
        
        h1 {
            color: #c7ae91;
            font-size: 24px;
            font-weight: 600;
            margin-top: 0;
            margin-bottom: 15px;
        }
        
        p {
            margin-bottom: 20px;
            color: #666;
            font-size: 16px;
        }
        
        .button {
            display: inline-block;
            background-color: #c7ae91;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 4px;
            font-weight: 500;
            font-size: 16px;
            margin: 20px 0;
            text-align: center;
            transition: background-color 0.3s;
        }
        
        .button:hover {
            background-color: #b69c7f;
        }
        
        .footer {
            background-color: #f9f9f9;
            padding: 20px 40px;
            text-align: center;
            color: #777;
            font-size: 14px;
            border-top: 1px solid #f0f0f0;
        }
        
        .social-link {
            color: #c7ae91;
            text-decoration: none;
            font-weight: 500;
        }
        
        @media only screen and (max-width: 600px) {
            .content {
                padding: 25px 20px;
            }
            
            .footer {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div style="padding: 20px;">
        <div class="container">
            <div class="header">
                <img src="${logoUrl}" alt="ita-luxury Logo" class="logo">
            </div>
            
            <div class="content">
                <h1>Mot de passe réinitialisé avec succès</h1>
                
                <p>Bonjour,</p>
                
                <p>Nous vous confirmons que votre mot de passe a été réinitialisé avec succès.</p>
                
                <p>Si vous n'avez pas effectué cette action, veuillez contacter immédiatement notre service client ou sécuriser votre compte en réinitialisant à nouveau votre mot de passe.</p>
                
                <div style="text-align: center;">
                    <a href="${baseUrl}/signin" class="button">Se connecter</a>
                </div>
            </div>
            
            <div class="footer">
                <p>Contact : 23 212 892 | Instagram : <a href="https://www.instagram.com/ita_luxury" class="social-link">@ita_luxury</a></p>
                <p style="margin-bottom: 0;">&copy; ${new Date().getFullYear()} ita-luxury. Tous droits réservés.</p>
            </div>
        </div>
    </div>
</body>
</html>`,
    });
  } catch (error) {
    console.error("Failed to send password reset confirmation email:", error);
  }
};

export const resetPassword = async (
  _: any,
  { password, id }: { password: string, id: string },
  { prisma }: Context
) => {
  try {
    // Validate the token and find the user associated with it
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return "Invalid or expired token!";
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });

    // Send confirmation email
    if (user.email) {
      await sendPasswordResetConfirmationEmail(user.email);
    }

    return "Password reset successfully!";
  } catch (error) {
    console.error("Error in resetPassword function:", error);
    return "An error occurred, please try again later.";
  }
};
