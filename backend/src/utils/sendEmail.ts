import nodemailer from 'nodemailer';

interface EmailOptions {
    email: string;
    subject: string;
    html: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
    // Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    // Email options
    const mailOptions = {
        from: `"Padel Arena" <${process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.html
    };

    // Send email
    await transporter.sendMail(mailOptions);
};

// Generate password reset email HTML
export const getPasswordResetEmail = (resetUrl: string, userName: string): string => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Réinitialisation du mot de passe</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0E0E11; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0E0E11; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #151518; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
                        <!-- Header -->
                        <tr>
                            <td align="center" style="padding: 40px 40px 20px;">
                                <h1 style="color: #ffd21f; margin: 0; font-size: 28px; font-weight: bold;">PADEL ARENA</h1>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 20px 40px;">
                                <h2 style="color: #ffffff; margin: 0 0 20px; font-size: 24px;">Bonjour ${userName},</h2>
                                <p style="color: rgba(255,255,255,0.7); font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                    Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
                                </p>
                                <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin: 0 0 30px;">
                                    Ce lien expire dans <strong style="color: #ffd21f;">1 heure</strong>.
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Button -->
                        <tr>
                            <td align="center" style="padding: 0 40px 30px;">
                                <a href="${resetUrl}" style="display: inline-block; background-color: #1349d3; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">
                                    Réinitialiser le mot de passe
                                </a>
                            </td>
                        </tr>
                        
                        <!-- Alternative link -->
                        <tr>
                            <td style="padding: 0 40px 30px;">
                                <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 0;">
                                    Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
                                </p>
                                <p style="color: #1349d3; font-size: 12px; word-break: break-all; margin: 10px 0 0;">
                                    ${resetUrl}
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Warning -->
                        <tr>
                            <td style="padding: 20px 40px; border-top: 1px solid rgba(255,255,255,0.1);">
                                <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0;">
                                    Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe restera inchangé.
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td align="center" style="padding: 20px 40px 40px;">
                                <p style="color: rgba(255,255,255,0.3); font-size: 11px; margin: 0;">
                                    © ${new Date().getFullYear()} Padel Arena. Tous droits réservés.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

export default sendEmail;
