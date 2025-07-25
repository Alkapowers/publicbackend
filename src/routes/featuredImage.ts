import express from 'express';
import { FeaturedImage } from '../models/FeaturedImage';
import { authenticateToken, requireRole } from '../middleware/auth';
import { upload } from '../config/cloudinary';

const router = express.Router();

// Get featured image (public)
router.get('/', async (req, res) => {
  try {
    const featuredImage = await FeaturedImage.findOne().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: { featuredImage },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

// Update/Create featured image (admin only)
router.put('/', authenticateToken, requireRole(['admin']), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: req.t('errors.image_required')
      });
    }

    // Delete existing featured image
    await FeaturedImage.deleteMany({});

    // Create new featured image
    const featuredImage = new FeaturedImage({
      image: req.file.path,
    });

    await featuredImage.save();

    res.json({
      success: true,
      message: req.t('messages.featured_image_updated'),
      data: { featuredImage },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

// Delete featured image (admin only)
router.delete('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    await FeaturedImage.deleteMany({});

    res.json({
      success: true,
      message: req.t('messages.featured_image_deleted'),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

export default router;