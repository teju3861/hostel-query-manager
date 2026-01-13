const express = require('express');
const router = express.Router();
const { createQuery, getQueries, upvoteQuery } = require('../controllers/queryController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Students can create, everyone (protected) can view
router.route('/')
    .post(protect, authorize('student'), createQuery)
    .get(protect, getQueries);

// Upvoting is for students
router.put('/:id/vote', protect, authorize('student'), upvoteQuery);

module.exports = router;