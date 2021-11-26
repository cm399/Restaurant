const mongoose = require('mongoose');

const restaurantsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    reviews: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Review'
    }],
    rating: {
        type: Number,
        default: 0
    }
}, {timestamps: true})

module.exports = mongoose.model('Restaurant', restaurantsSchema);