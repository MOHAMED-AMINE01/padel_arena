import { Request, Response } from 'express';
import { TeamMember } from '../models/TeamMember';

export const getAllTeamMembers = async (req: Request, res: Response) => {
  try {
    const members = await TeamMember.find({ active: true }).sort({ order: 1 });
    res.json({ success: true, data: members });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminGetTeamMembers = async (req: Request, res: Response) => {
  try {
    const members = await TeamMember.find().sort({ order: 1 });
    res.json({ success: true, data: members });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTeamMember = async (req: Request, res: Response) => {
  try {
    const member = await TeamMember.create(req.body);
    res.json({ success: true, data: member });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTeamMember = async (req: Request, res: Response) => {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: member });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTeamMember = async (req: Request, res: Response) => {
  try {
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Team member deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
