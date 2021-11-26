const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    ratedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    ratedOn: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Restaurant',
    },
    reply: {
        type: mongoose.Schema.ObjectId,
        ref: 'Reply'
    },
    name: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Review', reviewSchema);