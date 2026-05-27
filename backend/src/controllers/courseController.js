/**
 * ═══════════════════════════════════════════════════════
 * Controller: Courses (MVC — Controller Layer)
 * Topic #14: Паттерни проектування (MVC)
 * Topic #17: NoSQL + MongoDB + Mongoose
 * Topic #19: Пагінація
 * ═══════════════════════════════════════════════════════
 */

import { Course, ActivityLog } from '../models/index.js';
import { ApiError } from '../middleware/errorHandler.js';

/**
 * GET /api/courses
 * Get paginated list of courses with filtering and sorting
 * Topic #19: Пагінація (skip + limit)
 */
export const getCourses = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 6,
      category,
      difficulty,
      search,
      sort = 'newest',
      minPrice,
      maxPrice,
    } = req.query;

    // ── Build filter query ──
    const filter = { is_published: true };

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$text = { $search: search };
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // ── Build sort options ──
    const sortOptions = {
      newest: { createdAt: -1 },
      popular: { students_count: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating: { rating: -1 },
    };

    const sortBy = sortOptions[sort] ?? sortOptions.newest;

    // ── Execute paginated query (Topic #19) ──
    const skip = (Number(page) - 1) * Number(limit);
    const [courses, totalCount] = await Promise.all([
      Course.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(Number(limit))
        .select('-modules'), // Exclude heavy nested data in list view
      Course.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / Number(limit));

    res.json({
      success: true,
      data: {
        courses,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalCount,
          limit: Number(limit),
          hasNextPage: Number(page) < totalPages,
          hasPrevPage: Number(page) > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/courses/:id
 * Get single course with full details (including modules/lectures)
 */
export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      throw new ApiError(404, 'Курс не знайдено');
    }

    // Log course view if authenticated
    if (req.user?.id) {
      await ActivityLog.create({
        user_id: req.user.id,
        action: 'course_view',
        details: { courseId: course._id, courseTitle: course.title },
      });
    }

    res.json({
      success: true,
      data: { course },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/courses (Admin only)
 * Create a new course
 */
export const createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Курс створено успішно',
      data: { course },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/courses/categories/stats
 * Get course count by category
 */
export const getCategoryStats = async (_req, res, next) => {
  try {
    const stats = await Course.aggregate([
      { $match: { is_published: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          avgRating: { $avg: '$rating' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    next(error);
  }
};
