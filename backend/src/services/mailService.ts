import path from 'path';
import nodemailer from 'nodemailer';
import fs from 'fs';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

interface MailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
    attachments?: any[];
}

export const sendEmail = async (options: MailOptions) => {
    try {
        // Robust logo path detection for Local vs Prod
        const possiblePaths = [
            path.join(process.cwd(), '..', 'public', 'IMAGES', 'newLogo_tr.png'),
            path.join(process.cwd(), 'public', 'IMAGES', 'newLogo_tr.png'),
            path.resolve(__dirname, '../../public/IMAGES/newLogo_tr.png'),
            'c:/ALTERNANCE/padel_arena/public/IMAGES/newLogo_tr.png'
        ];

        let logoPath = '';
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                logoPath = p;
                break;
            }
        }

        const attachments = [...(options.attachments || [])];
        if (logoPath) {
            attachments.push({
                filename: 'logo.png',
                path: logoPath,
                cid: 'logo'
            });
        } else {
            console.warn('⚠️ Logo file not found, sending email without logo attachment.');
        }

        const mailOptions: any = {
            from: `"Padel Arena" <${process.env.SMTP_EMAIL}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html || options.text.replace(/\n/g, '<br>'),
            attachments
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent: %s', info.messageId);
        return info;
    } catch (error: any) {
        console.error('❌ Error sending email:', error.message);
        // Special hint for production SMTP issues
        if (error.code === 'EAUTH') {
            console.error('🔒 Erreur d\'authentification SMTP : Vérifiez vos variables d\'environnement SMTP_EMAIL et SMTP_PASSWORD en production.');
        }
        throw error;
    }
};

/**
 * Generates a premium HTML template for emails
 */
export const getEmailTemplate = (title: string, content: string) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { 
                background-color: #030303; 
                margin: 0; 
                padding: 0; 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                -webkit-font-smoothing: antialiased;
            }
            .container { 
                max-width: 600px; 
                margin: 40px auto; 
                background: #0D0D10; 
                border-radius: 32px;
                overflow: hidden;
                border: 1px solid rgba(255,255,255,0.05);
                box-shadow: 0 40px 100px rgba(0,0,0,0.5);
            }
            .header {
                padding: 50px 40px;
                text-align: center;
                background: linear-gradient(180deg, #151518 0%, #0D0D10 100%);
            }
            .logo { 
                height: 100px;
                width: auto;
                margin-bottom: 24px;
                filter: drop-shadow(0 0 10px rgba(0,102,255,0.3));
            }
            .content { 
                padding: 20px 50px 50px 50px; 
                color: #e4e4e7;
                line-height: 1.8;
                font-size: 16px;
            }
            .title {
                color: #ffffff;
                font-weight: 800;
                font-size: 28px;
                text-transform: uppercase;
                letter-spacing: -1.5px;
                margin-bottom: 32px;
                text-align: center;
                line-height: 1.1;
                font-style: italic;
            }
            .paragraph {
                margin-bottom: 20px;
                color: rgba(255,255,255,0.7);
            }
            .highlight {
                color: #0066FF;
                font-weight: 700;
            }
            .divider {
                height: 1px;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                margin: 40px 0;
            }
            .footer {
                padding: 40px;
                text-align: center;
                background: #08080A;
                border-top: 1px solid rgba(255,255,255,0.03);
            }
            .footer-text {
                color: rgba(255,255,255,0.2);
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 3px;
                margin-bottom: 12px;
            }
            .social-hint {
                color: rgba(0,102,255,0.4);
                font-size: 9px;
                font-weight: 800;
                letter-spacing: 1px;
                text-transform: uppercase;
            }
            .btn {
                display: inline-block;
                padding: 18px 40px;
                background: #0066FF;
                color: #ffffff !important;
                text-decoration: none;
                border-radius: 16px;
                font-weight: 800;
                text-transform: uppercase;
                font-size: 13px;
                letter-spacing: 1.5px;
                margin-top: 20px;
                box-shadow: 0 10px 25px rgba(0,102,255,0.3);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <a href="${process.env.CLIENT_URL || '#'}">
                    <img src="cid:logo" alt="Padel Arena" class="logo">
                </a>
            </div>
            <div class="content">
                <div class="title">${title}</div>
                <div class="inner-content">
                    ${content.split('\n').map(p => {
        const trimmed = p.trim();
        if (!trimmed) return '<div class="divider"></div>';
        const withBold = trimmed.replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>');
        return `<p class="paragraph">${withBold}</p>`;
    }).join('')}
                </div>
            </div>
            <div class="footer">
                <div class="footer-text">© 2026 PADEL ARENA VENDÔME</div>
                <div class="social-hint">Elite Performance • Premium Experience</div>
            </div>
        </div>
    </body>
    </html>
    `;
};

/**
 * Generates the password reset email HTML using the premium template
 */
export const getPasswordResetEmail = (resetUrl: string, userName: string) => {
    const content = `
        Bonjour <span class="highlight">${userName}</span>,
        
        Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Padel Arena.
        
        Cliquez sur le bouton ci-dessous pour sécuriser votre compte avec un nouveau mot de passe :
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="${resetUrl}" class="btn">Réinitialiser</a>
        </div>
        
        Si vous n'avez pas demandé ce changement, vous pouvez ignorer cet email en toute sécurité. 
        Ce lien expirera dans 1 heure.
    `;
    return getEmailTemplate('Sécurité du Compte', content);
};

/**
 * Generates the Welcome email HTML
 */
export const getWelcomeEmail = (userName: string) => {
    const content = `
        Félicitations <span class="highlight">${userName}</span> !
        
        Votre compte Padel Arena est maintenant actif. Bienvenue dans l'élite du padel à Vendôme.
        
        Vous avez désormais accès à :
        • Réservation de terrains en temps réel
        • Inscriptions aux tournois et académies
        • Suivi de vos performances et statistiques
        
        Prêt pour votre premier match ?
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL || '#'}/book" class="btn">Réserver un terrain</a>
        </div>
    `;
    return getEmailTemplate('Bienvenue dans l\'Élite', content);
};
