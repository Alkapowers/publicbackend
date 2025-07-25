import express from 'express';
import { TeamMember } from '../models/TeamMember';
import { authenticateToken, requireRole } from '../middleware/auth';
import { upload } from '../config/cloudinary';

const router = express.Router();

// Get all team members (public)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const teamMembers = await TeamMember.find().skip(skip).limit(limit);
    const total = await TeamMember.countDocuments();

    res.json({
      success: true,
      data: {
        teamMembers,
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

// Get team member by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.team_member_not_found')
      });
    }

    res.json({
      success: true,
      data: { teamMember },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

// Create team member (admin only)
router.post('/', authenticateToken, requireRole(['admin']), upload.single('image'), async (req, res) => {
  try {
    const { firstName, lastName, position, message } = req.body;

    const teamMemberData: any = {
      firstName,
      lastName,
      position,
      message,
    };

    if (req.file) {
      teamMemberData.image = req.file.path;
    }

    const teamMember = new TeamMember(teamMemberData);
    await teamMember.save();

    res.status(201).json({
      success: true,
      message: req.t('messages.team_member_created'),
      data: { teamMember },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

// Update team member (admin only)
router.put('/:id', authenticateToken, requireRole(['admin']), upload.single('image'), async (req, res) => {
  try {
    const { firstName, lastName, position, message } = req.body;

    const updateData: any = {
      firstName,
      lastName,
      position,
      message,
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.team_member_not_found')
      });
    }

    res.json({
      success: true,
      message: req.t('messages.team_member_updated'),
      data: { teamMember },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

// Delete team member (admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndDelete(req.params.id);
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.team_member_not_found')
      });
    }

    res.json({
      success: true,
      message: req.t('messages.team_member_deleted'),
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