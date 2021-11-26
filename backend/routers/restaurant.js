const express = require('express');
const {body} = require('express-validator');

const restaurantsController = require('../controllers/restaurant');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/restaurants', restaurantsController.getRestaurants);

router.post('/restaurant', isAuth, [
    body('name').trim().isLength({min: 5}).withMessage('Name should be more than 5 letters long.')
], restaurantsController.postRestaurant);

router.get('/restaurant/:id', restaurantsController.getRestaurant);

router.put('/restaurant/:id', isAuth, [
    body('name').trim().isLength({min: 5}).withMessage('Name should be more than 5 letters long.')
], restaurantsController.editRestaurant);

router.delete('/restaurant/:id', isAuth, restaurantsController.deleteRestaurant);

module.exports = router;