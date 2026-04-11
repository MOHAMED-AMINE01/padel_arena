require('dotenv').config({ path: '../.env' });
if (!process.env.SMTP_EMAIL) {
    require('dotenv').config({ path: '.env' });
}
const nodemailer = require('nodemailer');
const path = require('path');

const logoPath = path.resolve(__dirname, '../../public/IMAGES/newLogo_tr.png');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

const getEmailTemplate = (title, content) => {
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
                height: 70px;
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
                <img src="cid:logo" alt="Padel Arena" class="logo">
            </div>
            <div class="content">
                <div class="title">${title}</div>
                <div class="inner-content">
                    ${content}
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

async function sendTestEmail() {
    const recipient = process.env.SMTP_EMAIL; // Send to yourself
    console.log(`📧 Envoi du test email à: ${recipient}`);
    console.log(`📁 Logo: ${logoPath}`);

    const testContent = `
        <p class="paragraph">Félicitations <span class="highlight">Padel Arena</span> !</p>
        <p class="paragraph">Ceci est un <span class="highlight">email de test</span> pour vérifier le rendu premium de vos communications.</p>
        <div class="divider"></div>
        <p class="paragraph">Votre court est réservé avec succès :</p>
        <p class="paragraph">Terrain : <span class="highlight">Terrain Central</span></p>
        <p class="paragraph">Date : <span class="highlight">11/04/2026</span></p>
        <p class="paragraph">Heure : <span class="highlight">10:00</span></p>
        <div class="divider"></div>
        <p class="paragraph">À très vite sur les pistes !</p>
        <div style="text-align: center; margin-top: 30px;">
            <a href="#" class="btn">Réserver un terrain</a>
        </div>
    `;

    try {
        const info = await transporter.sendMail({
            from: `"Padel Arena" <${process.env.SMTP_EMAIL}>`,
            to: recipient,
            subject: '🎾 TEST - Email Premium Padel Arena',
            text: 'Test email premium Padel Arena',
            html: getEmailTemplate('Réservation Confirmée', testContent),
            attachments: [
                {
                    filename: 'logo.png',
                    path: logoPath,
                    cid: 'logo'
                }
            ]
        });

        console.log('✅ Email envoyé avec succès!');
        console.log('   Message ID:', info.messageId);
        console.log('   Vérifiez votre boîte mail !');
    } catch (err) {
        console.error('❌ Erreur:', err.message);
    }

    process.exit(0);
}

sendTestEmail();
