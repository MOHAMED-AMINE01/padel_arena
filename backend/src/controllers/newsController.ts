import { Request, Response } from 'express';
import News from '../models/News';

export const getPublicNews = async (req: Request, res: Response) => {
    try {
        const news = await News.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
        res.json({ success: true, data: news });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

export const getAllNews = async (req: Request, res: Response) => {
    try {
        const news = await News.find().sort({ order: 1, createdAt: -1 });
        res.json({ success: true, data: news });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

export const createNews = async (req: Request, res: Response) => {
    try {
        const news = await News.create(req.body);
        res.status(201).json({ success: true, data: news });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Données invalides' });
    }
};

export const updateNews = async (req: Request, res: Response) => {
    try {
        const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!news) return res.status(404).json({ success: false, message: 'Non trouvé' });
        res.json({ success: true, data: news });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Erreur mise à jour' });
    }
};

export const deleteNews = async (req: Request, res: Response) => {
    try {
        await News.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Supprimé' });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Erreur suppression' });
    }
};
