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

    const resetPasswordUrl = `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/ResetPassword/${id}`;

    await transporter.sendMail({
      from: '"ita-luxury" <no-reply@ita-luxury.com>',
      to: email,
      subject: "Reset your password",
      html: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title></title>
    
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,600" rel="stylesheet" type="text/css">
    <!--[if mso]>
    <style>
        * {
            font-family: 'Roboto', sans-serif !important;
        }
    </style>
    <![endif]-->

    <!-- CSS Reset : BEGIN -->
    <style>
        html,
        body {
            margin: 0 auto !important;
            padding: 0 !important;
            height: 100% !important;
            width: 100% !important;
            background: #f1f1f1;
        }

        * {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
        }

        div[style*="margin: 16px 0"] {
            margin: 0 !important;
        }

        table,
        td {
            mso-table-lspace: 0pt !important;
            mso-table-rspace: 0pt !important;
        }

        table {
            border-spacing: 0 !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
            margin: 0 auto !important;
        }

        img {
            -ms-interpolation-mode:bicubic;
        }

        a {
            text-decoration: none;
        }

        *[x-apple-data-detectors],  /* iOS */
        .unstyle-auto-detected-links *,
        .aBn {
            border-bottom: 0 !important;
            cursor: default !important;
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        .a6S {
            display: none !important;
            opacity: 0.01 !important;
        }

        .im {
            color: inherit !important;
        }

        img.g-img + div {
            display: none !important;
        }

        @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
            u ~ div .email-container {
                min-width: 320px !important;
            }
        }
        @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
            u ~ div .email-container {
                min-width: 375px !important;
            }
        }
        @media only screen and (min-device-width: 414px) {
            u ~ div .email-container {
                min-width: 414px !important;
            }
        }

    </style>
    <!-- CSS Reset : END -->

    <!-- Progressive Enhancements : BEGIN -->
    <style>

	    .primary{
	        background: #f17e7e;
	    }
	    .bg_white{
	        background: #ffffff;
	    }
	    .bg-white{
	        background: #f7fafa;
	    }
	    .bg_black{
	        background: #000000;
	    }
	    .bg_dark{
	        background: rgba(0,0,0,.8);
	    }
	    .email-section{
	        padding:2.5em;
	    }

	    /*BUTTON*/
	    .btn{
	        padding: 10px 15px;
	        display: inline-block;
	    }
	    .btn.btn-primary{
	        border-radius: 5px;
	        background: #f17e7e;
	        color: #ffffff;
	    }
	    .btn.btn-white{
	        border-radius: 5px;
	        background: #ffffff;
	        color: #000000;
	    }
	    .btn.btn-white-outline{
	        border-radius: 5px;
	        background: transparent;
	        border: 1px solid #fff;
	        color: #fff;
	    }
	    .btn.btn-black-outline{
	        border-radius: 0px;
	        background: transparent;
	        border: 2px solid #000;
	        color: #000;
	        font-weight: 700;
	    }
	    .btn-custom{
	        color: rgba(0,0,0,.3);
	        text-decoration: underline;
	    }

	    h1,h2,h3,h4,h5,h6{
	        font-family: 'Roboto', sans-serif;
	        color: #000000;
	        margin-top: 0;
	        font-weight: 400;
	    }

	    body{
	        font-family: 'Roboto', sans-serif;
	        font-weight: 400;
	        font-size: 15px;
	        line-height: 1.8;
	        color: rgba(0,0,0,.4);
	    }

	    a{
	        color: #f17e7e;
	    }

	    table{
	    }
	    /*LOGO*/

	    .logo h1{
	        margin: 0;
	    }
	    .logo h1 a{
	        color: #f17e7e;
	        font-size: 24px;
	        font-weight: 700;
	        font-family: 'Roboto', sans-serif;
	    }

	    /*HERO*/
	    .hero{
	        position: relative;
	        z-index: 0;
	    }

	    .hero .text{
	        color: rgba(0,0,0,.3);
	    }
	    .hero .text h2{
	        color: #000;
	        font-size: 34px;
	        margin-bottom: 15px;
	        font-weight: 300;
	        line-height: 1.2;
	    }
	    .hero .text h3{
	        font-size: 24px;
	        font-weight: 200;
	    }
	    .hero .text h2 span{
	        font-weight: 600;
	        color: #000;
	    }

	    /*PRODUCT*/
	    .product-entry{
	        display: block;
	        position: relative;
	        float: left;
	        padding-top: 20px;
	    }
	    .product-entry .text{
	        width: calc(100% - 125px);
	        padding-left: 20px;
	    }
	    .product-entry .text h3{
	        margin-bottom: 0;
	        padding-bottom: 0;
	    }
	    .product-entry .text p{
	        margin-top: 0;
	    }
	    .product-entry img, .product-entry .text{
	        float: left;
	    }

	    ul.social{
	        padding: 0;
	    }
	    ul.social li{
	        display: inline-block;
	        margin-right: 10px;
	    }

	    /*FOOTER*/

	    .footer{
	        border-top: 1px solid rgba(0,0,0,.05);
	        color: rgba(0,0,0,.5);
	    }
	    .footer .heading{
	        color: #000;
	        font-size: 20px;
	    }
	    .footer ul{
	        margin: 0;
	        padding: 0;
	    }
	    .footer ul li{
	        list-style: none;
	        margin-bottom: 10px;
	    }
	    .footer ul li a{
	        color: rgba(0,0,0,1);
	    }


	    @media screen and (max-width: 500px) {


	    }

    </style>

</head>

<body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f1f1f1;">
	<center style="width: 100%; background-color: #f1f1f1;">
    <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
    </div>
    <div style="max-width: 600px; margin: 0 auto;" class="email-container">
    	<!-- BEGIN BODY -->
      <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
      	<tr>
          <td valign="top" class="bg_white" style="padding: 1em 2.5em 0 2.5em;">
          	<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          		<tr>
          			<td class="logo" style="text-align: left;">
			            <h1><a href="#">ita-luxury</a></h1>
			          </td>
          		</tr>
          	</table>
          </td>
	      </tr><!-- end tr -->
				<tr>
          <td valign="middle" class="hero bg_white" style="padding: 2em 0 2em 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            	<tr>
            		<td style="padding: 0 2.5em; text-align: left;">
            			<div class="text">
            				<h2>Reset Your Password</h2>
            				<h3>We received a request to reset your password for your ita-luxury account.</h3>
            			</div>
            		</td>
            	</tr>
            </table>
          </td>
	      </tr><!-- end tr -->
	      <tr>
	      	<td class="bg_white">
	      		<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
	      			<tr>
	      				<td class="bg-white email-section" style="padding: 0; width: 100%;">
	      					<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
	      						<tr>
	      							<td valign="middle" width="50%">
	      								<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
	      									<tr>
	      										<td class="text-services" style="text-align: left; padding: 20px 30px;">
	      											<div class="heading-section">
		      											<h2 style="font-size: 22px;">Instructions</h2>
		      											<p>To reset your password, please follow these steps:</p>
		      											<p>1. Click on the button below</p>
		      											<p>2. You will be directed to a secure page</p>
		      											<p>3. Enter your new password</p>
		      											<p>4. Confirm your new password</p>
		      											<p>
		      												<a href="${resetPasswordUrl}" class="btn btn-primary">Reset Password</a>
		      											</p>
	      											</div>
	      										</td>
	      									</tr>
	      								</table>
	      							</td>
	      						</tr>
	      					</table>
	      				</td>
	      			</tr><!-- end: tr -->
	      		</table>
	      	</td>
	      </tr><!-- end:tr -->
      </table>
      <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
      	<tr>
          <td valign="middle" class="bg-white footer email-section">
            <table>
            	<tr>
                <td valign="top" width="33.333%" style="padding-top: 20px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td style="text-align: left; padding-right: 10px;">
                      	<h3 class="heading">About</h3>
                      	<p>ita-luxury is your premier destination for luxury fashion and accessories.</p>
                      </td>
                    </tr>
                  </table>
                </td>
                    </tr>
                  </table>
                </td>
                <td valign="top" class="bg-white" width="33.333%" style="padding-top: 20px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td style="text-align: left; padding-left: 10px;">
                      	<h3 class="heading">Useful Links</h3>
                      	<ul>
					                <li><a href=${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}>Home</a></li>
					                <li><a href=${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/FavoriteList>Wishlist</a></li>
					                <li><a href=${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/TrackingPackages>Order History</a></li>
					              </ul>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr><!-- end: tr -->
        <tr>
        	<td valign="middle" class="bg-white footer email-section">
        		<table>
            	<tr>
                <td valign="top" width="100%">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td style="text-align: left; padding-right: 10px;">
                      	<p>&copy; 2024 ita-luxury. All Rights Reserved</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
        	</td>
        </tr>
      </table>

    </div>
  </center>
</body>
</html>
      `,
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
