import { Request, Response } from 'express';
import Pricing from '../models/Pricing';
import Subscription from '../models/Subscription';

export const getPublicPricing = async (req: Request, res: Response) => {
    try {
        const type = req.query.type as string;
        const filter: any = { isActive: true };
        if (type) filter.type = type;
        const pricing = await Pricing.find(filter).sort({ order: 1 });
        res.json({ success: true, data: pricing });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

export const getAllPricing = async (req: Request, res: Response) => {
    try {
        const pricing = await Pricing.find().sort({ order: 1 });
        res.json({ success: true, data: pricing });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

export const createPricing = async (req: Request, res: Response) => {
    try {
        const pricing = await Pricing.create(req.body);

        // Sync with Subscription if type is subscription
        if (pricing.type === 'subscription') {
            await Subscription.create({
                _id: pricing._id,
                name: pricing.title,
                price: parseFloat(pricing.price || '0'),
                durationInMonths: pricing.durationInMonths || 1,
                features: pricing.features || [],
                isActive: pricing.isActive
            });
        }

        res.status(201).json({ success: true, data: pricing });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Données invalides' });
    }
};

export const updatePricing = async (req: Request, res: Response) => {
    try {
        const pricing = await Pricing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!pricing) return res.status(404).json({ success: false, message: 'Non trouvé' });

        // Sync with Subscription if type is subscription
        if (pricing.type === 'subscription') {
            await Subscription.findByIdAndUpdate(pricing._id, {
                name: pricing.title,
                price: parseFloat(pricing.price || '0'),
                durationInMonths: pricing.durationInMonths || 1,
                features: pricing.features || [],
                isActive: pricing.isActive
            }, { upsert: true });
        }

        res.json({ success: true, data: pricing });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Erreur mise à jour' });
    }
};

export const deletePricing = async (req: Request, res: Response) => {
    try {
        const pricing = await Pricing.findById(req.params.id);
        if (pricing && pricing.type === 'subscription') {
            await Subscription.findByIdAndDelete(pricing._id);
        }
        await Pricing.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Supprimé' });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Erreur suppression' });
    }
};
