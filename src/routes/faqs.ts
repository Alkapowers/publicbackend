import express from 'express';
import { FAQ } from '../models/FAQ';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Get all FAQs (public)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const faqs = await FAQ.find().skip(skip).limit(limit);
    const total = await FAQ.countDocuments();

    res.json({
      success: true,
      data: {
        faqs,
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

// Get FAQ by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.faq_not_found')
      });
    }

    res.json({
      success: true,
      data: { faq },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

// Create FAQ (admin only)
router.post('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { question, answer } = req.body;

    const faq = new FAQ({
      question,
      answer,
    });

    await faq.save();

    res.status(201).json({
      success: true,
      message: req.t('messages.faq_created'),
      data: { faq },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

// Update FAQ (admin only)
router.put('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { question, answer } = req.body;

    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      { question, answer },
      { new: true, runValidators: true }
    );

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.faq_not_found')
      });
    }

    res.json({
      success: true,
      message: req.t('messages.faq_updated'),
      data: { faq },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

// Delete FAQ (admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.faq_not_found')
      });
    }

    res.json({
      success: true,
      message: req.t('messages.faq_deleted'),
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