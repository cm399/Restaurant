const User = require('../models/user');
const Restaurant = require('../models/restaurant');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
require('dotenv').config()

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation error. Entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    User.findOne({email: req.body.email})
        .then(user => {
            if(user){
                const error = new Error('Email already exists.');
                error.statusCode = 401;
                throw error;
            }
            return bcrypt.hash(req.body.password, 12)
        })
        .then(hashedPassword => {
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                role: 'User'
            });

            return user.save();
        })
        .then(result => {
            res.status(201).json({message: 'User added successfully!', user: {_id: result._id}});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.addUser = (req, res, next) => {
    if(req.role === 'Admin'){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = new Error('Validation error. Entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }

        if(!['Admin','Owner','User'].includes(req.body.role)){
            const error = new Error('Invalid role');
            error.statusCode = 422;
            throw error;
        }

        User.findOne({email: req.body.email})
            .then(user => {
                if(user){
                    const error = new Error('Email already exists.');
                    error.statusCode = 401;
                    throw error;
                }
                return bcrypt.hash(req.body.password, 12)
            })
            .then(hashedPassword => {
                const user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword,
                    role: req.body.role
                });

                return user.save();
            })
            .then(result => {
                res.status(201).json({message: 'User added successfully!', user: {_id: result._id}});
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

exports.signin = (req, res, next) => {
    let loadedUser;

    User.findOne({email: req.body.email})
        .then(user => {
            if(!user){
                const error = new Error('Incorrect email.');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(isEqual => {
            if(!isEqual){
                const error = new Error('Incorrect password.');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({
                userId: loadedUser._id.toString(),
                role: loadedUser.role
            }, process.env.JWT_SECRET, {expiresIn: '24h'})
            res.status(200).json({message: 'Signin successful!', token: token, userId: loadedUser._id.toString(), email: loadedUser.email, role: loadedUser.role, restaurants: loadedUser.restaurants});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.getUsers = (req, res, next) => {
    if(req.role === 'Admin'){
        User.find()
            .then(users => {

                const updatedUsers = users.map(user => {
                    return {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                })

                res.status(200).json(updatedUsers);

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

exports.updateUsers = (req, res, next) => {

    if(req.role === 'Admin') {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = new Error('Validation error. Entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }

        User.findById(req.params.id)
            .then(user => {
                if(!user){
                    const error = new Error('Could not find user.');
                    error.statusCode = 404;
                    throw error;
                }

                return User.findOneAndUpdate({_id: req.params.id}, {name: req.body.name, email: req.body.email});

            })
            .then(() => {
                res.status(200).json({message: 'User edited successfully.'});
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

exports.deleteUser = (req, res, next) => {
    if(req.role === 'Admin'){

        let loadedUser;

        User.findById(req.params.id)
            .then(user => {
                if(!user){
                    const error = new Error('Could not find user.');
                    error.statusCode = 404;
                    throw error;
                }

                loadedUser = user;

                return User.deleteOne({_id: req.params.id});

            })
            .then(()=>{
                return Restaurant.deleteMany({owner: loadedUser._id})
            })
            .then(() => {
                res.status(200).json({message: 'User deleted successfully.'});
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