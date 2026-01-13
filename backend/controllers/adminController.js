const User = require('../models/User');
const Query = require('../models/Query');

// @desc    Approve a student registration
// @route   PUT /api/admin/approve-student/:id
exports.getPendingStudents = async (req, res) => {
    try {
        // Find users who are students AND have approved set to false
        const pendingStudents = await User.find({ role: 'student', approved: false }).select('-password');
        res.json(pendingStudents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.approveStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        student.approved = true;
        await student.save();
        res.json({ message: 'Student approved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Query Status (Warden/Staff)
// @route   PUT /api/admin/query-status/:id
exports.updateQueryStatus = async (req, res) => {
    try {
        const { status, remarks } = req.body;
        const query = await Query.findById(req.params.id);

        if (!query) return res.status(404).json({ message: 'Query not found' });

        query.status = status;

        // Add to the audit log
        query.approvalLog.push({
            actor: req.user.id,
            action: `Status changed to ${status}`,
            remarks: remarks
        });

        await query.save();
        res.json(query);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};