const Query = require('../models/Query');

// @desc    Create new hostel query
exports.createQuery = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const query = await Query.create({
            student: req.user.id,
            title,
            description,
            category
        });
        res.status(201).json(query);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all queries
exports.getQueries = async (req, res) => {
    try {
        const queries = await Query.find().populate('student', 'fullName roomNumber');
        res.json(queries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upvote a query
exports.upvoteQuery = async (req, res) => {
    try {
        const query = await Query.findById(req.params.id);
        if (!query) return res.status(404).json({ message: 'Query not found' });

        // Check if user already voted
        if (query.votes.includes(req.user.id)) {
            return res.status(400).json({ message: 'You have already voted for this issue' });
        }

        query.votes.push(req.user.id);
        await query.save();
        res.json({ message: 'Vote added', votes: query.votes.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};