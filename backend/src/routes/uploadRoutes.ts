import express from 'express';
import { upload } from '../config/cloudinary';

const router = express.Router();

router.post('/', upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({
      success: true,
      url: req.file.path,
      public_id: (req.file as any).filename
    });
  } else {
    res.status(400).json({ success: false, message: 'Upload failed' });
  }
});

export default router;
