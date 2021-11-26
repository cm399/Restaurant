const {validationResult} = require('express-validator');
const Reply = require('../models/reply');
const Review = require('../models/review');
const User = require('../models/user');

exports.getReplies = (req, res, next) => {
    Reply.findOne({repliedTo: req.params.id})
        .then(replies => {
            res.status(200).json(replies);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.postReply = (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error("Validation error. Entered data is incorrect.");
        error.statusCode = 422;
        throw error;
    }

    if(req.role === 'Owner'){
        Reply.deleteOne({repliedTo: req.params.id})
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });

        const reply = new Reply({
            comment: req.body.comment,
            repliedTo: req.params.id
        });

        let createdReply;

        User.findById(req.userId)
            .then(user => {
                reply.name = user.name;
                return reply.save();
            })
            .then(result => {
                createdReply = result;
                return Review.findById(req.params.id);
            })
            .then(review => {
                review.reply = createdReply;
                return review.save();
            })
            .then(()=>{
                res.status(201).json({message: 'Reply added successfully!', review: createdReply});
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    }
    else {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }

}

exports.deleteReply = (req, res, next) => {

    if(req.role === 'Admin'){

        let deletedReply;

        Reply.findById(req.params.id)
            .then(reply => {
                if(!reply){
                    const error = new Error('Could not find reply.');
                    error.statusCode = 404;
                    throw error;
                }

                deletedReply = reply;
                return Reply.deleteOne({_id: req.params.id})
            })
            .then(() => {
                return Review.findOne({reply: deletedReply._id});
            })
            .then(review => {
                review.reply = undefined;
                return review.save();
            })
            .then(()=>{
                res.status(200).json({message: 'Reply deleted successfully.'});
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    }
    else {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }

}