import express from 'express';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Blog } from '../models/Blog';
import { Review } from '../models/Review';
import { CaseStudy } from '../models/CaseStudy';
import { Log } from '../models/Log';
import { TeamMember } from '../models/TeamMember';
import { FAQ } from '../models/FAQ';

const router = express.Router();

// Get all stats (public)
router.get('/', async (req, res) => {
  try {
    const [
      usersCount,
      productsCount,
      blogsCount,
      reviewsCount,
      caseStudiesCount,
      logsCount,
      teamMembersCount,
      faqsCount,
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Blog.countDocuments(),
      Review.countDocuments(),
      CaseStudy.countDocuments(),
      Log.countDocuments(),
      TeamMember.countDocuments(),
      FAQ.countDocuments(),
    ]);

    const stats = {
      users: usersCount,
      products: productsCount,
      blogs: blogsCount,
      reviews: reviewsCount,
      caseStudies: caseStudiesCount,
      logs: logsCount,
      teamMembers: teamMembersCount,
      faqs: faqsCount,
      total: usersCount + productsCount + blogsCount + reviewsCount + caseStudiesCount + logsCount + teamMembersCount + faqsCount,
    };

    res.json({
      success: true,
      data: { stats },
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