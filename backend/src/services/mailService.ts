import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

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
}

export const sendEmail = async (options: MailOptions) => {
    try {
        const info = await transporter.sendMail({
            from: `"Padel Arena" <${process.env.SMTP_EMAIL}>`,
            to: options.to,
            subject: options.subject, // Clean for subject line
            text: options.text,
            html: options.html || options.text.replace(/\n/g, '<br>')
        });
        console.log('✅ Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Error sending email:', error);
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
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { 
                background-color: #050505; 
                margin: 0; 
                padding: 0; 
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            .container { 
                max-width: 600px; 
                margin: 40px auto; 
                background: #0C0C0E; 
                border: 1px solid rgba(255,255,255,0.05);
                border-radius: 24px;
                overflow: hidden;
            }
            .header {
                background: #151518;
                padding: 40px;
                text-align: center;
                border-bottom: 1px solid rgba(255,255,255,0.05);
            }
            .logo { 
                height: 60px;
                margin-bottom: 20px;
            }
            .content { 
                padding: 40px; 
                color: rgba(255,255,255,0.8);
                line-height: 1.6;
                font-size: 16px;
            }
            .title {
                color: #ffffff;
                font-weight: 900;
                font-size: 24px;
                text-transform: uppercase;
                letter-spacing: -1px;
                margin-bottom: 24px;
                text-align: center;
            }
            .footer {
                padding: 30px;
                text-align: center;
                background: #08080A;
                border-top: 1px solid rgba(255,255,255,0.05);
            }
            .footer-text {
                color: rgba(255,255,255,0.2);
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 2px;
            }
            .accent { color: #0066FF; }
            .button {
                display: inline-block;
                padding: 14px 30px;
                background: #0066FF;
                color: white;
                text-decoration: none;
                border-radius: 12px;
                font-weight: 900;
                text-transform: uppercase;
                font-size: 12px;
                letter-spacing: 1px;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin:0; color:#fff; font-size: 28px; font-weight:900; letter-spacing:-1.5px; text-transform:uppercase;">
                    PADEL<span style="color:#0066FF;">ARENA</span>
                </h1>
            </div>
            <div class="content">
                <div class="title">${title}</div>
                ${content.split('\n').map(p => `<p>${p}</p>`).join('')}
            </div>
            <div class="footer">
                <div class="footer-text">© 2026 Padel Arena Vendôme • Elite Sync Enabled</div>
            </div>
        </div>
    </body>
    </html>
    `;
};
