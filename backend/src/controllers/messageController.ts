import { Request, Response } from 'express';
import Message from '../models/Message';
import { asyncHandler } from '../utils/asyncHandler';
import { sendEmail, getEmailTemplate } from '../services/mailService';

// @desc    Get all messages (Mailbox)
// @route   GET /api/messages
// @access  Private (Admin)
export const getMessages = asyncHandler(async (req: Request, res: Response) => {
    // Return only root messages (not replies)
    const messages = await Message.find({ parentMessage: null })
        .sort('-createdAt')
        .populate('parentMessage');

    const unreadCount = await Message.countDocuments({ status: 'UNREAD', parentMessage: null });
    const repliedCount = await Message.countDocuments({ status: 'REPLIED', parentMessage: null });

    res.status(200).json({
        success: true,
        data: messages,
        count: messages.length,
        unreadCount,
        repliedCount
    });
});

// @desc    Get message with history
// @route   GET /api/messages/:id
// @access  Private (Admin)
export const getMessage = asyncHandler(async (req: Request, res: Response) => {
    const message = await Message.findById(req.params.id);
    if (!message) {
        return res.status(404).json({ success: false, message: 'Message non trouvé' });
    }

    // Mark as read if it was unread
    if (message.status === 'UNREAD') {
        message.status = 'READ';
        await message.save();
    }

    // Fetch replies / history
    const history = await Message.find({
        $or: [
            { _id: req.params.id },
            { parentMessage: req.params.id }
        ]
    }).sort('createdAt');

    res.status(200).json({
        success: true,
        data: history
    });
});

// @desc    Reply to a message
// @route   POST /api/messages/:id/reply
// @access  Private (Admin)
export const replyToMessage = asyncHandler(async (req: Request, res: Response) => {
    const { content, subject } = req.body;
    const originalMessage = await Message.findById(req.params.id);

    if (!originalMessage) {
        return res.status(404).json({ success: false, message: 'Message original non trouvé' });
    }

    // Create the reply in DB
    const reply = await Message.create({
        senderName: 'Equipe Padel Arena',
        senderEmail: process.env.SMTP_EMAIL || 'contact@padelarena.fr',
        subject: subject || `Re: ${originalMessage.subject}`,
        content,
        status: 'READ',
        type: 'OUTBOUND',
        parentMessage: originalMessage._id
    });

    // Send the actual email
    await sendEmail({
        to: originalMessage.senderEmail,
        subject: reply.subject,
        text: reply.content,
        html: getEmailTemplate(
            'Réponse de l\'équipe',
            `
            ${reply.content.replace(/\n/g, '<br>')}
            <br><br>
            <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px; margin-top: 20px; border: 1px solid rgba(255,255,255,0.05);">
                <p style="font-size: 10px; color: rgba(255,255,255,0.3); margin-top: 0; text-transform: uppercase; font-weight: 900; letter-spacing: 1px;">Message Original</p>
                <p style="font-style: italic; color: rgba(255,255,255,0.5); font-size: 13px; margin-bottom: 0;">${originalMessage.content.replace(/\n/g, '<br>')}</p>
            </div>
            `
        )
    });

    // Update original message status
    originalMessage.status = 'REPLIED';
    await originalMessage.save();

    res.status(201).json({
        success: true,
        data: reply
    });
});

// @desc    Delete message conversation
// @route   DELETE /api/messages/:id
// @access  Private (Admin)
export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
    // Delete the root and all its children (replies)
    await Message.deleteMany({
        $or: [
            { _id: req.params.id },
            { parentMessage: req.params.id }
        ]
    });

    res.status(200).json({
        success: true,
        message: 'Conversation supprimée avec succès'
    });
});

// @desc    Process a new message from Contact Form
// @route   POST /api/messages/contact
// @access  Public
export const contactForm = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, subject, message } = req.body;

    const newMessage = await Message.create({
        senderName: name,
        senderEmail: email,
        subject,
        content: message,
        status: 'UNREAD',
        type: 'INBOUND'
    });

    res.status(201).json({
        success: true,
        message: 'Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.'
    });
});

// @desc    Get user's own messages
// @route   GET /api/messages/me
// @access  Private (User)
export const getMyMessages = asyncHandler(async (req: any, res: Response) => {
    const userEmail = req.user.email;

    // Find all root messages sent by this user
    const messages = await Message.find({
        senderEmail: userEmail,
        parentMessage: null
    }).sort('-createdAt');

    res.status(200).json({
        success: true,
        data: messages
    });
});

// @desc    Get player's message history
// @route   GET /api/messages/me/:id
// @access  Private (User)
export const getMyMessageHistory = asyncHandler(async (req: any, res: Response) => {
    const { id } = req.params;
    const userEmail = req.user.email;

    const rootMessage = await Message.findById(id);
    if (!rootMessage) {
        return res.status(404).json({ success: false, message: 'Message non trouvé' });
    }

    // Security: verify ownership
    if (rootMessage.senderEmail !== userEmail) {
        return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    const history = await Message.find({
        $or: [
            { _id: id },
            { parentMessage: id }
        ]
    }).sort('createdAt');

    res.status(200).json({
        success: true,
        data: history
    });
});

// @desc    Reply to a conversation as a player
// @route   POST /api/messages/me/:id/reply
// @access  Private (User)
export const replyAsPlayer = asyncHandler(async (req: any, res: Response) => {
    const { content } = req.body;
    const { id } = req.params;
    const user = req.user;

    const originalMessage = await Message.findById(id);
    if (!originalMessage) {
        return res.status(404).json({ success: false, message: 'Conversation non trouvée' });
    }

    // Security check: ensure the user is part of the conversation
    if (originalMessage.senderEmail !== user.email) {
        return res.status(403).json({ success: false, message: 'Non autorisé' });
    }

    const reply = await Message.create({
        senderName: user.name,
        senderEmail: user.email,
        subject: `Re: ${originalMessage.subject}`,
        content,
        status: 'UNREAD', // Admin will see it as unread
        type: 'INBOUND',
        parentMessage: originalMessage._id
    });

    // Reset status of original conversation so admin sees it as active
    originalMessage.status = 'UNREAD';
    await originalMessage.save();

    res.status(201).json({
        success: true,
        data: reply
    });
});
