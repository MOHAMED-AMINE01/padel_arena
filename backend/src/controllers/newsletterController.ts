import { Request, Response } from 'express';
import NewsletterSubscriber from '../models/NewsletterSubscriber';
import { asyncHandler } from '../utils/asyncHandler';
import { sendEmail } from '../services/mailService';

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
export const subscribe = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email requis' });
    }

    let subscriber = await NewsletterSubscriber.findOne({ email });

    if (subscriber) {
        if (subscriber.isActive) {
            return res.status(400).json({ success: false, message: 'Déjà inscrit' });
        }
        subscriber.isActive = true;
        await subscriber.save();
    } else {
        subscriber = await NewsletterSubscriber.create({ email });
    }

    res.status(201).json({
        success: true,
        message: 'Inscription réussie'
    });
});

// @desc    Get all subscribers
// @route   GET /api/newsletter/subscribers
// @access  Private (Admin)
export const getSubscribers = asyncHandler(async (req: Request, res: Response) => {
    const subscribers = await NewsletterSubscriber.find().sort('-createdAt');
    res.status(200).json({
        success: true,
        count: subscribers.length,
        data: subscribers
    });
});

// @desc    Send newsletter to all active subscribers
// @route   POST /api/newsletter/send
// @access  Private (Admin)
export const sendNewsletter = asyncHandler(async (req: Request, res: Response) => {
    const { subject, content, htmlContent } = req.body;

    if (!subject || !content) {
        return res.status(400).json({ success: false, message: 'Sujet et contenu requis' });
    }

    const subscribers = await NewsletterSubscriber.find({ isActive: true });

    if (subscribers.length === 0) {
        return res.status(400).json({ success: false, message: 'Aucun inscrit actif' });
    }

    // Send emails (in production, use a queue like BullMQ or a service like Resend/SendGrid)
    // For now, we'll send them in parallel (fine for small subscriber counts)
    const emailPromises = subscribers.map(sub =>
        sendEmail({
            to: sub.email,
            subject,
            text: content,
            html: htmlContent // We'll pass the styled HTML from frontend
        }).catch(err => console.error(`Failed to send to ${sub.email}:`, err))
    );

    await Promise.all(emailPromises);

    res.status(200).json({
        success: true,
        message: `Newsletter envoyée à ${subscribers.length} abonnés`
    });
});

// @desc    Toggle subscriber status
// @route   PATCH /api/newsletter/subscribers/:id
// @access  Private (Admin)
export const toggleSubscriber = asyncHandler(async (req: Request, res: Response) => {
    const subscriber = await NewsletterSubscriber.findById(req.params.id);
    if (!subscriber) {
        return res.status(404).json({ success: false, message: 'Abonné non trouvé' });
    }

    subscriber.isActive = !subscriber.isActive;
    await subscriber.save();

    res.status(200).json({
        success: true,
        data: subscriber
    });
});

// @desc    Delete subscriber
// @route   DELETE /api/newsletter/subscribers/:id
// @access  Private (Admin)
export const deleteSubscriber = asyncHandler(async (req: Request, res: Response) => {
    const subscriber = await NewsletterSubscriber.findById(req.params.id);
    if (!subscriber) {
        return res.status(404).json({ success: false, message: 'Abonné non trouvé' });
    }

    await subscriber.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Abonné supprimé'
    });
});
