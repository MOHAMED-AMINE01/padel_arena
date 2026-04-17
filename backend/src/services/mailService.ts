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
                font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                -webkit-font-smoothing: antialiased;
            }
            .container { 
                max-width: 600px; 
                margin: 40px auto; 
                background: #0D0D10; 
                border-radius: 40px;
                overflow: hidden;
                border: 1px solid rgba(255,255,255,0.05);
                box-shadow: 0 40px 100px rgba(0,0,0,0.8);
            }
            .header {
                padding: 60px 40px;
                text-align: center;
                background: linear-gradient(180deg, #151518 0%, #0D0D10 100%);
                position: relative;
            }
            .logo { 
                height: 80px;
                width: auto;
                margin-bottom: 24px;
                filter: drop-shadow(0 0 15px rgba(0,102,255,0.4));
            }
            .content { 
                padding: 20px 60px 60px 60px; 
                color: #e4e4e7;
                line-height: 1.8;
                font-size: 16px;
            }
            .title {
                color: #ffffff;
                font-weight: 900;
                font-size: 32px;
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
                font-weight: 500;
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
                padding: 50px 40px;
                text-align: center;
                background: #08080A;
                border-top: 1px solid rgba(255,255,255,0.03);
            }
            .footer-text {
                color: rgba(255,255,255,0.3);
                font-size: 11px;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 4px;
                margin-bottom: 16px;
            }
            .social-hint {
                color: #0066FF;
                font-size: 10px;
                font-weight: 900;
                letter-spacing: 2px;
                text-transform: uppercase;
                opacity: 0.6;
            }
            .btn {
                display: inline-block;
                padding: 20px 48px;
                background: linear-gradient(135deg, #0066FF 0%, #0044BB 100%);
                color: #ffffff !important;
                text-decoration: none;
                border-radius: 20px;
                font-weight: 900;
                text-transform: uppercase;
                font-size: 12px;
                letter-spacing: 2px;
                margin-top: 24px;
                box-shadow: 0 15px 35px rgba(0,102,255,0.4);
            }
            .accent-bar {
                height: 4px;
                background: linear-gradient(90deg, #0066FF, #F2FF44);
                width: 100%;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="accent-bar"></div>
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
        
        // Custom link styling
        let processed = trimmed.replace(/<a (.*?)class="btn"(.*?)>(.*?)<\/a>/g, '<div style="text-align: center;">$0</div>');
        
        const withBold = processed.replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>');
        return `<p class="paragraph">${withBold}</p>`;
    }).join('')}
                </div>
            </div>
            <div class="footer">
                <div class="footer-text">© 2026 PADEL ARENA VENDÔME</div>
                <div class="social-hint">Perform with Excellence</div>
                <div style="margin-top: 24px; font-size: 9px; color: rgba(255,255,255,0.15); letter-spacing: 1px;">
                    Vous recevez cet email car vous êtes membre de la communauté Padel Arena.<br>
                    Pour ne plus recevoir nos emails, <a href="${process.env.CLIENT_URL || '#'}/unsubscribe" style="color: inherit; text-decoration: underline;">cliquez ici</a>.
                </div>
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

/**
 * Generates the Newsletter Welcome email HTML
 */
export const getNewsletterWelcomeEmail = (email: string) => {
    const content = `
        Merci de votre inscription à notre newsletter !
        
        Vous faites désormais partie de la communauté Padel Arena. Vous recevrez en avant-première :
        • Nos dernières actualités et événements
        • Des offres exclusives et codes promos
        • Des invitations pour nos tournois premium
        
        Restez connecté, l'élite n'attend pas.
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL || '#'}" class="btn">Visiter le Club</a>
        </div>
    `;
    return getEmailTemplate('Bienvenue dans la Communauté', content);
};
