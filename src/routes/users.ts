import express from 'express';
import { User } from '../models/User';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';
import { upload } from '../config/cloudinary';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find().select('-password').skip(skip).limit(limit);
    const total = await User.countDocuments();

    res.json({
      success: true,
      data: {
        users,
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

// Get user by ID (admin only)
router.get('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.user_not_found')
      });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

// Update user (admin only)
router.put('/:id', authenticateToken, requireRole(['admin']), upload.single('profilePicture'), async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, roles } = req.body;
    
    const updateData: any = {
      firstName,
      lastName,
      email,
      phoneNumber,
    };

    if (req.file) {
      updateData.profilePicture = req.file.path;
    }

    if (roles) {
      updateData.roles = Array.isArray(roles) ? roles : [roles];
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.user_not_found')
      });
    }

    res.json({
      success: true,
      message: req.t('messages.user_updated'),
      data: { user },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

// Delete user (admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.user_not_found')
      });
    }

    res.json({
      success: true,
      message: req.t('messages.user_deleted'),
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