import express from 'express';
import { Product } from '../models/Product';
import { authenticateToken, requireRole } from '../middleware/auth';
import { upload } from '../config/cloudinary';

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(limit);
    const total = await Product.countDocuments();

    res.json({
      success: true,
      data: {
        products,
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

// Get product by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.product_not_found')
      });
    }

    res.json({
      success: true,
      data: { product },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

// Create product (admin only)
router.post('/', authenticateToken, requireRole(['admin']), upload.fields([
  { name: 'featuredImage', maxCount: 1 },
  { name: 'detailImages', maxCount: 10 }
]), async (req, res) => {
  try {
    const { title, description, keypoints, details } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const productData: any = {
      title,
      description,
      keypoints: Array.isArray(keypoints) ? keypoints : [keypoints],
    };

    if (files.featuredImage && files.featuredImage[0]) {
      productData.featuredImage = files.featuredImage[0].path;
    }

    if (details) {
      const parsedDetails = Array.isArray(details) ? details : [details];
      productData.details = parsedDetails.map((detail: any, index: number) => ({
        content: detail.content || detail,
        image: files.detailImages && files.detailImages[index] ? files.detailImages[index].path : undefined,
      }));
    }

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: req.t('messages.product_created'),
      data: { product },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

// Update product (admin only)
router.put('/:id', authenticateToken, requireRole(['admin']), upload.fields([
  { name: 'featuredImage', maxCount: 1 },
  { name: 'detailImages', maxCount: 10 }
]), async (req, res) => {
  try {
    const { title, description, keypoints, details } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const updateData: any = {
      title,
      description,
      keypoints: Array.isArray(keypoints) ? keypoints : [keypoints],
    };

    if (files.featuredImage && files.featuredImage[0]) {
      updateData.featuredImage = files.featuredImage[0].path;
    }

    if (details) {
      const parsedDetails = Array.isArray(details) ? details : [details];
      updateData.details = parsedDetails.map((detail: any, index: number) => ({
        content: detail.content || detail,
        image: files.detailImages && files.detailImages[index] ? files.detailImages[index].path : undefined,
      }));
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.product_not_found')
      });
    }

    res.json({
      success: true,
      message: req.t('messages.product_updated'),
      data: { product },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: req.t('errors.server_error'),
      error: error.message,
    });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: req.t('errors.product_not_found')
      });
    }

    res.json({
      success: true,
      message: req.t('messages.product_deleted'),
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