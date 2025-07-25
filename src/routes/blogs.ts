import express from 'express';
import { Blog } from '../models/Blog';
import { authenticateToken, requireRole } from '../middleware/auth';
import { upload } from '../config/cloudinary';

const router = express.Router();

// Get all blogs (public)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find().skip(skip).limit(limit);
    const total = await Blog.countDocuments();

    res.json({
      success: true,
      data: {
        blogs,
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

// Get blog by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.blog_not_found')
      });
    }

    res.json({
      success: true,
      data: { blog },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

// Create blog (admin only)
router.post('/', authenticateToken, requireRole(['admin']), upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, content } = req.body;

    const blogData: any = {
      title,
      subtitle,
      content,
    };

    if (req.file) {
      blogData.image = req.file.path;
    }

    const blog = new Blog(blogData);
    await blog.save();

    res.status(201).json({
      success: true,
      message: req.t('messages.blog_created'),
      data: { blog },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

// Update blog (admin only)
router.put('/:id', authenticateToken, requireRole(['admin']), upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, content } = req.body;

    const updateData: any = {
      title,
      subtitle,
      content,
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.blog_not_found')
      });
    }

    res.json({
      success: true,
      message: req.t('messages.blog_updated'),
      data: { blog },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

// Delete blog (admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.blog_not_found')
      });
    }

    res.json({
      success: true,
      message: req.t('messages.blog_deleted'),
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