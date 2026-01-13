const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    status: {
        type: String,
        enum: ['Open', 'Assigned', 'In Progress', 'Resolved', 'Rejected'],
        default: 'Open'
    },
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs to prevent double voting
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Query', querySchema);