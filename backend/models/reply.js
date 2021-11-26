const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    repliedTo: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Reply', replySchema);