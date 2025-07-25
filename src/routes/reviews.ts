import express from 'express';
import { Review } from '../models/Review';
import { authenticateToken, requireRole } from '../middleware/auth';
import { upload } from '../config/cloudinary';

const router = express.Router();

// Get all reviews (public)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find().skip(skip).limit(limit);
    const total = await Review.countDocuments();

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

// Get review by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.review_not_found')
      });
    }

    res.json({
      success: true,
      data: { review },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

// Create review (admin only)
router.post('/', authenticateToken, requireRole(['admin']), upload.single('image'), async (req, res) => {
  try {
    const { firstName, lastName, stars, position } = req.body;

    const reviewData: any = {
      firstName,
      lastName,
      stars: parseInt(stars),
      position,
    };

    if (req.file) {
      reviewData.image = req.file.path;
    }

    const review = new Review(reviewData);
    await review.save();

    res.status(201).json({
      success: true,
      message: req.t('messages.review_created'),
      data: { review },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

// Update review (admin only)
router.put('/:id', authenticateToken, requireRole(['admin']), upload.single('image'), async (req, res) => {
  try {
    const { firstName, lastName, stars, position } = req.body;

    const updateData: any = {
      firstName,
      lastName,
      stars: parseInt(stars),
      position,
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.review_not_found')
      });
    }

    res.json({
      success: true,
      message: req.t('messages.review_updated'),
      data: { review },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

// Patch review (admin only)
router.patch('/:id', authenticateToken, requireRole(['admin']), upload.single('image'), async (req, res) => {
  try {
    const updateData: any = { ...req.body };

    if (req.file) {
      updateData.image = req.file.path;
    }

    if (updateData.stars) {
      updateData.stars = parseInt(updateData.stars);
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.review_not_found')
      });
    }

    res.json({
      success: true,
      message: req.t('messages.review_updated'),
      data: { review },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

// Delete review (admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.review_not_found')
      });
    }

    res.json({
      success: true,
      message: req.t('messages.review_deleted'),
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