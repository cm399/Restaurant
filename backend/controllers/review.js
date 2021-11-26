const {validationResult} = require("express-validator");
const Restaurant = require("../models/restaurant");
const Review = require("../models/review");
const Reply = require("../models/reply");
const User = require("../models/user");

exports.getReviews = (req, res, next) => {
    Review.find().where({ratedOn: req.params.id})
        .then(reviews => {
            res.status(200).json(reviews);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.rateRestaurant = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({message: "Validation error. Entered data is incorrect."});
    }

    const review = new Review({
        rating: req.body.rating,
        comment: req.body.comment,
        ratedBy: req.userId,
        ratedOn: req.params.id
    });

    let createdReview;

    User.findById(req.userId)
        .then(user => {
            review.name = user.name;
            return review.save();
        })
        .then(result => {
            createdReview = result;
            return Restaurant.findById(req.params.id);
        })
        .then(restaurant => {
            restaurant.reviews.push(review);
            restaurant.rating = ((restaurant.rating*(restaurant.reviews.length-1)) + req.body.rating)/restaurant.reviews.length;
            return restaurant.save()
        })
        .then(() => {
            res.status(201).json({message: 'Review added successfully!', restaurant: createdReview});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.deleteReview = (req, res, next) => {
    if(req.role === 'Admin'){

        let reviewDel;

        Review.findById(req.params.id)
            .then(review => {

                if(!review){
                    const error = new Error('Could not find review.');
                    error.statusCode = 404;
                    throw error;
                }

                reviewDel = review;

                return Review.deleteOne({_id: req.params.id})
            })
            .then(() => {
                return Reply.findOneAndDelete({ratedOn: req.params.id})
            })
            .then(()=>{
                return Restaurant.findById(reviewDel.ratedOn);
            })
            .then(restaurant => {
                restaurant.reviews.pull(req.params.id);
                const updatedRating = ((restaurant.rating*(restaurant.reviews.length+1)) - reviewDel.rating)/restaurant.reviews.length;
                restaurant.rating = updatedRating  ? updatedRating : 0;
                restaurant.save();
            })
            .then(() => {
                res.status(200).json({message: 'Review deleted successfully.'});
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