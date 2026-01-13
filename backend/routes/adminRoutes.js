const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    approveStudent,
    updateQueryStatus,
    getPendingStudents // Import the new function
} = require('../controllers/adminController');

// Route to get pending students (This was missing!)
router.get('/pending-students', protect, authorize('warden', 'admin'), getPendingStudents);

// Route to approve a specific student
router.put('/approve-student/:id', protect, authorize('warden', 'admin'), approveStudent);

// Route to update query status
router.put('/query-status/:id', protect, authorize('warden', 'staff'), updateQueryStatus);

module.exports = router;