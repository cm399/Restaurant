const express = require('express');
const {body} = require('express-validator');

const replyController = require('../controllers/reply');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/reply/:id', replyController.getReplies);

router.post('/reply/:id', isAuth, [
    body('comment').trim().isLength({min: 5})
], replyController.postReply);

router.delete('/reply/:id', isAuth, replyController.deleteReply);

module.exports = router;