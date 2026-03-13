const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @desc      Get all resources (with search and filtering)
// @route     GET /api/v1/resources
// @access    Public
router.get('/', async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude from normal matching
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query object
    let queryStr = JSON.stringify(reqQuery);
    // Create operators ($gt, $gte, etc) in case user wants to filter by year later
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    let parsedQuery = JSON.parse(queryStr);

    // Text search if search param is present
    if (req.query.search) {
      parsedQuery.$text = { $search: req.query.search };
    }

    query = Resource.find(parsedQuery);

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Resource.countDocuments(parsedQuery);

    query = query.skip(startIndex).limit(limit);

    // Sort by publicationYear by default if no other sort is specified
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-publicationYear');
    }

    // Executing query
    const resources = await query;

    // Pagination result
    const pagination = {};
    if (endIndex < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: resources.length,
      pagination,
      data: resources
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// @desc      Get single resource
// @route     GET /api/v1/resources/:id
// @access    Public
router.get('/:id', async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, error: 'Resource not found' });
    res.status(200).json({ success: true, data: resource });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// @desc      Get recommendations
// @route     GET /api/v1/resources/recommendations/me
// @access    Private
router.get('/recommendations/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const course = user.course;
    
    if (!course) {
      return res.status(400).json({ success: false, error: 'No course associated with user' });
    }

    // Basic recommendation system: Find resources related to user's course string
    const recommendations = await Resource.find({
      $text: { $search: course }
    }).limit(10);
    
    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// @desc      Bookmark a resource
// @route     POST /api/v1/resources/:id/bookmark
// @access    Private
router.post('/:id/bookmark', protect, async (req, res, next) => {
  try {
    const resourceId = req.params.id;
    const resource = await Resource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }

    const user = await User.findById(req.user.id);
    
    // Check if already bookmarked
    if (user.bookmarks.includes(resourceId)) {
      return res.status(400).json({ success: false, error: 'Already bookmarked' });
    }

    user.bookmarks.push(resourceId);
    await user.save();

    res.status(200).json({ success: true, data: user.bookmarks });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// @desc      Remove bookmark
// @route     DELETE /api/v1/resources/:id/bookmark
// @access    Private
router.delete('/:id/bookmark', protect, async (req, res, next) => {
  try {
    const resourceId = req.params.id;
    const user = await User.findById(req.user.id);
    
    user.bookmarks = user.bookmarks.filter(id => id.toString() !== resourceId.toString());
    await user.save();

    res.status(200).json({ success: true, data: user.bookmarks });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// @desc      Get User Bookmarks
// @route     GET /api/v1/resources/user/bookmarks
// @access    Private
router.get('/user/bookmarks', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('bookmarks');
    res.status(200).json({
      success: true,
      count: user.bookmarks.length,
      data: user.bookmarks
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
