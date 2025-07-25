import express from 'express';
import { CaseStudy } from '../models/CaseStudy';
import { authenticateToken, requireRole } from '../middleware/auth';
import { upload } from '../config/cloudinary';

const router = express.Router();

// Get all case studies (public)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const caseStudies = await CaseStudy.find().skip(skip).limit(limit);
    const total = await CaseStudy.countDocuments();

    res.json({
      success: true,
      data: {
        caseStudies,
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

// Get case study by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findById(req.params.id);
    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.case_study_not_found')
      });
    }

    res.json({
      success: true,
      data: { caseStudy },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

// Create case study (admin only)
router.post('/', authenticateToken, requireRole(['admin']), upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, content } = req.body;

    const caseStudyData: any = {
      title,
      subtitle,
      content,
    };

    if (req.file) {
      caseStudyData.image = req.file.path;
    }

    const caseStudy = new CaseStudy(caseStudyData);
    await caseStudy.save();

    res.status(201).json({
      success: true,
      message: req.t('messages.case_study_created'),
      data: { caseStudy },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

// Update case study (admin only)
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

    const caseStudy = await CaseStudy.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.case_study_not_found')
      });
    }

    res.json({
      success: true,
      message: req.t('messages.case_study_updated'),
      data: { caseStudy },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

// Delete case study (admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findByIdAndDelete(req.params.id);
    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.case_study_not_found')
      });
    }

    res.json({
      success: true,
      message: req.t('messages.case_study_deleted'),
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