import express from 'express';
import { Log } from '../models/Log';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Create log (admin only)
router.post('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const log = new Log({
      data: req.body,
    });

    await log.save();

    res.status(201).json({
      success: true,
      message: req.t('messages.log_created'),
      data: { log },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

// Get all logs (admin only)
router.get('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const logs = await Log.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Log.countDocuments();

    res.json({
      success: true,
      data: {
        logs,
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

// Get log by ID (admin only)
router.get('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);
    if (!log) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.log_not_found')
      });
    }

    res.json({
      success: true,
      data: { log },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

// Delete log (admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const log = await Log.findByIdAndDelete(req.params.id);
    if (!log) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.log_not_found')
      });
    }

    res.json({
      success: true,
      message: req.t('messages.log_deleted'),
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