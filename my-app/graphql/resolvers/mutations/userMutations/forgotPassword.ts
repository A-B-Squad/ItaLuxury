import { Context } from "../../../../pages/api/graphql";
import nodemailer from "nodemailer";

const sendResetPasswordEmail = async (email: string, id: string) => {
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

		const resetPasswordUrl = `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/ResetPassword/${id}`;

		await transporter.sendMail({
			from: '"ita-luxury" <no-reply@ita-luxury.com>',
			to: email,
			subject: "Réinitialisation de votre mot de passe",
			html: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Réinitialisation de mot de passe</title>
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
        
        h2 {
            color: #333;
            font-size: 18px;
            font-weight: 400;
            margin-top: 0;
            margin-bottom: 20px;
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
        
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        
        .url-note {
            background-color: #f9f9f9;
            border-radius: 4px;
            padding: 15px;
            margin-top: 25px;
            font-size: 14px;
            color: #777;
            word-break: break-all;
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
            
            h1 {
                font-size: 22px;
            }
            
            h2 {
                font-size: 16px;
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
                <h1>Réinitialisation de votre mot de passe</h1>
                <h2>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte ita-luxury.</h2>
                
                <p>Si vous n'avez pas fait cette demande, vous pouvez ignorer cet e-mail en toute sécurité. Sinon, veuillez cliquer sur le bouton ci-dessous pour réinitialiser votre mot de passe :</p>
                
                <div class="button-container">
                    <a href="${resetPasswordUrl}" class="button">Réinitialiser mon mot de passe</a>
                </div>
                
                <p>Ce lien expirera dans 24 heures.</p>
                
                <div class="url-note">
                    <p style="margin-top: 0; margin-bottom: 10px;">Si vous rencontrez des difficultés pour cliquer sur le bouton, copiez et collez l'URL ci-dessous dans votre navigateur web :</p>
                    <p style="margin-bottom: 0; font-size: 13px;">${resetPasswordUrl}</p>
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
		console.error("Failed to send reset password email:", error);
		throw new Error("Failed to send reset password email");
	}
};

export const forgotPassword = async (
	_: any,
	{ email }: { email: string },
	{ prisma }: Context
) => {
	try {
		// Check if the email exists in the database
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			throw new Error("User doesn't exist!");
		}

		// Send the reset password email
		await sendResetPasswordEmail(email, user.id);

		return "Email sent successfully";
	} catch (error) {
		console.error("Error in forgotPassword function:", error);
		throw new Error("An error occurred, please try again later.");
	}
};
