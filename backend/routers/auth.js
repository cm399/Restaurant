const express = require('express');
const {body, checkSchema} = require('express-validator');

const authController = require('../controllers/auth');
const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get('/users', isAuth, authController.getUsers);

router.put('/user/:id', isAuth, [
    body('name').trim().not().isEmpty(),
    body('email').isEmail().withMessage('Enter a valid email.')
], authController.updateUsers);

router.post('/user', [
    body('name').trim().not().isEmpty(),
    body('email').isEmail().withMessage('Enter a valid email.'),
    body('password').isLength({min: 5})
], isAuth, authController.addUser);

router.post('/signup', [
    body('name').trim().not().isEmpty(),
    body('email').isEmail().withMessage('Enter a valid email.'),
    body('password').isLength({min: 5}),
], authController.signup);

router.post('/signin', authController.signin);

router.delete('/user/:id', isAuth, authController.deleteUser);

module.exports = router;