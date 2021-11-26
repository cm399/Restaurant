const Restaurant = require('../models/restaurant');
const Review = require('../models/review');
const User = require('../models/user');
const {validationResult} = require('express-validator');
const path = require("path");
const fs = require("fs");

exports.getRestaurants = (req, res, next) => {

    Restaurant.find()
        .then(restaurants => {
            res.status(200).json(restaurants);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.postRestaurant = (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({message: "Validation error. Entered data is incorrect."});
    }

    if (!req.file) {
        const error = new Error('No image provided.');
        error.statusCode = 422;
        throw error;
    }

    if(req.role === 'Owner'){

        let createdRestaurant;

        const restaurant = new Restaurant({
            name: req.body.name,
            imageUrl: req.file.path,
            owner: req.userId,
            rating: 0
        });
        restaurant.save()
            .then(result => {
                createdRestaurant = result;
                return User.findById(req.userId);
            })
            .then(user => {
                user.restaurants.push(restaurant);
                return user.save();
            })
            .then(() => {
                res.status(201).json({message: 'Restaurant added successfully!', restaurant: createdRestaurant});
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

exports.getRestaurant = (req, res, next) => {
    Restaurant.findById(req.params.id)
        .then(restaurant => {
            if(!restaurant){
                const error = new Error('Could not find restaurant.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json(restaurant);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.editRestaurant = (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({message: "Validation error. Entered data is incorrect."});
    }

    if(req.role === 'Admin'){
        Restaurant.findById(req.params.id)
            .then(restaurant => {
                if(!restaurant){
                    const error = new Error('Could not find restaurant.');
                    error.statusCode = 404;
                    throw error;
                }

                let file = restaurant.imageUrl;
                if(req.file){
                    clearImage(restaurant.imageUrl);
                    file = req.file.path
                }

                return Restaurant.findOneAndUpdate({_id: req.params.id}, {name: req.body.name, imageUrl: file});
            })
            .then(()=>{
                res.status(200).json({message: 'Restaurant edited successfully!'});
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

exports.deleteRestaurant = (req, res, next) => {

    if(req.role === 'Admin'){
        Restaurant.findById(req.params.id)
            .then(restaurant => {
                if(!restaurant){
                    const error = new Error('Could not find restaurant.');
                    error.statusCode = 404;
                    throw error;
                }

                clearImage(restaurant.imageUrl);
                return Restaurant.deleteOne({_id: req.params.id});
            })
            .then(() => {
                return Review.deleteMany({ratedOn: req.params.id})
            })
            .then(()=>{
                return User.findById(req.userId);
            })
            .then(user => {
                user.restaurants.pull(req.params.id);
                return user.save();
            })
            .then(() => {
                res.status(200).json({message: 'Restaurant deleted successfully.'});
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

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};